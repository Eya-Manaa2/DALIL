'use client'

import { useState } from 'react'
import { Check, Flag, LoaderCircle } from 'lucide-react'
import { governorates } from '@/lib/services-data'
import { reportKinds, type ReportKind } from '@/lib/tracking'
import { useLang } from './lang-provider'

type Props = { officeNames: string[]; defaultGov: string }

export function ReportForm({ officeNames, defaultGov }: Props) {
  const { tr, lang } = useLang()
  const L = (fr: string, ar: string) => (lang === 'ar' ? ar : fr)

  const [open, setOpen] = useState(false)
  const [officeName, setOfficeName] = useState('')
  const [gov, setGov] = useState(defaultGov)
  const [kind, setKind] = useState<ReportKind>('closed')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officeName, governorate: gov, kind, details }),
    }).catch(() => null)
    if (res?.ok) {
      setStatus('sent')
      setOfficeName('')
      setDetails('')
    } else {
      setStatus('error')
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setStatus('idle')
          setGov((g) => g || defaultGov)
        }}
        className="flex items-center gap-2 self-start text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <Flag className="size-4" aria-hidden />
        {L('Une information est fausse ? Signalez-la', 'معلومة غالطة ؟ بلّغ عليها')}
      </button>
    )
  }

  const fieldClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30'

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          {L('Signaler une information à corriger', 'بلّغ على معلومة لازمها تصليح')}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {L(
            'Votre signalement est anonyme. Il est transmis au tableau de bord pour vérification.',
            'البلاغ متاعك بلا اسم. يوصل لوحة القيادة باش يتثبّتو فيه.',
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
          {L('Nom du bureau', 'اسم المكتب')}
          <input
            list="report-offices"
            required
            minLength={2}
            maxLength={160}
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            className={fieldClass}
          />
          <datalist id="report-offices">
            {officeNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
          {L('Gouvernorat', 'الولاية')}
          <select required value={gov} onChange={(e) => setGov(e.target.value)} className={fieldClass}>
            <option value="">{L('Choisir…', 'اختار…')}</option>
            {governorates.map((g) => (
              <option key={g.fr} value={g.fr}>
                {tr(g)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-foreground">{L('Problème', 'المشكل')}</legend>
        <div className="flex flex-wrap gap-2">
          {reportKinds.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              onClick={() => setKind(k.id)}
              className={
                kind === k.id
                  ? 'rounded-full border border-primary bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground'
                  : 'rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:border-primary'
              }
            >
              {tr(k.label)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
        {L('Précisions (facultatif)', 'تفاصيل (اختياري)')}
        <textarea
          rows={3}
          maxLength={600}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={L('Ex. : nouvelle adresse, bons horaires…', 'مثلا : العنوان الجديد، الأوقات الصحيحة…')}
          className={fieldClass}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {status === 'sending' && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
          {L('Envoyer le signalement', 'ابعث البلاغ')}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          {L('Fermer', 'سكّر')}
        </button>
        <p aria-live="polite" className="text-sm">
          {status === 'sent' && (
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <Check className="size-4" aria-hidden />
              {L('Merci, signalement enregistré.', 'يعيشك، البلاغ تسجّل.')}
            </span>
          )}
          {status === 'error' && (
            <span className="text-destructive">{L('Échec de l’envoi. Vérifiez les champs.', 'ما تبعثش. ثبّت في الخانات.')}</span>
          )}
        </p>
      </div>
    </form>
  )
}
