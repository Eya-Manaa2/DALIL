import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'

export const maxDuration = 30

const MAX_BYTES = 4 * 1024 * 1024

// Biases the model toward Tunisian darija (often mixed with French) and the proper nouns
// users actually say: programs, funds, and governorates that generic models tend to mishear.
const TUNISIAN_VOCABULARY_HINT = [
  'علامة، نحب نسأل على المساعدات الاجتماعية في تونس.',
  'الكرني الأبيض، بطاقة العلاج، الأمان الاجتماعي، المنحة، بطاقة الإعاقة.',
  'CNSS, CNAM, CNRPS, carnet blanc, carte handicap, AMEN social, bourse.',
  'تونس، أريانة، بن عروس، منوبة، نابل، زغوان، بنزرت، باجة، جندوبة، الكاف، سليانة.',
].join(' ')

export async function POST(req: Request) {
  // Rate limit check - fail open if database is unavailable
  const rateLimitOk = await checkRateLimit(req, limits.transcribe).catch(() => true)
  if (!rateLimitOk) return tooManyRequests()
  
  const form = await req.formData()
  const audio = form.get('audio')

  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({ error: 'missing_audio' }, { status: 400 })
  }
  if (audio.size > MAX_BYTES) {
    return Response.json({ error: 'audio_too_large' }, { status: 413 })
  }
  if (!audio.type.startsWith('audio/')) {
    return Response.json({ error: 'invalid_audio_type' }, { status: 415 })
  }

  try {
    // Use Groq API directly for transcription
    const formData = new FormData()
    formData.append('file', audio)
    formData.append('model', 'whisper-large-v3-turbo')
    formData.append('prompt', TUNISIAN_VOCABULARY_HINT)
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('[voice/transcribe] Groq error:', error)
      throw new Error('Groq transcription failed')
    }
    
    const data = await response.json()
    return Response.json({ text: data.text.trim() })
  } catch (error) {
    console.error('[voice/transcribe]', error)
    return Response.json({ error: 'transcription_failed' }, { status: 502 })
  }
}
