'use client'

import { useState } from 'react'
import { Phone, PhoneOff, Signal, SmartphoneNfc, WifiOff } from 'lucide-react'
import { useLang } from './lang-provider'

const DEMO_CODE = '*000#'
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

type Screen = { message: string; end: boolean } | null

export function UssdSimulator() {
  const { t } = useLang()
  const [screen, setScreen] = useState<Screen>(null)
  const [history, setHistory] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const send = async (text: string) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ sessionId: 'web-demo', serviceCode: DEMO_CODE, phoneNumber: '', text }),
      })
      const raw = await res.text()
      setScreen({ end: raw.startsWith('END'), message: raw.replace(/^(CON|END) /, '') })
      setHistory(text)
      setInput('')
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const dial = () => send('')
  const reply = () => {
    if (!input || !screen || screen.end) return
    send(history ? `${history}*${input}` : input)
  }
  const hangUp = () => {
    setScreen(null)
    setHistory('')
    setInput('')
  }

  const press = (key: string) => {
    if (!screen || screen.end) return
    setInput((v) => (v + key).slice(0, 3))
  }

  const active = screen && !screen.end

  return (
    <section id="ussd" aria-labelledby="ussd-title" className="bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 py-16 md:flex-row md:items-start">
        <div className="flex flex-1 flex-col gap-5">
          <p className="text-sm font-semibold text-primary">{t('ussdEyebrow')}</p>
          <h2 id="ussd-title" className="font-heading text-3xl font-bold text-balance text-foreground md:text-4xl">
            {t('ussdTitle')}
          </h2>
          <p className="leading-relaxed text-pretty text-muted-foreground">{t('ussdText')}</p>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <WifiOff className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span className="leading-relaxed text-foreground">{t('ussdPoint1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <SmartphoneNfc className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span className="leading-relaxed text-foreground">{t('ussdPoint2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <Signal className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span className="leading-relaxed text-foreground">{t('ussdPoint3')}</span>
            </li>
          </ul>
          <p className="rounded-2xl bg-card p-4 text-sm leading-relaxed text-muted-foreground">{t('ussdNote')}</p>
        </div>

        <div
          className="flex w-full max-w-72 flex-col gap-4 rounded-[2.5rem] bg-foreground p-5 shadow-xl"
          dir="ltr"
          role="group"
          aria-label={t('ussdPhoneLabel')}
        >
          <div
            className="flex min-h-64 flex-col justify-between gap-3 rounded-2xl bg-background p-4 font-mono text-sm text-foreground"
            aria-live="polite"
          >
            {screen ? (
              <>
                <p className="whitespace-pre-line leading-relaxed" dir="auto">
                  {screen.message}
                </p>
                {active && (
                  <p className="border-t border-border pt-2 text-muted-foreground">
                    {'> '}
                    {input || '_'}
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <p className="text-2xl font-bold tracking-widest">{DEMO_CODE}</p>
                <p className="font-sans text-xs text-muted-foreground">{t('ussdDialHint')}</p>
              </div>
            )}
            {loading && <p className="text-xs text-muted-foreground">{t('ussdLoading')}</p>}
            {error && <p className="text-xs text-destructive">{t('ussdError')}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={screen ? reply : dial}
              disabled={loading || (screen ? !active || !input : false)}
              className="flex h-11 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              aria-label={screen ? t('ussdSend') : t('ussdDial')}
            >
              <Phone className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setInput((v) => v.slice(0, -1))}
              disabled={!active || !input}
              className="h-11 rounded-full bg-muted text-sm font-semibold text-foreground disabled:opacity-40"
            >
              {t('ussdClear')}
            </button>
            <button
              type="button"
              onClick={hangUp}
              className="flex h-11 items-center justify-center rounded-full bg-destructive text-background"
              aria-label={t('ussdHangUp')}
            >
              <PhoneOff className="size-5" aria-hidden />
            </button>
            {KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => press(key)}
                disabled={!active}
                className="h-11 rounded-xl bg-background/10 font-mono text-lg font-semibold text-background disabled:opacity-40"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
