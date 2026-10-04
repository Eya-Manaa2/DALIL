import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'

export const maxDuration = 30

const MAX_CHARS = 1500

export async function POST(req: Request) {
  // Rate limit check - fail open if database is unavailable
  const rateLimitOk = await checkRateLimit(req, limits.speak).catch(() => true)
  if (!rateLimitOk) return tooManyRequests()
  
  const body = (await req.json().catch(() => null)) as { text?: unknown } | null
  const text = typeof body?.text === 'string' ? body.text.replace(/[*#_`>]/g, '').trim() : ''

  if (!text) return Response.json({ error: 'missing_text' }, { status: 400 })

  // Text-to-speech is handled client-side using browser SpeechSynthesis API
  // This endpoint is kept for compatibility but returns a simple success response
  return Response.json({ success: true, message: 'Use browser SpeechSynthesis API' })
}
