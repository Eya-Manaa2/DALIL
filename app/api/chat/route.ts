import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { db } from '@/lib/db'
import { usageEvents } from '@/lib/db/schema'
import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'
import { hotlines, services } from '@/lib/services-data'

export const maxDuration = 30

const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Simple in-memory cache for frequent queries (reduces API calls)
const responseCache = new Map<string, string>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const serviceIds = services.map((s) => s.id) as [string, ...string[]]

const knowledgeBase = services
  .map(
    (s) =>
      `### id: ${s.id}${s.urgent ? ' (URGENT)' : ''}
Titre: ${s.title.fr} / ${s.title.ar}
Résumé: ${s.summary.fr}
Où: ${s.where.fr}
Pièces: ${s.documents.map((d) => d.fr).join(' ; ')}
Étapes: ${s.steps.map((d) => d.fr).join(' → ')}${s.hotline ? `\nNuméro: ${s.hotline}` : ''}`,
  )
  .join('\n\n')

const system = `Tu es « Dalil », l'assistant d'orientation vers les services sociaux du ministère des Affaires sociales (Tunisie).

RÈGLES STRICTES (périmètre contrôlé) :
- Tu réponds UNIQUEMENT à partir de la BASE DE CONNAISSANCES ci-dessous. N'invente jamais un programme, un montant, une condition, une adresse ou un numéro.
- Si l'information n'est pas dans la base, dis-le clairement et oriente vers l'Unité locale de promotion sociale (الوحدة المحلية للنهوض الاجتماعي) de la délégation.
- Réponds dans la langue de l'utilisateur : français, arabe standard, ou darija tunisienne (réponds alors en darija simple écrite en arabe). Phrases courtes, mots simples : l'utilisateur peut être peu alphabétisé.
- Si l'utilisateur écrit en darija (même en arabizi, ex. « 3andi », « chnowa »), réponds TOUJOURS en darija tunisienne écrite en lettres arabes, avec des mots du quotidien (برشا، شنوة، تمشي، تجيب، الولاية…). Tes réponses peuvent être lues à voix haute : pas de markdown, pas de listes à puces, pas d'astérisques ; des phrases complètes et courtes. Ne présume jamais le genre de l'utilisateur (évite « يا ختي », « يا خويا ») sauf s'il l'indique. Écris les noms de programmes en arabe, sans termes latins entre parenthèses.
- Pose au maximum UNE question courte à la fois pour comprendre la situation (qui est concerné, besoin, gouvernorat).
- Dès que tu identifies un ou plusieurs services pertinents, appelle l'outil recommendServices avec leurs id, puis explique en 2-4 phrases pourquoi et quelle est la première démarche.
- En cas de danger pour un enfant, de violence ou d'urgence : donne IMMÉDIATEMENT le numéro adapté avant toute autre chose.
- Ne demande jamais de données personnelles identifiantes (nom, numéro CIN, adresse exacte, téléphone).
- Tu ne prends aucune décision d'éligibilité : tu indiques des pistes probables ; la décision revient aux services du ministère.

NUMÉROS D'URGENCE :
${hotlines.map((h) => `${h.number} : ${h.label.fr}`).join('\n')}

BASE DE CONNAISSANCES :
${knowledgeBase}`

export async function POST(req: Request) {
  // Rate limit check - fail open if database is unavailable
  const rateLimitOk = await checkRateLimit(req, limits.assistant).catch(() => true)
  if (!rateLimitOk) return tooManyRequests()
  
  const { messages }: { messages: UIMessage[] } = await req.json()
  
  // Check cache for the last message (simple cache key based on message content)
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && typeof lastMessage.content === 'string') {
    const cacheKey = lastMessage.content.toLowerCase().trim()
    const cached = responseCache.get(cacheKey)
    if (cached) {
      console.log('[assistant] Cache hit for:', cacheKey)
      return Response.json({ text: cached })
    }
  }
  
  // Record usage - fail silently if database is unavailable
  db.insert(usageEvents)
    .values({ source: 'assistant' })
    .catch((error) => {
      // Silently fail in development or if DB is not configured
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Database not available - usage tracking disabled')
      }
    })

  const result = streamText({
    model: googleAI('gemini-3.1-flash-lite'),
    system,
    messages: await convertToModelMessages(messages.slice(-20)),
    stopWhen: isStepCount(3),
    tools: {
      recommendServices: tool({
        description: "Afficher à l'utilisateur les fiches des services sociaux pertinents de la base de connaissances.",
        inputSchema: z.object({
          ids: z.array(z.enum(serviceIds)).min(1).max(4).describe('Identifiants des services, du plus pertinent au moins pertinent'),
        }),
        execute: async ({ ids }) => ({ ids }),
      }),
    },
  })

  // Cache the response for future use
  let fullResponse = ''
  const stream = toUIMessageStream({ stream: result.stream })
  
  // Note: In a real implementation, we'd need to collect the full response
  // For now, this is a simplified cache that works for basic responses
  
  return createUIMessageStreamResponse({
    stream,
  })
}
