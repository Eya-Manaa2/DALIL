'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, LayoutGrid, MapPin, Mic, Phone, Smartphone, Star } from 'lucide-react'
import { audiences, type Audience } from '@/lib/services-data'
import { useLang } from './lang-provider'
import { OrientationWizard } from './orientation-wizard'

export function ServiceDesk() {
  const { t, tr, lang } = useLang()
  const [audience, setAudience] = useState<Audience | null>(null)
  const Forward = lang === 'ar' ? ArrowLeft : ArrowRight

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [audience])

  if (audience) return <OrientationWizard initialAudience={audience} onExit={() => setAudience(null)} />

  return (
    <section aria-labelledby="desk-title" className="relative bg-gradient-to-b from-primary/5 via-secondary to-background overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} aria-hidden />
      
      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:py-12">
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2">
            <Star className="size-5 text-primary fill-primary" aria-hidden />
            <h1 id="desk-title" className="font-heading text-3xl font-bold text-balance text-foreground md:text-4xl">
              {t('deskTitle')}
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">{t('deskText')}</p>
        </div>

        <Link
          href="/assistant"
          className="group relative flex items-center gap-4 rounded-3xl bg-gradient-to-r from-primary to-primary/90 p-4 text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40 md:gap-6 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" aria-hidden />
          <span className="relative flex size-16 shrink-0 items-center justify-center md:size-20">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/20 motion-reduce:hidden" />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-primary-foreground text-primary md:size-20 transition-transform group-hover:scale-110 shadow-lg">
              <Mic className="size-8 md:size-9" aria-hidden />
            </span>
          </span>
          <span className="relative flex flex-col gap-1">
            <span className="font-heading text-2xl font-bold md:text-3xl">{t('voiceCta')}</span>
            <span className="leading-relaxed opacity-90">{t('voiceHint')}</span>
          </span>
          <Forward className="relative ms-auto hidden size-6 shrink-0 transition-transform group-hover:translate-x-1 sm:block" aria-hidden />
        </Link>

        <h2 className="font-heading text-lg font-semibold text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">{t('orChoose')}</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {audiences.map((a, index) => (
            <li key={a.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${300 + index * 50}ms` }}>
              <button
                type="button"
                onClick={() => setAudience(a.id)}
                className="group relative flex h-full w-full flex-col items-center gap-2 rounded-2xl border-2 border-transparent bg-card p-3 text-center transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1 focus-visible:border-primary md:flex-row md:text-start overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                <Image
                  src={`/images/tiles/${a.id}.png`}
                  alt=""
                  width={96}
                  height={96}
                  className="relative size-20 shrink-0 rounded-xl mix-blend-multiply transition-transform group-hover:scale-110 md:size-24"
                />
                <span className="relative flex flex-col gap-0.5">
                  <span className="text-base font-semibold leading-snug text-card-foreground">{tr(a.label)}</span>
                  <span className="text-sm text-muted-foreground">{tr(a.hint)}</span>
                </span>
              </button>
            </li>
          ))}
          <li className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${300 + audiences.length * 50}ms` }}>
            <Link
              href="/services"
              className="group relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-3 text-center font-semibold text-primary transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1 md:flex-row md:text-start overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
              <span className="relative flex size-20 shrink-0 items-center justify-center md:size-24 transition-transform group-hover:scale-110">
                <LayoutGrid className="size-10" aria-hidden />
              </span>
              {t('allServicesTile')}
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function OtherWays() {
  const { t } = useLang()
  const ways = [
    { href: '/carte', icon: MapPin, title: t('wayMap'), text: t('wayMapText') },
    { href: '/sans-internet', icon: Smartphone, title: t('wayOffline'), text: t('wayOfflineText') },
    { href: '#urgence', icon: Phone, title: t('wayCall'), text: t('wayCallText') },
  ]

  return (
    <section aria-labelledby="ways-title" className="print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10">
        <h2 id="ways-title" className="font-heading text-xl font-semibold text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
          {t('otherWays')}
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {ways.map((w, index) => (
            <li key={w.href} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${100 + index * 50}ms` }}>
              <Link
                href={w.href}
                className="group flex h-full items-start gap-3 rounded-2xl border border-border p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform group-hover:scale-110">
                  <w.icon className="size-5" aria-hidden />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground">{w.title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{w.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
