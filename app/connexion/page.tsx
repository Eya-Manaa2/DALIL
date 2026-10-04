import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthForm } from '@/components/admin-auth-form'
import { getAdminSession } from '@/lib/admin'

export const metadata: Metadata = {
  title: 'Connexion modération | Dalil',
  robots: { index: false, follow: false },
}

export default async function SignInPage() {
  if (await getAdminSession()) redirect('/moderation')

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted px-4 py-12">
      <AdminAuthForm />
    </main>
  )
}
