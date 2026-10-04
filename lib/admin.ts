import 'server-only'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin-emails'
import { auth } from '@/lib/auth'

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) return null
  return session
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}
