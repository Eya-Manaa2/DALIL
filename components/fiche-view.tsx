'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Printer } from 'lucide-react'
import type { FicheState } from '@/lib/fiche'
import { audiences, governorates, hotlines, matchServices, needs } from '@/lib/services-data'
import { useLang } from './lang-provider'
import { ShareActions } from './share-actions'

export function FicheView({ state, path, qrSvg }: { state: FicheState; path: string; qrSvg: string }) {
  const { t, tr, lang, toggle } = useLang()
  const appliedLang = useRef(false)

  useEffect(() => {
    if (appliedLang.current) return
    appliedLang.current = true
    if (state.lang !== lang) toggle()
  }, [state.lang, lang, toggle])

  const results = state.audience ? matchServices(state.audience, state.needs) : []
  const audienceLabel = audiences.find((a) => a.id === state.audience)
  const govLabel = governorates.find((g) => g.fr === state.gov)
  const today = new Date().toLocaleDateString(lang === 'ar' ? 'ar-TN' : 'fr-TN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (!state.audience) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 py-16">
        <h1 className="font-heading text-3xl font-bold text-foreground">{t('ficheTitle')}</h1>
        <p className="leading-relaxed text-muted-foreground">{t('ficheEmpty')}</p>
        <Link href="/" className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">
          {t('ficheStart')}
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-90"
        >
          <Printer className="size-4" aria-hidden />
          {t('fichePrint')}
        </button>
        <ShareActions path={path} />
      </div>

      <article className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 text-card-foreground md:p-10 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-col-reverse gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">
              {t('brand')} · {today}
            </p>
            <h1 className="font-heading text-3xl font-bold text-balance">{t('ficheTitle')}</h1>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div className="flex gap-1">
                <dt className="text-muted-foreground">{t('ficheFor')} :</dt>
                <dd className="font-semibold">{audienceLabel ? tr(audienceLabel.label) : ''}</dd>
              </div>
              {state.needs.length > 0 && (
                <div className="flex gap-1">
                  <dt className="text-muted-foreground">{t('ficheNeeds')} :</dt>
                  <dd className="font-semibold">
                    {state.needs.map((n) => tr(needs.find((x) => x.id === n)!.label)).join(' · ')}
                  </dd>
                </div>
              )}
              {govLabel && (
                <div className="flex gap-1">
                  <dt className="text-muted-foreground">{t('ficheGov')} :</dt>
                  <dd className="font-semibold">{tr(govLabel)}</dd>
                </div>
              )}
            </dl>
          </div>
          <figure className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
            <div
              className="size-28 rounded-xl border border-border bg-card p-1 [&_svg]:size-full"
              role="img"
              aria-label={t('ficheQrAlt')}
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <figcaption className="max-w-40 text-xs leading-relaxed text-muted-foreground sm:text-end">{t('ficheQr')}</figcaption>
          </figure>
        </header>

        {results.length === 0 ? (
          <p className="leading-relaxed">{t('resultsNone')}</p>
        ) : (
          <ol className="flex flex-col gap-6">
            {results.map((s, i) => (
              <li key={s.id} className="flex flex-col gap-3 break-inside-avoid">
                <h2 className="flex items-start gap-3 font-heading text-xl font-semibold leading-snug">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {i + 1}
                  </span>
                  {tr(s.title)}
                </h2>
                <div className="grid gap-4 ps-10 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold">{t('ficheBring')}</h3>
                    <ul className="flex flex-col gap-1.5">
                      {s.documents.map((d, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm leading-relaxed">
                          <span aria-hidden className="mt-1 size-4 shrink-0 rounded border-2 border-primary" />
                          {tr(d)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold">{t('steps')}</h3>
                    <ol className="flex flex-col gap-1.5">
                      {s.steps.map((st, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                          <span className="font-bold text-foreground">{j + 1}.</span>
                          {tr(st)}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <p className="ms-10 flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="font-semibold">{t('where')} : </span>
                    {tr(s.where)}
                    {s.hotline && (
                      <>
                        {' · '}
                        <span className="font-semibold">
                          {t('call')} <span dir="ltr">{s.hotline}</span>
                        </span>
                      </>
                    )}
                  </span>
                </p>
              </li>
            ))}
          </ol>
        )}

        <footer className="flex flex-col gap-3 border-t border-border pt-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Phone className="size-4 text-primary" aria-hidden />
            {t('navUrgent')}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {hotlines.map((h) => (
              <li key={h.number}>
                <span dir="ltr" className="font-bold">
                  {h.number}
                </span>{' '}
                <span className="text-muted-foreground">{tr(h.label)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-muted-foreground">{t('ficheDisclaimer')}</p>
        </footer>
      </article>
    </main>
  )
}
