'use client'

import { AlertTriangle, Flag, ShieldCheck } from 'lucide-react'
import type { DashboardData } from '@/lib/dashboard-data'
import { audiences, governorates, needs } from '@/lib/services-data'
import { reportKinds } from '@/lib/tracking'
import { useLang } from './lang-provider'

type Localized = { fr: string; ar: string }

function BarList({ items, emptyLabel }: { items: { label: string; value: number; alert?: number }[]; emptyLabel: string }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  return (
    <ul className="flex flex-col gap-3">
      {items.map((i) => (
        <li key={i.label} className="flex flex-col gap-1">
          <span className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{i.label}</span>
            <span className="tabular-nums font-semibold text-foreground">{i.value}</span>
          </span>
          <span className="h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
            <span className="block h-full rounded-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  )
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-semibold text-card-foreground">{title}</h2>
        {hint && <p className="text-sm leading-relaxed text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export function DashboardView({ data }: { data: DashboardData }) {
  const { tr, lang } = useLang()
  const L = (fr: string, ar: string) => (lang === 'ar' ? ar : fr)
  const label = (list: { id?: string; fr?: string; label?: Localized }[], key: string) => {
    const found = list.find((x) => (x.id ?? x.fr) === key)
    if (!found) return key
    return found.label ? tr(found.label) : tr(found as Localized)
  }

  const total = data.totals.wizard + data.totals.nearby + data.totals.assistant + data.totals.ussd
  const empty = L('Pas encore de données sur la période.', 'ما فماش معطيات في هالمدّة.')
  const underserved = data.governorates.filter((g) => g.noOffice > 0).sort((a, b) => b.noOffice - a.noOffice)
  const dailyMax = Math.max(1, ...data.daily.map((d) => d.count))
  const dateFmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-TN' : 'fr-TN', { day: 'numeric', month: 'short' })

  const stats = [
    { value: total, label: L('Recherches au total', 'عمليات بحث') },
    { value: data.totals.wizard, label: L('Parcours d’orientation', 'مسارات توجيه') },
    { value: data.totals.nearby, label: L('Recherches de bureaux', 'بحث على مكاتب') },
    { value: data.totals.assistant, label: L('Questions à l’assistant', 'أسئلة للمساعد') },
    { value: data.totals.ussd, label: L('Recherches par USSD', 'طلبات USSD') },
    { value: data.totals.reports, label: L('Signalements du terrain', 'بلاغات ميدانية') },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-primary">
          {L('Pour le ministère et les services régionaux', 'للوزارة والإدارات الجهوية')}
        </p>
        <h1 className="font-heading text-3xl font-bold text-balance text-foreground md:text-4xl">
          {L('Tableau de bord des besoins sociaux', 'لوحة قيادة الحاجيات الاجتماعية')}
        </h1>
        <p className="max-w-3xl leading-relaxed text-pretty text-muted-foreground">
          {L(
            `Ce que les citoyens cherchent sur Dalil, région par région, sur les ${data.periodDays} derniers jours. Aucune donnée personnelle n’est enregistrée : ni nom, ni position exacte, ni contenu des questions.`,
            `شنوّة يلوّجو عليه المواطنين في دليل، ولاية بولاية، في آخر ${data.periodDays} يوم. ما يتسجّل حتى معطى شخصي : لا اسم، لا بلاصة بالضبط، لا محتوى الأسئلة.`,
          )}
        </p>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" aria-hidden />
          {L('Données anonymes et agrégées', 'معطيات بلا أسماء ومجمّعة')}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 bg-card p-5">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="font-heading text-3xl font-bold tabular-nums text-card-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>

      <Panel
        title={L('Zones où aucun bureau n’a été trouvé', 'مناطق ما لقاو فيها حتى مكتب')}
        hint={L(
          'Recherches de bureaux sans résultat : soit le service manque sur place, soit il n’est pas encore référencé sur la carte. Priorité de vérification.',
          'بحث على مكاتب بلا نتيجة : يا إمّا الخدمة ناقصة في البلاصة، يا إمّا موش مسجّلة في الخريطة. أولوية للتثبّت.',
        )}
      >
        {underserved.length === 0 ? (
          <p className="text-sm text-muted-foreground">{L('Aucune zone signalée pour l’instant.', 'حتى منطقة للوقت.')}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {underserved.map((g) => (
              <li
                key={g.governorate}
                className="flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-foreground"
              >
                <AlertTriangle className="size-4 text-destructive" aria-hidden />
                {label(governorates, g.governorate)}
                <span className="tabular-nums font-semibold">{g.noOffice}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title={L('Besoins les plus recherchés', 'الحاجيات الأكثر طلبا')}
          hint={L('Choix faits dans le parcours d’orientation.', 'الاختيارات في مسار التوجيه.')}
        >
          <BarList items={data.needs.map((n) => ({ label: label(needs, n.need), value: n.count }))} emptyLabel={empty} />
        </Panel>
        <Panel
          title={L('Recherches par gouvernorat', 'البحث حسب الولاية')}
          hint={L('Toutes fonctionnalités confondues.', 'كل الخدمات مع بعضها.')}
        >
          <BarList
            items={data.governorates.map((g) => ({ label: label(governorates, g.governorate), value: g.searches }))}
            emptyLabel={empty}
          />
        </Panel>
        <Panel title={L('Pour qui on cherche', 'على شكون يلوّجو')}>
          <BarList
            items={data.audiences.map((a) => ({ label: label(audiences, a.audience), value: a.count }))}
            emptyLabel={empty}
          />
        </Panel>
        <Panel title={L('Activité des 14 derniers jours', 'النشاط في آخر 14 يوم')}>
          <div className="flex h-40 items-end gap-1.5" role="img" aria-label={L('Recherches par jour', 'البحث في كل نهار')}>
            {data.daily.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs tabular-nums text-muted-foreground">{d.count || ''}</span>
                <span
                  className="w-full rounded-t-sm bg-primary"
                  style={{ height: `${Math.max(d.count ? 4 : 1, (d.count / dailyMax) * 100)}%`, opacity: d.count ? 1 : 0.2 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{data.daily[0] && dateFmt.format(new Date(data.daily[0].day))}</span>
            <span>{data.daily.at(-1) && dateFmt.format(new Date(data.daily.at(-1)!.day))}</span>
          </div>
        </Panel>
      </div>

      <Panel
        title={L('Derniers signalements du terrain', 'آخر البلاغات الميدانية')}
        hint={L(
          'Envoyés par les citoyens et les travailleurs sociaux depuis la carte des bureaux.',
          'يبعثوهم المواطنين والأخصائيين الاجتماعيين من خريطة المكاتب.',
        )}
      >
        {data.reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">{L('Aucun signalement pour l’instant.', 'حتى بلاغ للوقت.')}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {data.reports.map((r) => (
              <li key={r.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <Flag className="size-4 text-primary" aria-hidden />
                  <span className="font-semibold text-foreground">{r.officeName}</span>
                  <span className="text-muted-foreground">{label(governorates, r.governorate)}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {label(reportKinds as unknown as { id: string; label: Localized }[], r.kind)}
                  </span>
                  <time dateTime={r.createdAt} className="ms-auto text-xs text-muted-foreground">
                    {dateFmt.format(new Date(r.createdAt))}
                  </time>
                </span>
                {r.details && <p className="text-sm leading-relaxed text-foreground">{r.details}</p>}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}
