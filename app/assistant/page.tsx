import type { Metadata } from 'next'
import { AiAssistant } from '@/components/ai-assistant'

export const metadata: Metadata = {
  title: 'Expliquez votre situation en darija | Dalil',
  description: 'Parlez ou écrivez en darija, en arabe ou en français : l’assistant vous oriente vers les bonnes aides.',
}

export default function AssistantPage() {
  return (
    <main>
      <AiAssistant />
    </main>
  )
}
