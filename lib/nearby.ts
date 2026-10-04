import type { Localized } from './i18n'

export type OfficeCategory = 'social' | 'cnss' | 'cnam' | 'cnrps' | 'emploi'

export const officeCategories: {
  id: OfficeCategory
  label: Localized
  pattern: string
  mapsQuery: string
}[] = [
  {
    id: 'social',
    label: { fr: 'Affaires sociales', ar: 'الشؤون الاجتماعية' },
    pattern:
      'Affaires sociales|Promotion sociale|Action sociale|D[ée]fense et d.Int[ée]gration|CDIS|Protection de l.enfance|الشؤون الاجتماعية|الشؤون الإجتماعية|النهوض الاجتماعي|النهوض الإجتماعي|الدفاع والإدماج|الإحاطة والتوجيه|حماية الطفولة',
    mapsQuery: 'Unité locale de promotion sociale',
  },
  {
    id: 'cnss',
    label: { fr: 'CNSS', ar: 'الضمان الاجتماعي' },
    pattern: 'CNSS|S[ée]curit[ée] Sociale|الضمان الاجتماعي|الضمان الإجتماعي',
    mapsQuery: 'CNSS',
  },
  {
    id: 'cnam',
    label: { fr: 'CNAM', ar: 'التأمين على المرض' },
    pattern: 'CNAM|Assurance[- ]Maladie|التأمين على المرض',
    mapsQuery: 'CNAM',
  },
  {
    id: 'cnrps',
    label: { fr: 'CNRPS', ar: 'صندوق التقاعد' },
    pattern: 'CNRPS|Retraite et de Pr[ée]voyance|للتقاعد والحيطة',
    mapsQuery: 'CNRPS',
  },
  {
    id: 'emploi',
    label: { fr: 'Bureau de l’emploi', ar: 'مكتب التشغيل' },
    pattern: 'Bureau d.emploi|ANETI|مكتب التشغيل|للتشغيل',
    mapsQuery: 'Bureau de l’emploi ANETI',
  },
]

export type Office = {
  id: string
  osmUrl: string
  name: string
  category: OfficeCategory
  lat: number
  lng: number
  address?: string
  phone?: string
  hours?: string
}

export const governorateCenters: Record<string, [number, number]> = {
  Ariana: [36.8625, 10.1956],
  Béja: [36.7256, 9.1817],
  'Ben Arous': [36.7531, 10.2189],
  Bizerte: [37.2744, 9.8739],
  Gabès: [33.8815, 10.0982],
  Gafsa: [34.425, 8.7842],
  Jendouba: [36.5011, 8.7802],
  Kairouan: [35.6781, 10.0963],
  Kasserine: [35.1676, 8.8365],
  Kébili: [33.7044, 8.969],
  'Le Kef': [36.1822, 8.7148],
  Mahdia: [35.5047, 11.0622],
  'La Manouba': [36.8101, 10.0956],
  Médenine: [33.3549, 10.5055],
  Monastir: [35.7643, 10.8113],
  Nabeul: [36.4561, 10.7376],
  Sfax: [34.7406, 10.7603],
  'Sidi Bouzid': [35.0382, 9.4849],
  Siliana: [36.0849, 9.3708],
  Sousse: [35.8256, 10.6084],
  Tataouine: [32.9297, 10.4518],
  Tozeur: [33.9197, 8.1335],
  Tunis: [36.8065, 10.1815],
  Zaghouan: [36.4029, 10.1429],
}

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const rad = Math.PI / 180
  const dLat = (bLat - aLat) * rad
  const dLng = (bLng - aLng) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

export const directionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

export const mapsSearchUrl = (query: string, lat: number, lng: number) =>
  `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},13z`
