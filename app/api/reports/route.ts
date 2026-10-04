import { z } from 'zod'
import { db } from '@/lib/db'
import { fieldReports } from '@/lib/db/schema'
import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'
import { governorates } from '@/lib/services-data'
import { reportKinds } from '@/lib/tracking'

const govNames = governorates.map((g) => g.fr) as [string, ...string[]]
const kindIds = reportKinds.map((k) => k.id) as [string, ...string[]]

const reportSchema = z.object({
  officeName: z.string().trim().min(2).max(160),
  governorate: z.enum(govNames),
  kind: z.enum(kindIds),
  details: z.string().trim().max(600).optional(),
})

export async function POST(req: Request) {
  if (!(await checkRateLimit(req, limits.reports))) return tooManyRequests()
  const parsed = reportSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'invalid_report' }, { status: 400 })

  const r = parsed.data
  await db.insert(fieldReports).values({
    officeName: r.officeName,
    governorate: r.governorate,
    kind: r.kind,
    details: r.details || null,
  })
  return Response.json({ ok: true }, { status: 201 })
}
