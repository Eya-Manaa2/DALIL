import { desc } from 'drizzle-orm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ModerationList } from '@/components/moderation-list'
import { SignOutButton } from '@/components/sign-out-button'
import { getAdminSession } from '@/lib/admin'
import { db } from '@/lib/db'
import { fieldReports } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Modération des signalements | Dalil',
  robots: { index: false, follow: false },
}

export default async function ModerationPage() {
  const session = await getAdminSession()
  if (!session) redirect('/connexion')

  const reports = await db.select().from(fieldReports).orderBy(desc(fieldReports.createdAt)).limit(200)

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <a href="/tableau-de-bord" className="text-sm font-medium text-primary hover:underline">
            ← Tableau de bord public
          </a>
          <h1 className="font-heading text-3xl font-semibold text-balance">Modération des signalements</h1>
          <p className="text-sm text-muted-foreground">
            Connecté en tant que {session.user.email}. Seuls les signalements approuvés sont publiés.
          </p>
        </div>
        <SignOutButton />
      </header>

      <ModerationList
        reports={reports.map((r) => ({
          id: r.id,
          createdAt: r.createdAt.toISOString(),
          officeName: r.officeName,
          governorate: r.governorate,
          kind: r.kind,
          details: r.details,
          status: r.status,
        }))}
      />
    </main>
  )
}
