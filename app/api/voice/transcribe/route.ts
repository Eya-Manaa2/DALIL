import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'

export const maxDuration = 30

const MAX_BYTES = 4 * 1024 * 1024
const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions'

// Biases the model toward Tunisian darija (often mixed with French) and the proper nouns
// users actually say: programs, funds, and governorates that generic models tend to mishear.
// Only sent in Arabic mode: an Arabic prompt makes Whisper transcribe French speech as Arabic.
const TUNISIAN_VOCABULARY_HINT = [
  'علامة، نحب نسأل على المساعدات الاجتماعية في تونس.',
  'الكرني الأبيض، بطاقة العلاج، الأمان الاجتماعي، المنحة، بطاقة الإعاقة.',
  'CNSS, CNAM, CNRPS, carnet blanc, carte handicap, AMEN social, bourse.',
  'تونس، أريانة، بن عروس، منوبة، نابل، زغوان، بنزرت، باجة، جندوبة، الكاف، سليانة.',
].join(' ')

const FRENCH_VOCABULARY_HINT =
  'Bonjour, je cherche une aide sociale en Tunisie : AMEN Social, carnet blanc, carte de soins, carte handicap, CNSS, CNAM, CNRPS.'

export async function POST(req: Request) {
  if (!(await checkRateLimit(req, limits.transcribe))) return tooManyRequests()

  if (!process.env.GROQ_API_KEY) {
    console.error('[voice/transcribe] GROQ_API_KEY is not set')
    return Response.json({ error: 'transcription_unavailable' }, { status: 503 })
  }

  const form = await req.formData().catch(() => null)
  const audio = form?.get('audio')
  const lang = form?.get('lang') === 'fr' ? 'fr' : 'ar'

  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({ error: 'missing_audio' }, { status: 400 })
  }
  if (audio.size > MAX_BYTES) {
    return Response.json({ error: 'audio_too_large' }, { status: 413 })
  }
  if (!audio.type.startsWith('audio/')) {
    return Response.json({ error: 'invalid_audio_type' }, { status: 415 })
  }

  const body = new FormData()
  body.append('file', audio)
  body.append('model', 'whisper-large-v3-turbo')
  if (lang === 'fr') {
    body.append('language', 'fr')
    body.append('prompt', FRENCH_VOCABULARY_HINT)
  } else {
    // Darija mixes Arabic and French, so the language is left to auto-detection.
    body.append('prompt', TUNISIAN_VOCABULARY_HINT)
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body,
      signal: AbortSignal.timeout(25_000),
    })
    if (!response.ok) {
      console.error('[voice/transcribe] Groq error', response.status, await response.text())
      return Response.json({ error: 'transcription_failed' }, { status: 502 })
    }
    const data = (await response.json()) as { text?: string }
    return Response.json({ text: (data.text ?? '').trim() })
  } catch (error) {
    console.error('[voice/transcribe]', error)
    return Response.json({ error: 'transcription_failed' }, { status: 502 })
  }
}
