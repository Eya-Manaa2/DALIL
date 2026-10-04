import { z } from 'zod'
import { db } from '@/lib/db'
import { usageEvents } from '@/lib/db/schema'
import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'
import { audiences, governorates, needs } from '@/lib/services-data'

const govNames = governorates.map((g) => g.fr) as [string, ...string[]]
const needIds = needs.map((n) => n.id) as [string, ...string[]]
const audienceIds = audiences.map((a) => a.id) as [string, ...string[]]

const eventSchema = z.object({
  source: z.enum(['wizard', 'nearby', 'assistant']),
  audience: z.enum(audienceIds).nullish(),
  needs: z.array(z.enum(needIds)).max(needIds.length).optional(),
  governorate: z.enum(govNames).nullish(),
  resultsCount: z.number().int().min(0).max(1000).nullish(),
})

export async function POST(req: Request) {
  if (!(await checkRateLimit(req, limits.events))) return tooManyRequests()
  const parsed = eventSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'invalid_event' }, { status: 400 })

  const e = parsed.data
  await db.insert(usageEvents).values({
    source: e.source,
    audience: e.audience ?? null,
    needs: e.needs ?? [],
    governorate: e.governorate ?? null,
    resultsCount: e.resultsCount ?? null,
  })
  return new Response(null, { status: 204 })
}
