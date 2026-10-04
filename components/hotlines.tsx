'use client'

import { Phone } from 'lucide-react'
import { hotlines } from '@/lib/services-data'
import { useLang } from './lang-provider'

export function Hotlines() {
  const { t, tr } = useLang()

  return (
    <section id="urgence" aria-labelledby="hotlines-title" className="bg-foreground text-background print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14">
        <div className="flex flex-col gap-2">
          <h2 id="hotlines-title" className="font-heading text-3xl font-bold text-balance">
            {t('hotlinesTitle')}
          </h2>
          <p className="leading-relaxed opacity-80">{t('hotlinesText')}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {hotlines.map((h) => (
            <li key={h.number}>
              <a
                href={`tel:${h.number}`}
                className="flex h-full flex-col gap-2 rounded-2xl border border-background/20 p-5 transition-colors hover:border-accent hover:bg-background/5"
              >
                <span dir="ltr" className="font-heading text-4xl font-bold text-accent">
                  {h.number}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Phone className="size-4" aria-hidden />
                  {tr(h.label)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function SiteFooter() {
  const { t, lang } = useLang()
  return (
    <footer className="border-t border-border print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground">{t('brand')}</p>
        <p>{t('footer')}</p>
        <p>{t('disclaimer')}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
          <li>
            <a href="/presentation" className="text-primary underline underline-offset-4">
              {t('navPresentation')}
            </a>
          </li>
          <li>
            <a href="/tableau-de-bord" className="text-primary underline underline-offset-4">
              {t('navDashboard')}
            </a>
          </li>
          <li>
            <a href="/confidentialite" className="text-primary underline underline-offset-4">
              {lang === 'ar' ? 'حماية معطياتك' : 'Protection de vos données'}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
