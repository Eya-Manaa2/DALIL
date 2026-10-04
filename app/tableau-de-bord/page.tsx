import type { Metadata } from 'next'
import { connection } from 'next/server'
import { DashboardView } from '@/components/dashboard-view'
import { getDashboardData } from '@/lib/dashboard-data'

export const metadata: Metadata = {
  title: 'Tableau de bord des besoins sociaux | Dalil',
  description:
    'Besoins les plus recherchés par région, zones mal desservies et signalements du terrain, à partir de données anonymes.',
}

export default async function DashboardPage() {
  await connection()
  const data = await getDashboardData()

  return (
    <main>
      <DashboardView data={data} />
    </main>
  )
}
