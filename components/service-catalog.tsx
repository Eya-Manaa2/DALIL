'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { needs, services, type Need } from '@/lib/services-data'
import { cn } from '@/lib/utils'
import { useLang } from './lang-provider'
import { ServiceCard } from './service-card'

export function ServiceCatalog() {
  const { t, tr } = useLang()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Need | 'all'>('all')

  const q = query.trim().toLowerCase()
  const filtered = services.filter((s) => {
    if (filter !== 'all' && !s.needs.includes(filter)) return false
    if (!q) return true
    return [s.title.fr, s.title.ar, s.summary.fr, s.summary.ar].some((v) => v.toLowerCase().includes(q))
  })

  const chips: { id: Need | 'all'; label: string }[] = [
    { id: 'all', label: t('all') },
    ...needs.map((n) => ({ id: n.id, label: tr(n.label) })),
  ]

  return (
    <section id="catalogue" aria-labelledby="catalog-title" className="print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14">
        <div className="flex flex-col gap-2">
          <h2 id="catalog-title" className="font-heading text-3xl font-bold text-balance text-foreground">
            {t('catalogTitle')}
          </h2>
          <p className="text-muted-foreground">{t('catalogText')}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative max-w-xl">
            <label htmlFor="search" className="sr-only">
              {t('searchLabel')}
            </label>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              className="h-12 w-full rounded-full border-2 border-border bg-card ps-12 pe-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('catalogTitle')}>
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                  filter === c.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} {t('results')}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">{t('noMatch')}</p>
        ) : (
          <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
