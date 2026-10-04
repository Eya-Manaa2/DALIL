import type { Metadata } from 'next'
import { ProjectPresentation } from '@/components/project-presentation'

export const metadata: Metadata = {
  title: 'Présentation du projet | Dalil Social',
  description: 'Le problème, la solution, les garanties, les indicateurs d’impact et le plan de déploiement de Dalil Social.',
}

export default function PresentationPage() {
  return (
    <main>
      <ProjectPresentation />
    </main>
  )
}
