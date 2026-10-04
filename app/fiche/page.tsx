import type { Metadata } from 'next'
import { headers } from 'next/headers'
import QRCode from 'qrcode'
import { FicheView } from '@/components/fiche-view'
import { ficheQuery, parseFiche } from '@/lib/fiche'

export const metadata: Metadata = {
  title: 'Ma fiche – Dalil Social',
  description: 'Votre liste personnalisée des aides sociales, documents à préparer et lieux où aller.',
}

export default async function FichePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const state = parseFiche(await searchParams)
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  const query = ficheQuery(state)
  const url = `${proto}://${host}/fiche${query ? `?${query}` : ''}`
  const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })

  return <FicheView state={state} path={`/fiche${query ? `?${query}` : ''}`} qrSvg={qrSvg} />
}
