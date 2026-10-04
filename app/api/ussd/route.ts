import { db } from '@/lib/db'
import { usageEvents } from '@/lib/db/schema'
import { runUssd } from '@/lib/ussd'

// Follows the common USSD gateway contract (form fields sessionId, serviceCode, phoneNumber, text;
// plain-text reply prefixed with CON to continue or END to close), so an operator gateway can call it as-is.
async function readText(req: Request) {
  const type = req.headers.get('content-type') ?? ''
  if (type.includes('application/json')) {
    const body = await req.json().catch(() => null)
    return typeof body?.text === 'string' ? body.text : ''
  }
  const form = await req.formData().catch(() => null)
  const text = form?.get('text')
  return typeof text === 'string' ? text : ''
}

export async function POST(req: Request) {
  const text = await readText(req)
  if (text.length > 60 || !/^[0-9*#]*$/.test(text)) {
    return new Response('END Choix invalide.', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  const reply = runUssd(text)

  if (reply.completedSearch) {
    // Phone numbers are never stored: only the anonymous need, like the web events.
    await db
      .insert(usageEvents)
      .values({
        source: 'ussd',
        audience: reply.completedSearch.audience,
        needs: reply.completedSearch.needs,
        resultsCount: reply.completedSearch.resultsCount,
      })
      .catch(() => {})
  }

  return new Response(`${reply.end ? 'END' : 'CON'} ${reply.message}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
