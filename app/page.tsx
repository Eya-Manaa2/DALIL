import { Hotlines } from '@/components/hotlines'
import { OtherWays, ServiceDesk } from '@/components/service-desk'

export default function Page() {
  return (
    <main>
      <ServiceDesk />
      <OtherWays />
      <Hotlines />
    </main>
  )
}
