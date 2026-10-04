export type UsageEvent = {
  source: 'wizard' | 'nearby' | 'assistant'
  audience?: string | null
  needs?: string[]
  governorate?: string | null
  resultsCount?: number | null
}

export function trackUsage(event: UsageEvent) {
  const body = JSON.stringify(event)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/events', new Blob([body], { type: 'application/json' }))
    return
  }
  fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(
    () => {},
  )
}

export const reportKinds = [
  { id: 'closed', label: { fr: 'Bureau fermé', ar: 'المكتب مسكّر' } },
  { id: 'moved', label: { fr: 'A déménagé', ar: 'تبدّل البلاصة' } },
  { id: 'hours', label: { fr: 'Horaires différents', ar: 'الأوقات مختلفة' } },
  { id: 'phone', label: { fr: 'Téléphone incorrect', ar: 'رقم الهاتف غالط' } },
  { id: 'missing', label: { fr: 'Bureau absent de la carte', ar: 'مكتب موش موجود في الخريطة' } },
  { id: 'other', label: { fr: 'Autre', ar: 'حاجة أخرى' } },
] as const

export type ReportKind = (typeof reportKinds)[number]['id']
