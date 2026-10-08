import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Statut requis' },
        { status: 400 }
      )
    }

    // Update application status
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    // Add step for status change
    const statusLabels: Record<string, { fr: string; ar: string }> = {
      under_review: { fr: 'Examen commencé', ar: 'بدأ الفحص' },
      additional_docs_requested: { fr: 'Documents demandés', ar: 'مطلوب وثائق' },
      approved: { fr: 'Approuvé', ar: 'موافق عليه' },
      rejected: { fr: 'Rejeté', ar: 'مرفوض' },
    }

    // Get current application to add step
    const current = await db
      .select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1)

    if (current && current.length > 0) {
      const steps = current[0].steps as any[]
      const newSteps = [
        ...steps,
        {
          name: statusLabels[status] || { fr: 'Statut changé', ar: 'تم تغيير الحالة' },
          completed: true,
          date: new Date().toISOString(),
        },
      ]
      updateData.steps = newSteps
    }

    await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, parseInt(id)))

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('[admin/applications/update] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
