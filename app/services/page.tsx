import type { Metadata } from 'next'
import { ServiceCatalog } from '@/components/service-catalog'

export const metadata: Metadata = {
  title: 'Tous les services sociaux en Tunisie | Dalil',
  description: 'Les aides sociales tunisiennes vérifiées : conditions, papiers à préparer et où s’adresser.',
}

export default function ServicesPage() {
  return (
    <main>
      <ServiceCatalog />
    </main>
  )
}
