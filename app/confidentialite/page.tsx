import type { Metadata } from 'next'
import { PrivacyContent } from '@/components/privacy-content'

export const metadata: Metadata = {
  title: 'Protection de vos données | Dalil',
  description: 'Ce que Dalil collecte, ce qu’il ne collecte jamais, et le cadre légal tunisien appliqué.',
}

export default function PrivacyPage() {
  return (
    <main>
      <PrivacyContent />
    </main>
  )
}
