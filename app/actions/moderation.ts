'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import { fieldReports } from '@/lib/db/schema'

const moderationSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['approved', 'rejected', 'new']),
})

export async function moderateReport(input: { id: number; status: 'approved' | 'rejected' | 'new' }) {
  await requireAdmin()
  const { id, status } = moderationSchema.parse(input)
  await db.update(fieldReports).set({ status }).where(eq(fieldReports.id, id))
  revalidatePath('/moderation')
  revalidatePath('/tableau-de-bord')
}
