import { officeCategories, type Office, type OfficeCategory } from '@/lib/nearby'
import { checkRateLimit, limits, tooManyRequests } from '@/lib/rate-limit'

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'dalil-social-tn/1.0 (guide des services sociaux)'
const SPAN = 0.5

const SEARCHES: { category: OfficeCategory; q: string }[] = [
  { category: 'social', q: 'affaires sociales' },
  { category: 'social', q: 'الشؤون الاجتماعية' },
  { category: 'social', q: 'promotion sociale' },
  { category: 'cnss', q: 'CNSS' },
  { category: 'cnss', q: 'الضمان الاجتماعي' },
  { category: 'cnam', q: 'CNAM' },
  { category: 'cnam', q: 'التأمين على المرض' },
  { category: 'cnrps', q: 'CNRPS' },
  { category: 'emploi', q: 'bureau emploi' },
  { category: 'emploi', q: 'مكتب التشغيل' },
]

const EXCLUDED_CLASSES = new Set(['highway', 'railway', 'public_transport', 'place', 'boundary'])

type NominatimPlace = {
  osm_type: 'node' | 'way' | 'relation'
  osm_id: number
  lat: string
  lon: string
  name: string
  category: string
  namedetails?: Record<string, string> | null
  extratags?: Record<string, string> | null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function search(q: string, lat: number, lng: number): Promise<NominatimPlace[]> {
  const params = new URLSearchParams({
    q,
    format: 'jsonv2',
    countrycodes: 'tn',
    limit: '15',
    viewbox: `${lng - SPAN},${lat + SPAN},${lng + SPAN},${lat - SPAN}`,
    bounded: '1',
    extratags: '1',
    namedetails: '1',
  })
  const res = await fetch(`${NOMINATIM}?${params}`, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'fr,ar' },
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`nominatim_${res.status}`)
  return res.json()
}

function toOffice(p: NominatimPlace, category: OfficeCategory): Office | null {
  if (EXCLUDED_CLASSES.has(p.category)) return null
  const names = p.namedetails ?? {}
  const name = names['name:fr'] || p.name || names.name || names['name:ar']
  if (!name) return null
  const allNames = [p.name, ...Object.values(names)].join(' ')
  const pattern = officeCategories.find((c) => c.id === category)!.pattern
  if (!new RegExp(pattern, 'i').test(allNames)) return null
  const tags = p.extratags ?? {}
  return {
    id: `${p.osm_type}/${p.osm_id}`,
    osmUrl: `https://www.openstreetmap.org/${p.osm_type}/${p.osm_id}`,
    name,
    category,
    lat: Number(p.lat),
    lng: Number(p.lon),
    phone: tags.phone || tags['contact:phone'] || undefined,
    hours: tags.opening_hours || undefined,
  }
}

export async function GET(req: Request) {
  if (!(await checkRateLimit(req, limits.nearby))) return tooManyRequests()
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  const inTunisia = lat > 30 && lat < 37.6 && lng > 7.4 && lng < 11.8
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !inTunisia) {
    return Response.json({ error: 'invalid_position' }, { status: 400 })
  }
  const rLat = Math.round(lat * 10) / 10
  const rLng = Math.round(lng * 10) / 10

  const offices = new Map<string, Office>()
  let failures = 0
  for (const [i, s] of SEARCHES.entries()) {
    if (i > 0) await sleep(1050)
    try {
      for (const place of await search(s.q, rLat, rLng)) {
        const office = toOffice(place, s.category)
        if (office && !offices.has(office.id)) offices.set(office.id, office)
      }
    } catch {
      failures++
    }
  }

  if (failures === SEARCHES.length) {
    return Response.json({ error: 'map_service_unavailable' }, { status: 503 })
  }
  return Response.json(
    { offices: [...offices.values()], radiusKm: 50 },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  )
}
