'use client'

import dynamic from 'next/dynamic'
import { useMemo, useRef, useState } from 'react'
import { Crosshair, ExternalLink, LoaderCircle, MapPin, Navigation, Phone, Search } from 'lucide-react'
import { governorates } from '@/lib/services-data'
import {
  directionsUrl,
  distanceKm,
  governorateCenters,
  mapsSearchUrl,
  officeCategories,
  type Office,
  type OfficeCategory,
} from '@/lib/nearby'
import { trackUsage } from '@/lib/tracking'
import { useLang } from './lang-provider'
import { ReportForm } from './report-form'

function nearestGovernorate(lat: number, lng: number) {
  let best: string | null = null
  let bestKm = Infinity
  for (const [name, [gLat, gLng]] of Object.entries(governorateCenters)) {
    const km = distanceKm(lat, lng, gLat, gLng)
    if (km < bestKm) {
      bestKm = km
      best = name
    }
  }
  return best
}

const OfficesMap = dynamic(() => import('./offices-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

type NearbyResponse = { offices: Office[]; radiusKm: number }

const fetchNearby = async (lat: number, lng: number): Promise<NearbyResponse> => {
  const res = await fetch(`/api/nearby?lat=${lat.toFixed(2)}&lng=${lng.toFixed(2)}`)
  if (!res.ok) throw new Error('nearby_failed')
  return res.json()
}

type Origin = { lat: number; lng: number; source: 'gps' | 'gov' }

export function NearbyServices() {
  const { t, tr, lang } = useLang()
  const [origin, setOrigin] = useState<Origin | null>(null)
  const [gov, setGov] = useState('')
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<'denied' | 'outside' | null>(null)
  const [category, setCategory] = useState<OfficeCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [data, setData] = useState<NearbyResponse | null>(null)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const requestRef = useRef(0)

  const load = async (next: Origin) => {
    const requestId = ++requestRef.current
    setOrigin(next)
    setSelectedId(null)
    setIsLoading(true)
    setError(false)
    try {
      const result = await fetchNearby(next.lat, next.lng)
      if (requestId === requestRef.current) setData(result)
      trackUsage({
        source: 'nearby',
        governorate: next.source === 'gov' ? gov || nearestGovernorate(next.lat, next.lng) : nearestGovernorate(next.lat, next.lng),
        resultsCount: result.offices.length,
      })
    } catch {
      if (requestId === requestRef.current) {
        setData(null)
        setError(true)
      }
    } finally {
      if (requestId === requestRef.current) setIsLoading(false)
    }
  }
  const retry = () => origin && load(origin)

  const offices = useMemo(() => {
    if (!data || !origin) return []
    return data.offices
      .filter((o) => category === 'all' || o.category === category)
      .map((o) => ({ ...o, km: distanceKm(origin.lat, origin.lng, o.lat, o.lng) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 12)
  }, [data, origin, category])

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('denied')
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false)
        const inTunisia = coords.latitude > 30 && coords.latitude < 37.6 && coords.longitude > 7.4 && coords.longitude < 11.8
        if (!inTunisia) {
          setGeoError('outside')
          return
        }
        setGov('')
        load({ lat: coords.latitude, lng: coords.longitude, source: 'gps' })
      },
      () => {
        setLocating(false)
        setGeoError('denied')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  const chooseGov = (name: string) => {
    setGov(name)
    setGeoError(null)
    const center = governorateCenters[name]
    if (center) load({ lat: center[0], lng: center[1], source: 'gov' })
  }

  const center = useMemo<[number, number] | null>(() => (origin ? [origin.lat, origin.lng] : null), [origin])
  const activeQuery = officeCategories.find((c) => c.id === category)
  const formatKm = (km: number) => new Intl.NumberFormat(lang === 'ar' ? 'ar-TN' : 'fr-TN', { maximumFractionDigits: 1 }).format(km)

  return (
    <section id="proximite" aria-labelledby="nearby-title" className="border-y border-border bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="size-4" aria-hidden />
            {t('nearbyEyebrow')}
          </p>
          <h2 id="nearby-title" className="font-heading text-3xl font-semibold text-balance text-foreground">
            {t('nearbyTitle')}
          </h2>
          <p className="leading-relaxed text-pretty text-muted-foreground">{t('nearbyText')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {locating ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Crosshair className="size-5" aria-hidden />}
            {locating ? t('nearbyLocating') : t('nearbyLocate')}
          </button>
          <span className="text-center text-sm text-muted-foreground">{t('nearbyOr')}</span>
          <label className="sr-only" htmlFor="nearby-gov">{t('nearbyChooseGov')}</label>
          <select
            id="nearby-gov"
            value={gov}
            onChange={(e) => chooseGov(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-3 text-foreground"
          >
            <option value="">{t('nearbyChooseGov')}</option>
            {governorates.map((g) => (
              <option key={g.fr} value={g.fr}>{tr(g)}</option>
            ))}
          </select>
        </div>

        {geoError && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {geoError === 'outside' ? t('nearbyOutside') : t('nearbyGeoDenied')}
          </p>
        )}

        {origin && center && (
          <div className="flex flex-col gap-4">
            <div role="group" aria-label={t('nearbyEyebrow')} className="flex flex-wrap gap-2">
              {[{ id: 'all' as const, label: { fr: t('nearbyAll'), ar: t('nearbyAll') } }, ...officeCategories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => {
                    setCategory(c.id)
                    setSelectedId(null)
                  }}
                  className={
                    category === c.id
                      ? 'rounded-full border border-primary bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground'
                      : 'rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground hover:border-primary'
                  }
                >
                  {tr(c.label)}
                </button>
              ))}
            </div>

            <div className="grid overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-5">
              <div className="h-72 border-b border-border sm:h-96 lg:order-2 lg:col-span-3 lg:h-[32rem] lg:border-b-0">
                <OfficesMap
                  center={center}
                  offices={offices}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  youLabel={t('nearbyYou')}
                />
              </div>

              <div className="flex max-h-[32rem] flex-col overflow-y-auto lg:order-1 lg:col-span-2 lg:border-e lg:border-border">
                {isLoading && (
                  <p className="flex items-center gap-2 p-5 text-sm text-muted-foreground" aria-live="polite">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                    {t('nearbyLoading')}
                  </p>
                )}
                {error && !isLoading && (
                  <div className="flex flex-col items-start gap-3 p-5">
                    <p role="alert" className="text-sm text-foreground">{t('nearbyError')}</p>
                    <button type="button" onClick={retry} className="text-sm font-semibold text-primary underline">
                      {lang === 'ar' ? 'أعد المحاولة' : 'Réessayer'}
                    </button>
                  </div>
                )}
                {data && !isLoading && (
                  <>
                    <p className="border-b border-border px-5 py-3 text-sm text-muted-foreground" aria-live="polite">
                      {offices.length} {t('nearbyResults')} {data.radiusKm} km
                    </p>
                    {offices.length === 0 && <p className="p-5 text-sm leading-relaxed text-foreground">{t('nearbyEmpty')}</p>}
                    <ul className="flex flex-col">
                      {offices.map((o) => (
                        <li key={o.id} className={o.id === selectedId ? 'border-b border-border bg-muted' : 'border-b border-border'}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(o.id)}
                            className="flex w-full flex-col gap-1 px-5 pt-4 text-start"
                          >
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="font-semibold text-foreground">{o.name}</span>
                              <span className="shrink-0 text-sm font-semibold text-primary">{formatKm(o.km)} km</span>
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {tr(officeCategories.find((c) => c.id === o.category)!.label)}
                            </span>
                            {o.address && <span className="text-sm text-muted-foreground">{o.address}</span>}
                            {o.hours && <span dir="ltr" className="text-start text-sm text-muted-foreground">{o.hours}</span>}
                          </button>
                          <div className="flex flex-wrap gap-2 px-5 pt-3 pb-4">
                            <a
                              href={directionsUrl(o.lat, o.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                            >
                              <Navigation className="size-4" aria-hidden />
                              {t('nearbyDirections')}
                            </a>
                            {o.phone && (
                              <a
                                href={`tel:${o.phone.replace(/\s/g, '')}`}
                                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-foreground"
                              >
                                <Phone className="size-4" aria-hidden />
                                <span dir="ltr">{o.phone}</span>
                              </a>
                            )}
                            <a
                              href={o.osmUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="size-4" aria-hidden />
                              {t('nearbySource')}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">{t('nearbySearchGoogle')}</p>
              <div className="flex flex-wrap gap-2">
                {(activeQuery ? [activeQuery] : officeCategories).map((c) => (
                  <a
                    key={c.id}
                    href={mapsSearchUrl(c.mapsQuery, origin.lat, origin.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                  >
                    <Search className="size-4" aria-hidden />
                    {tr(c.label)}
                  </a>
                ))}
              </div>
            </div>

            <ReportForm
              officeNames={offices.map((o) => o.name)}
              defaultGov={gov || nearestGovernorate(origin.lat, origin.lng) || ''}
            />
          </div>
        )}

        <div className="flex flex-col gap-1 text-sm leading-relaxed text-muted-foreground">
          <p>{t('nearbyDisclaimer')}</p>
          <p>{t('nearbyPrivacy')}</p>
        </div>
      </div>
    </section>
  )
}
