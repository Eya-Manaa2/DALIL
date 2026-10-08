'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Hotlines } from '@/components/hotlines'
import { OtherWays, ServiceDesk } from '@/components/service-desk'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('dalil-role')
    if (!role) {
      router.push('/select-role')
    }
  }, [])

  return (
    <main>
      <ServiceDesk />
      <OtherWays />
      <Hotlines />
    </main>
  )
}
