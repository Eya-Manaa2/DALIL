'use client'

import { useState } from 'react'
import { Check, Link2, MessageCircle, MessageSquareText } from 'lucide-react'
import { useLang } from './lang-provider'

export function ShareActions({ path }: { path: string }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  const absolute = () => new URL(path, window.location.origin).toString()
  const message = () => `${t('shareText')}\n${absolute()}`

  const openExternal = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(absolute())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(t('copyLink'), absolute())
    }
  }

  const btn =
    'flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-primary'

  return (
    <div className="flex flex-wrap gap-2 print:hidden" role="group" aria-label={t('shareLabel')}>
      <button type="button" className={btn} onClick={() => openExternal(`https://wa.me/?text=${encodeURIComponent(message())}`)}>
        <MessageCircle className="size-4 text-primary" aria-hidden />
        WhatsApp
      </button>
      <button type="button" className={btn} onClick={() => (window.location.href = `sms:?&body=${encodeURIComponent(message())}`)}>
        <MessageSquareText className="size-4 text-primary" aria-hidden />
        SMS
      </button>
      <button type="button" className={btn} onClick={copy} aria-live="polite">
        {copied ? <Check className="size-4 text-primary" aria-hidden /> : <Link2 className="size-4 text-primary" aria-hidden />}
        {copied ? t('copied') : t('copyLink')}
      </button>
    </div>
  )
}
