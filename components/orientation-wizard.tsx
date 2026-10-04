'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, FileDown, MapPin, RotateCcw } from 'lucide-react'
import { ficheQuery } from '@/lib/fiche'
import { audiences, governorates, matchServices, needs, type Audience, type Need } from '@/lib/services-data'
import { trackUsage } from '@/lib/tracking'
import { cn } from '@/lib/utils'
import { useLang } from './lang-provider'
import { ServiceCard } from './service-card'
import { ShareActions } from './share-actions'

const TOTAL = 3

export function OrientationWizard({
  initialAudience,
  onExit,
}: {
  initialAudience?: Audience
  onExit?: () => void
}) {
  const { t, tr, lang } = useLang()
  const [step, setStep] = useState(initialAudience ? 2 : 1)
  const [audience, setAudience] = useState<Audience | null>(initialAudience ?? null)
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([])
  const [gov, setGov] = useState('')
  const [done, setDone] = useState(false)

  const Prev = lang === 'ar' ? ArrowRight : ArrowLeft
  const Next = lang === 'ar' ? ArrowLeft : ArrowRight

  const canContinue = (step === 1 && audience) || (step === 2 && selectedNeeds.length > 0) || (step === 3 && gov)

  const toggleNeed = (n: Need) =>
    setSelectedNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]))

  const reset = () => {
    if (onExit) return onExit()
    setStep(1)
    setAudience(null)
    setSelectedNeeds([])
    setGov('')
    setDone(false)
  }

  const govLabel = governorates.find((g) => g.fr === gov)
  const results = done ? matchServices(audience, selectedNeeds) : []
  const showsChild = audience === 'child'
  const fichePath = `/fiche?${ficheQuery({ audience, needs: selectedNeeds, gov, lang })}`

  return (
    <section id="guide" aria-labelledby="guide-title" className="bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {!done ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-3xl bg-card p-6 shadow-sm md:p-10">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-primary">
                {t('step')} {step} {t('of')} {TOTAL}
              </p>
              <div className="flex gap-2" aria-hidden>
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-muted')} />
                ))}
              </div>
              <h2 id="guide-title" className="font-heading text-2xl font-bold text-balance text-card-foreground md:text-3xl">
                {step === 1 ? t('q1') : step === 2 ? t('q2') : t('q3')}
              </h2>
              {step === 2 && <p className="text-muted-foreground">{t('q2hint')}</p>}
            </div>

            {step === 1 && (
              <div role="radiogroup" aria-labelledby="guide-title" className="grid gap-3 sm:grid-cols-2">
                {audiences.map((a) => {
                  const active = audience === a.id
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setAudience(a.id)}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-start transition-colors',
                        active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                      )}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="text-base font-semibold text-foreground">{tr(a.label)}</span>
                        <span className="text-sm text-muted-foreground">{tr(a.hint)}</span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                          active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                        )}
                      >
                        {active && <Check className="size-3.5" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {step === 2 && (
              <div role="group" aria-labelledby="guide-title" className="flex flex-wrap gap-3">
                {needs.map((n) => {
                  const active = selectedNeeds.includes(n.id)
                  return (
                    <button
                      key={n.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleNeed(n.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-full border-2 px-5 py-3 text-base font-semibold transition-colors',
                        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary/50',
                      )}
                    >
                      {active && <Check className="size-4" aria-hidden />}
                      {tr(n.label)}
                    </button>
                  )
                })}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-2">
                <label htmlFor="gov" className="sr-only">
                  {t('q3')}
                </label>
                <select
                  id="gov"
                  value={gov}
                  onChange={(e) => setGov(e.target.value)}
                  className="h-14 rounded-2xl border-2 border-border bg-card px-4 text-base text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">{t('chooseGov')}</option>
                  {governorates.map((g) => (
                    <option key={g.fr} value={g.fr}>
                      {tr(g)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => (onExit && step === 2 ? onExit() : setStep((s) => s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-foreground disabled:invisible"
              >
                <Prev className="size-4" aria-hidden />
                {t('back')}
              </button>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (step < TOTAL) return setStep((s) => s + 1)
                  setDone(true)
                  trackUsage({
                    source: 'wizard',
                    audience,
                    needs: selectedNeeds,
                    governorate: gov,
                    resultsCount: matchServices(audience, selectedNeeds).length,
                  })
                }}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {step < TOTAL ? t('next') : t('seeResults')}
                <Next className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="guide-title" className="font-heading text-3xl font-bold text-balance text-foreground">
                {t('resultsTitle')}
              </h2>
              <div className="flex flex-wrap gap-2 print:hidden">
                <Link
                  href={fichePath}
                  className="flex items-center gap-2 rounded-full border-2 border-primary bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  <FileDown className="size-4" aria-hidden />
                  {t('ficheOpen')}
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {t('restart')}
                </button>
              </div>
            </div>

            {results.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-foreground">{t('shareLabel')} :</p>
                <ShareActions path={fichePath} />
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-4 lg:col-span-2">
                {results.length === 0 ? (
                  <p className="rounded-2xl bg-card p-6 leading-relaxed text-foreground">{t('resultsNone')}</p>
                ) : (
                  results.map((s, i) => <ServiceCard key={s.id} service={s} defaultOpen={i === 0} />)
                )}
              </div>

              <aside className="flex h-fit flex-col gap-4 rounded-2xl bg-primary p-6 text-primary-foreground lg:sticky lg:top-24">
                <h3 className="flex items-center gap-2 font-heading text-xl font-semibold">
                  <MapPin className="size-5" aria-hidden />
                  {t('whereToGo')} {govLabel ? tr(govLabel) : ''}
                </h3>
                <p className="leading-relaxed opacity-90">{t('whereText')}</p>
                <ul className="flex flex-col gap-3">
                  <li className="rounded-xl bg-primary-foreground/10 p-3 text-sm leading-relaxed">{t('local')}</li>
                  <li className="rounded-xl bg-primary-foreground/10 p-3 text-sm leading-relaxed">
                    {t('regionalDirection')} {govLabel ? tr(govLabel) : ''}
                  </li>
                  {showsChild && (
                    <>
                      <li className="rounded-xl bg-primary-foreground/10 p-3 text-sm leading-relaxed">{t('cdis')}</li>
                      <li className="rounded-xl bg-primary-foreground/10 p-3 text-sm leading-relaxed">{t('childDelegate')}</li>
                    </>
                  )}
                </ul>
              </aside>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
