import { desc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { fieldReports } from '@/lib/db/schema'

export type DashboardData = {
  periodDays: number
  totals: { wizard: number; nearby: number; assistant: number; ussd: number; reports: number }
  needs: { need: string; count: number }[]
  audiences: { audience: string; count: number }[]
  governorates: { governorate: string; searches: number; noOffice: number }[]
  daily: { day: string; count: number }[]
  reports: {
    id: number
    createdAt: string
    officeName: string
    governorate: string
    kind: string
    details: string | null
  }[]
}

const PERIOD_DAYS = 30

type Row = Record<string, unknown>
const rows = async (query: ReturnType<typeof sql>) => (await db.execute(query)).rows as Row[]

export async function getDashboardData(): Promise<DashboardData> {
  const since = sql`now() - make_interval(days => ${PERIOD_DAYS})`

  const [totalsRows, needRows, audienceRows, govRows, dailyRows, reportCountRows, latestReports] = await Promise.all([
    rows(sql`select source, count(*)::int as count from usage_events where created_at > ${since} group by source`),
    rows(sql`select unnest(needs) as need, count(*)::int as count from usage_events
             where source = 'wizard' and created_at > ${since} group by 1 order by 2 desc`),
    rows(sql`select audience, count(*)::int as count from usage_events
             where source = 'wizard' and audience is not null and created_at > ${since} group by 1 order by 2 desc`),
    rows(sql`select governorate, count(*)::int as searches,
               count(*) filter (where source = 'nearby' and results_count = 0)::int as "noOffice"
             from usage_events where governorate is not null and created_at > ${since}
             group by 1 order by 2 desc`),
    rows(sql`select to_char(d, 'YYYY-MM-DD') as day, coalesce(c.count, 0)::int as count
             from generate_series(current_date - 13, current_date, interval '1 day') d
             left join (select created_at::date as day, count(*) as count from usage_events
                        where created_at > current_date - 14 group by 1) c on c.day = d::date
             order by d`),
    rows(sql`select count(*)::int as count from field_reports where created_at > ${since}`),
    db
      .select()
      .from(fieldReports)
      .where(eq(fieldReports.status, 'approved'))
      .orderBy(desc(fieldReports.createdAt))
      .limit(20),
  ])

  const bySource = Object.fromEntries(totalsRows.map((r) => [r.source as string, r.count as number]))

  return {
    periodDays: PERIOD_DAYS,
    totals: {
      wizard: bySource.wizard ?? 0,
      nearby: bySource.nearby ?? 0,
      assistant: bySource.assistant ?? 0,
      ussd: bySource.ussd ?? 0,
      reports: (reportCountRows[0]?.count as number) ?? 0,
    },
    needs: needRows.map((r) => ({ need: r.need as string, count: r.count as number })),
    audiences: audienceRows.map((r) => ({ audience: r.audience as string, count: r.count as number })),
    governorates: govRows.map((r) => ({
      governorate: r.governorate as string,
      searches: r.searches as number,
      noOffice: r.noOffice as number,
    })),
    daily: dailyRows.map((r) => ({ day: r.day as string, count: r.count as number })),
    reports: latestReports.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      officeName: r.officeName,
      governorate: r.governorate,
      kind: r.kind,
      details: r.details,
    })),
  }
}
