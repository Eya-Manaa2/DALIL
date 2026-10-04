'use client'

import { useState, useTransition } from 'react'
import { moderateReport } from '@/app/actions/moderation'
import { reportKinds } from '@/lib/tracking'
import { cn } from '@/lib/utils'

type Status = 'new' | 'approved' | 'rejected'

type Report = {
  id: number
  createdAt: string
  officeName: string
  governorate: string
  kind: string
  details: string | null
  status: string
}

const tabs: { id: Status; label: string }[] = [
  { id: 'new', label: 'À traiter' },
  { id: 'approved', label: 'Publiés' },
  { id: 'rejected', label: 'Rejetés' },
]

const kindLabel = (id: string) =>
  (reportKinds as unknown as { id: string; label: { fr: string } }[]).find((k) => k.id === id)?.label.fr ?? id

export function ModerationList({ reports }: { reports: Report[] }) {
  const [tab, setTab] = useState<Status>('new')
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<number | null>(null)

  const visible = reports.filter((r) => r.status === tab)
  const count = (s: Status) => reports.filter((r) => r.status === s).length

  function act(id: number, status: Status) {
    setBusyId(id)
    startTransition(async () => {
      await moderateReport({ id, status })
      setBusyId(null)
    })
  }

  return (
    <section aria-label="Signalements" className="flex flex-col gap-4">
      <div role="tablist" className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm font-semibold',
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label} <span className="font-normal">({count(t.id)})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Aucun signalement dans cette catégorie.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{r.officeName}</p>
                <time dateTime={r.createdAt} className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString('fr-TN', { dateStyle: 'medium', timeStyle: 'short' })}
                </time>
              </div>
              <p className="text-sm text-muted-foreground">
                {r.governorate} · {kindLabel(r.kind)}
              </p>
              {r.details && <p className="text-sm leading-relaxed text-pretty">{r.details}</p>}
              <div className="flex flex-wrap gap-2">
                {r.status !== 'approved' && (
                  <button
                    type="button"
                    disabled={pending && busyId === r.id}
                    onClick={() => act(r.id, 'approved')}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    Approuver et publier
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button
                    type="button"
                    disabled={pending && busyId === r.id}
                    onClick={() => act(r.id, 'rejected')}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:border-destructive hover:text-destructive disabled:opacity-60"
                  >
                    Rejeter
                  </button>
                )}
                {r.status !== 'new' && (
                  <button
                    type="button"
                    disabled={pending && busyId === r.id}
                    onClick={() => act(r.id, 'new')}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
                  >
                    Remettre à traiter
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
