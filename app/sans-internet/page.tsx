import type { Metadata } from 'next'
import { UssdSimulator } from '@/components/ussd-simulator'

export const metadata: Metadata = {
  title: 'Accès sans internet par code USSD | Dalil',
  description: 'Le même guide depuis n’importe quel téléphone, sans smartphone ni connexion.',
}

export default function OfflinePage() {
  return (
    <main>
      <UssdSimulator />
    </main>
  )
}
