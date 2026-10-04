import type { Metadata } from 'next'
import { NearbyServices } from '@/components/nearby-services'

export const metadata: Metadata = {
  title: 'Bureaux sociaux près de chez vous | Dalil',
  description: 'Carte des bureaux d’action sociale, CNSS, CNAM et centres de protection, avec itinéraire.',
}

export default function MapPage() {
  return (
    <main>
      <NearbyServices />
    </main>
  )
}
