import type { Lang } from './i18n'
import { audiences, governorates, needs, type Audience, type Need } from './services-data'

export type FicheState = {
  audience: Audience | null
  needs: Need[]
  gov: string
  lang: Lang
}

type Params = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

export function parseFiche(params: Params): FicheState {
  const a = first(params.a)
  const audience = audiences.some((x) => x.id === a) ? (a as Audience) : null
  const needIds = new Set(needs.map((n) => n.id))
  const selected = first(params.n)
    .split(',')
    .filter((n): n is Need => needIds.has(n as Need))
  const g = first(params.g)
  const gov = governorates.some((x) => x.fr === g) ? g : ''
  const lang: Lang = first(params.l) === 'ar' ? 'ar' : 'fr'
  return { audience, needs: [...new Set(selected)], gov, lang }
}

export function ficheQuery({ audience, needs: n, gov, lang }: FicheState) {
  const q = new URLSearchParams()
  if (audience) q.set('a', audience)
  if (n.length) q.set('n', n.join(','))
  if (gov) q.set('g', gov)
  if (lang === 'ar') q.set('l', 'ar')
  return q.toString()
}
