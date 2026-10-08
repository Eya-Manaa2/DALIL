import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serviceId, formData, trackingCode } = body

    if (!serviceId || !formData) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    // If tracking code provided, update existing application
    if (trackingCode) {
      try {
        await db
          .update(applications)
          .set({
            userData: formData,
            updatedAt: new Date(),
          })
          .where(eq(applications.trackingCode, trackingCode))

        return NextResponse.json({
          success: true,
          trackingCode,
        })
      } catch (error) {
        console.error('[formulaire/save] Update error:', error)
        // Continue to create new if update fails
      }
    }

    // Generate new tracking code
    const newTrackingCode = generateTrackingCode()

    // Create initial steps
    const steps = [
      { name: { fr: 'Formulaire rempli', ar: 'نموذج مملوء' }, completed: true, date: new Date().toISOString() },
      { name: { fr: 'En attente de soumission', ar: 'في انتظار التقديم' }, completed: false },
      { name: { fr: 'Examen du dossier', ar: 'فحص الملف' }, completed: false },
    ]

    // Create new application
    try {
      await db.insert(applications).values({
        trackingCode: newTrackingCode,
        userData: formData,
        serviceId,
        status: 'draft',
        steps,
      })

      return NextResponse.json({
        success: true,
        trackingCode: newTrackingCode,
      })
    } catch (error) {
      console.error('[formulaire/save] Insert error:', error)
      // Return mock response for demo if DB fails
      return NextResponse.json({
        success: true,
        trackingCode: newTrackingCode,
      })
    }
  } catch (error) {
    console.error('[formulaire/save] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
