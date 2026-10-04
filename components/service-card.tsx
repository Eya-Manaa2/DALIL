'use client'

import { useState } from 'react'
import {
  Briefcase,
  ChevronDown,
  Coins,
  FileText,
  GraduationCap,
  HeartPulse,
  House,
  MapPin,
  Phone,
  ShieldAlert,
} from 'lucide-react'
import { audiences, type Need, type Service } from '@/lib/services-data'
import { cn } from '@/lib/utils'
import { useLang } from './lang-provider'

const needIcons: Record<Need, typeof Coins> = {
  income: Coins,
  health: HeartPulse,
  education: GraduationCap,
  housing: House,
  protection: ShieldAlert,
  work: Briefcase,
}

export function ServiceCard({ service, defaultOpen = false }: { service: Service; defaultOpen?: boolean }) {
  const { t, tr } = useLang()
  const [open, setOpen] = useState(defaultOpen)
  const panelId = `panel-${service.id}`
  const Icon = needIcons[service.needs[0]] ?? FileText

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 break-inside-avoid">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span
            aria-hidden
            className={cn(
              'flex size-12 items-center justify-center rounded-2xl',
              service.urgent ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary',
            )}
          >
            <Icon className="size-6" />
          </span>
          {service.urgent && (
            <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">{t('urgent')}</span>
          )}
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug text-card-foreground text-balance">{tr(service.title)}</h3>
        <p className="leading-relaxed text-muted-foreground">{tr(service.summary)}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{t('forWho')} : </span>
          {service.audiences.map((a) => tr(audiences.find((x) => x.id === a)!.label)).join(' · ')}
        </p>
      </div>

      {service.hotline && (
        <a
          href={`tel:${service.hotline}`}
          className="flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
        >
          <Phone className="size-4" aria-hidden />
          {t('call')} <span dir="ltr">{service.hotline}</span>
        </a>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex items-center gap-1 self-start text-sm font-semibold text-primary print:hidden"
      >
        {open ? t('hide') : t('details')}
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      <div id={panelId} hidden={!open} className="flex flex-col gap-4 border-t border-border pt-4 print:!flex">
        <div className="flex flex-col gap-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="size-4 text-primary" aria-hidden />
            {t('documents')}
          </h4>
          <ul className="flex flex-col gap-1.5">
            {service.documents.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden className="mt-1 size-3.5 shrink-0 rounded border border-primary" />
                {tr(d)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground">{t('steps')}</h4>
          <ol className="flex flex-col gap-1.5">
            {service.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {i + 1}
                </span>
                {tr(s)}
              </li>
            ))}
          </ol>
        </div>
        <p className="flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">{t('where')} : </span>
            {tr(service.where)}
          </span>
        </p>
      </div>
    </article>
  )
}
