'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Check,
  History,
  Loader2,
  Mic,
  Pencil,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { cn } from '@/lib/utils'
import { useLang } from './lang-provider'
import { ServiceCard } from './service-card'
import { services } from '@/lib/services-data'

const MAX_RECORDING_MS = 120_000
const HISTORY_KEY = 'ai-assistant-history'
const MAX_HISTORY = 10

type RecState = 'idle' | 'recording' | 'transcribing'
type Playback = { id: string; loading: boolean } | null

const suggestions = {
  fr: ['Je n’ai pas de revenu et j’ai 3 enfants', 'Mon fils est handicapé, quelles aides ?', 'Un enfant est en danger dans mon quartier'],
  ar: ['ما عنديش دخل وعندي 3 صغار', 'ولدي عندو إعاقة، شنوة المساعدات؟', 'فما طفل في خطر في الحومة'],
}

const textOf = (parts: { type: string; text?: string }[]) =>
  parts.map((p) => (p.type === 'text' ? (p.text ?? '') : '')).join(' ').trim()

export function AiAssistant() {
  const { t, lang } = useLang()
  const [input, setInput] = useState('')
  const [recState, setRecState] = useState<RecState>('idle')
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [autoRead, setAutoRead] = useState(false)
  const [playback, setPlayback] = useState<Playback>(null)
  const [heard, setHeard] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const autoReadRef = useRef(autoRead)
  autoReadRef.current = autoRead

  const stopPlayback = () => {
    audioRef.current?.pause()
    audioRef.current = null
    window.speechSynthesis?.cancel()
    setPlayback(null)
  }

  const speak = async (id: string, text: string) => {
    const wasPlaying = playback?.id === id
    stopPlayback()
    if (wasPlaying || !text) return

    setPlayback({ id, loading: true })
    
    // Use browser SpeechSynthesis API directly (free, works on all browsers)
    try {
      // Cancel any ongoing speech before starting new one
      window.speechSynthesis?.cancel()
      
      // Resume speech synthesis if it was paused (browser policy)
      if (window.speechSynthesis?.paused) {
        window.speechSynthesis.resume()
      }
      
      // Detect language and get available voices
      const isArabic = /[\u0600-\u06FF]/.test(text)
      
      // Get voices - they might not be loaded immediately
      let voices = window.speechSynthesis?.getVoices() || []
      
      // If no voices, wait for them to load
      if (voices.length === 0) {
        await new Promise<void>((resolve) => {
          const handler = () => {
            voices = window.speechSynthesis?.getVoices() || []
            window.speechSynthesis?.removeEventListener('voiceschanged', handler)
            resolve()
          }
          window.speechSynthesis?.addEventListener('voiceschanged', handler)
          // Fallback timeout
          setTimeout(() => {
            window.speechSynthesis?.removeEventListener('voiceschanged', handler)
            resolve()
          }, 500)
        })
      }
      
      
      // Try to find a matching voice
      let lang = isArabic ? 'ar' : 'fr-FR'
      let voice = voices.find(v => v.lang.startsWith(lang))
      
      // If no matching voice, try fallback
      if (!voice) {
        if (isArabic) {
          voice = voices.find(v => v.lang.startsWith('ar'))
          if (!voice) {
            // Try any voice
            voice = voices[0]
            lang = voice?.lang || 'en-US'
          }
        } else {
          voice = voices.find(v => v.lang.startsWith('fr'))
          if (!voice) {
            // Try any voice
            voice = voices[0]
            lang = voice?.lang || 'en-US'
          }
        }
      }
      
      
      // Limit text length to avoid browser timeout
      const maxLength = 300
      const textToSpeak = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
      
      const u = new SpeechSynthesisUtterance(textToSpeak)
      u.lang = lang
      if (voice) u.voice = voice
      u.rate = 0.8
      u.pitch = 1
      u.volume = 1
      
      u.onend = () => {
        setPlayback(null)
      }
      u.onerror = (e) => {
          setPlayback(null)
      }
      
      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        window.speechSynthesis?.speak(u)
        setPlayback({ id, loading: false })
      }, 100)
      
    } catch (e) {
      console.error('[SpeechSynthesis] Failed:', e)
      setPlayback(null)
    }
  }

  const { messages, sendMessage, status, error } = useChat({
    onFinish: ({ message, isError, isAbort }) => {
      if (isError || isAbort || !autoReadRef.current) return
      void speak(message.id, textOf(message.parts))
    },
  })

  const busy = status === 'submitted' || status === 'streaming'

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    stopPlayback()
    sendMessage({ text: value })
    setInput('')
  }

  const uploadRecording = async (blob: Blob) => {
    setRecState('transcribing')
    try {
      const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm'
      const form = new FormData()
      form.append('audio', blob, `message.${ext}`)
      form.append('lang', lang)
      const res = await fetch('/api/voice/transcribe', { method: 'POST', body: form })
      const data = (await res.json().catch(() => ({}))) as { text?: string }
      if (!res.ok || !data.text) throw new Error('empty transcript')
      setAutoRead(true)
      autoReadRef.current = true
      setHeard(data.text)
      void speak('heard', t('aiHeardSpoken').replace('{text}', data.text))
    } catch {
      setVoiceError(t('aiTranscribeError'))
    } finally {
      setRecState('idle')
    }
  }

  const confirmHeard = () => {
    if (!heard) return
    const text = heard
    setHeard(null)
    submit(text)
  }

  const editHeard = () => {
    if (!heard) return
    stopPlayback()
    setInput(heard)
    setHeard(null)
    document.getElementById('assistant-input')?.focus()
  }

  const retryHeard = () => {
    setHeard(null)
    void toggleRecording()
  }

  const toggleRecording = async () => {
    setHeard(null)
    
    // Stop recording if currently recording
    if (recState === 'recording') {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      if (recorderRef.current) {
        recorderRef.current.stop()
        recorderRef.current = null
      }
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current)
        stopTimerRef.current = null
      }
      setRecState('idle')
      return
    }
    
    if (recState === 'transcribing' || busy) return

    setVoiceError(null)
    stopPlayback()
    
    // Whisper (server-side, tuned for darija and program names) is the default; the browser's
    // recognizer is only used where MediaRecorder is missing.
    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    const useBrowserRecognition = typeof MediaRecorder === 'undefined' && hasSpeechRecognition

    if (useBrowserRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = lang === 'ar' ? 'ar-TN' : 'fr-FR'
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        setAutoRead(true)
        autoReadRef.current = true
        setHeard(text)
        void speak('heard', t('aiHeardSpoken').replace('{text}', text))
        setRecState('idle')
        recognitionRef.current = null
      }
      
      recognition.onerror = (event: any) => {
        console.error('[SpeechRecognition] Error:', event.error)
        setVoiceError(t('aiTranscribeError'))
        setRecState('idle')
        recognitionRef.current = null
      }
      
      recognition.onend = () => {
        setRecState('idle')
        recognitionRef.current = null
      }
      
      recognitionRef.current = recognition as any
      recognition.start()
      setRecState('recording')
      stopTimerRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop()
          recognitionRef.current = null
        }
        setRecState('idle')
      }, MAX_RECORDING_MS)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mimeType = ['audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported(m))
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
        const chunks: Blob[] = []
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data)
        }
        recorder.onstop = () => {
          if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
          stream.getTracks().forEach((track) => track.stop())
          const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' })
          if (blob.size > 0) void uploadRecording(blob)
          else setRecState('idle')
        }
        recorderRef.current = recorder
        recorder.start()
        setRecState('recording')
        stopTimerRef.current = setTimeout(() => recorder.state === 'recording' && recorder.stop(), MAX_RECORDING_MS)
      } catch {
        setVoiceError(t('aiNoMic'))
        setRecState('idle')
      }
    }
  }

  const recLabel =
    recState === 'recording' ? t('aiRecording') : recState === 'transcribing' ? t('aiTranscribing') : t('aiMic')

  return (
    <section id="assistant" aria-labelledby="assistant-title" className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" aria-hidden />
            {t('aiEyebrow')}
          </p>
          <h2 id="assistant-title" className="font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">
            {t('aiTitle')}
          </h2>
          <p className="leading-relaxed text-muted-foreground text-pretty">{t('aiIntro')}</p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-start gap-2 border-b border-border bg-secondary px-5 py-3 text-sm text-secondary-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="leading-relaxed">{t('aiPrivacy')}</p>
          </div>

          <div className="flex flex-col items-center gap-4 border-b border-border px-5 py-6 text-center md:flex-row md:text-start">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={recState === 'transcribing' || busy}
              aria-pressed={recState === 'recording'}
              aria-label={recLabel}
              className={cn(
                'relative flex size-20 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50',
                recState === 'recording'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground hover:opacity-90',
              )}
            >
              {recState === 'recording' && (
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-40" aria-hidden />
              )}
              {recState === 'transcribing' ? (
                <Loader2 className="size-8 animate-spin" aria-hidden />
              ) : recState === 'recording' ? (
                <Square className="relative size-7 fill-current" aria-hidden />
              ) : (
                <Mic className="size-9" aria-hidden />
              )}
            </button>
            <div className="flex flex-1 flex-col gap-1">
              <p className="font-heading text-lg font-semibold text-foreground text-balance">{t('aiVoiceTitle')}</p>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {recState === 'idle' ? t('aiVoiceHint') : recLabel}
              </p>
              {voiceError && (
                <p role="alert" className="text-sm text-destructive">
                  {voiceError}
                </p>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={autoRead}
                onChange={(e) => setAutoRead(e.target.checked)}
                className="size-4 accent-primary"
              />
              <Volume2 className="size-4 text-primary" aria-hidden />
              {t('aiAutoRead')}
            </label>
          </div>

          {heard && (
            <div
              role="status"
              className="flex flex-col gap-4 border-b border-border bg-secondary px-5 py-5 text-secondary-foreground"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-primary">{t('aiHeardTitle')}</p>
                <p dir="auto" className="font-heading text-lg leading-relaxed text-foreground text-pretty">
                  {'« '}
                  {heard}
                  {' »'}
                </p>
                <p className="text-sm text-muted-foreground">{t('aiHeardQuestion')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={confirmHeard}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Check className="size-5" aria-hidden />
                  {t('aiHeardYes')}
                </button>
                <button
                  type="button"
                  onClick={retryHeard}
                  className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <RotateCcw className="size-5" aria-hidden />
                  {t('aiHeardRetry')}
                </button>
                <button
                  type="button"
                  onClick={editHeard}
                  className="flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <Pencil className="size-4" aria-hidden />
                  {t('aiHeardEdit')}
                </button>
              </div>
            </div>
          )}

          <div className="flex max-h-[32rem] min-h-72 flex-col gap-5 overflow-y-auto p-5" aria-live="polite" aria-busy={status === 'submitted' || status === 'streaming'}>
            {(status === 'submitted' || status === 'streaming') && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                <span>{status === 'submitted' ? 'Chargement...' : 'Réflexion en cours...'}</span>
              </div>
            )}
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-muted-foreground">{t('aiTry')}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions[lang].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, index) => {
              const text = textOf(m.parts)
              const isStreamingThis = busy && index === messages.length - 1
              const isPlayingThis = playback?.id === m.id
              return (
                <div key={m.id} className={cn('flex flex-col gap-3', m.role === 'user' ? 'items-end' : 'items-start')}>
                  {m.parts.map((part, i) => {
                    if (part.type === 'text' && part.text) {
                      return (
                        <p
                          key={i}
                          dir="auto"
                          className={cn(
                            'max-w-prose whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed',
                            m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                          )}
                        >
                          {part.text}
                        </p>
                      )
                    }
                    if (part.type === 'tool-recommendServices' && part.state === 'output-available') {
                      const ids = (part.output as { ids: string[] }).ids
                      return (
                        <div key={i} className="grid w-full gap-4 md:grid-cols-2">
                          {ids.map((id) => {
                            const s = services.find((x) => x.id === id)
                            return s ? <ServiceCard key={id} service={s} /> : null
                          })}
                        </div>
                      )
                    }
                    return null
                  })}
                  {m.role === 'assistant' && text && !isStreamingThis && (
                    <button
                      type="button"
                      onClick={() => speak(m.id, text)}
                      aria-pressed={isPlayingThis}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      {isPlayingThis && playback.loading ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : isPlayingThis ? (
                        <Square className="size-3.5 fill-current" aria-hidden />
                      ) : (
                        <Volume2 className="size-4" aria-hidden />
                      )}
                      {isPlayingThis ? (playback.loading ? t('aiLoadingAudio') : t('aiStopListen')) : t('aiListen')}
                    </button>
                  )}
                </div>
              )
            })}

            {status === 'submitted' && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t('aiThinking')}
              </p>
            )}
            {error && <p className="text-sm text-destructive">{t('aiError')}</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex items-end gap-2 border-t border-border p-3"
          >
            <button
              type="button"
              onClick={toggleRecording}
              disabled={recState === 'transcribing' || busy}
              aria-pressed={recState === 'recording'}
              aria-label={recLabel}
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-full border border-border transition-colors disabled:opacity-50',
                recState === 'recording' ? 'bg-accent text-accent-foreground' : 'bg-background text-foreground hover:text-primary',
              )}
            >
              {recState === 'transcribing' ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : recState === 'recording' ? (
                <Square className="size-4 fill-current" aria-hidden />
              ) : (
                <Mic className="size-5" aria-hidden />
              )}
            </button>
            <label htmlFor="assistant-input" className="sr-only">
              {t('aiPlaceholder')}
            </label>
            <textarea
              id="assistant-input"
              rows={1}
              dir="auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  e.preventDefault()
                  submit(input)
                }
              }}
              placeholder={t('aiPlaceholder')}
              className="min-h-12 flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-3 leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label={t('aiSend')}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="size-5 rtl:-scale-x-100" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
