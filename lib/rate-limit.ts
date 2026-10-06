import { createHash } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

type Limit = { bucket: string; max: number; windowSeconds: number }

export const limits = {
  assistant: { bucket: 'assistant', max: 15, windowSeconds: 60 },
  transcribe: { bucket: 'transcribe', max: 10, windowSeconds: 60 },
  events: { bucket: 'events', max: 60, windowSeconds: 60 },
  reports: { bucket: 'reports', max: 5, windowSeconds: 3600 },
  nearby: { bucket: 'nearby', max: 30, windowSeconds: 60 },
} satisfies Record<string, Limit>

function clientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip') || 'unknown'
}

// The IP is only ever stored as a salted hash, so the table can't be used to identify anyone.
function hashKey(bucket: string, ip: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? process.env.PGHOST ?? 'dalil'
  return createHash('sha256').update(`${salt}:${bucket}:${ip}`).digest('hex')
}

export async function checkRateLimit(req: Request, limit: Limit) {
  const key = hashKey(limit.bucket, clientIp(req))
  try {
    const result = await db.execute(sql`
      insert into rate_limits (key, window_start, hits)
      values (${key}, to_timestamp(floor(extract(epoch from now()) / ${limit.windowSeconds}) * ${limit.windowSeconds}), 1)
      on conflict (key, window_start) do update set hits = rate_limits.hits + 1
      returning hits`)
    const hits = Number((result.rows[0] as { hits: number } | undefined)?.hits ?? 0)

    if (Math.random() < 0.01) {
      db.execute(sql`delete from rate_limits where window_start < now() - interval '1 day'`).catch(() => {})
    }
    return hits <= limit.max
  } catch (error) {
    // Fail open: a database hiccup should not lock vulnerable people out of the service.
    console.error('[rate-limit]', error)
    return true
  }
}

export function tooManyRequests() {
  return Response.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '60' } })
}
