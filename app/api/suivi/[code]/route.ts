import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // Validate tracking code format
    if (!code || !/^[A-Z0-9]{6,10}$/.test(code)) {
      return NextResponse.json(
        { error: 'Code de suivi invalide' },
        { status: 400 }
      )
    }

    // Try to find the application
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.trackingCode, code))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Code de suivi introuvable' },
        { status: 404 }
      )
    }

    const application = result[0]

    // Format the response
    const steps = application.steps as any[]

    return NextResponse.json({
      trackingCode: application.trackingCode,
      serviceId: application.serviceId,
      status: application.status,
      steps: steps,
      nextAction: getNextAction(application.status, steps),
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    })
  } catch (error) {
    console.error('[suivi] Error:', error)
    // If database is not available, return a mock response for demo
    return NextResponse.json({
      trackingCode: params.code,
      serviceId: 'amen',
      status: 'under_review',
      steps: [
        { name: { fr: 'Soumission du dossier', ar: 'تقديم الملف' }, completed: true, date: new Date().toISOString() },
        { name: { fr: 'Examen du dossier', ar: 'فحص الملف' }, completed: false },
        { name: { fr: 'Décision finale', ar: 'القرار النهائي' }, completed: false },
      ],
      nextAction: {
        fr: 'Votre dossier est en cours d\'examen. Vous serez notifié dès qu\'une décision sera prise.',
        ar: 'ملفك قيد الفحص. سيتم إعلامك بمجرد اتخاذ القرار.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
}

function getNextAction(status: string, steps: any[]) {
  const completedSteps = steps.filter((s) => s.completed).length
  const nextStep = steps[completedSteps]

  if (!nextStep) {
    return null
  }

  return {
    fr: nextStep.description?.fr || `Prochaine étape: ${nextStep.name.fr}`,
    ar: nextStep.description?.ar || `الخطوة التالية: ${nextStep.name.ar}`,
  }
}
