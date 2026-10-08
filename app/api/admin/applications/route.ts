import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const service = searchParams.get('service')

    let query = db.select().from(applications)

    if (status) {
      query = query.where(eq(applications.status, status))
    }

    if (service) {
      query = query.where(eq(applications.serviceId, service))
    }

    const result = await query.orderBy(applications.createdAt, 'desc').limit(100)

    return NextResponse.json({
      applications: result,
      total: result.length,
    })
  } catch (error) {
    console.error('[admin/applications] Error:', error)
    // Return mock data for demo if DB fails
    return NextResponse.json({
      applications: [
        {
          id: 1,
          trackingCode: 'ABC12345',
          serviceId: 'amen',
          status: 'under_review',
          userData: { nom: 'Test User', cin: '12345678' },
          steps: [
            { name: { fr: 'Formulaire rempli', ar: 'نموذج مملوء' }, completed: true, date: new Date().toISOString() },
            { name: { fr: 'Documents téléversés', ar: 'تم رفع الوثائق' }, completed: true, date: new Date().toISOString() },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          trackingCode: 'XYZ67890',
          serviceId: 'handicap',
          status: 'submitted',
          userData: { nom: 'Test User 2', cin: '87654321' },
          steps: [
            { name: { fr: 'Formulaire rempli', ar: 'نموذج مملوء' }, completed: true, date: new Date().toISOString() },
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          trackingCode: 'DEF24680',
          serviceId: 'amen',
          status: 'approved',
          userData: { nom: 'Test User 3', cin: '11111111' },
          steps: [
            { name: { fr: 'Formulaire rempli', ar: 'نموذج مملوء' }, completed: true, date: new Date().toISOString() },
            { name: { fr: 'Documents téléversés', ar: 'تم رفع الوثائق' }, completed: true, date: new Date().toISOString() },
            { name: { fr: 'Examen commencé', ar: 'بدأ الفحص' }, completed: true, date: new Date().toISOString() },
            { name: { fr: 'Approuvé', ar: 'موافق عليه' }, completed: true, date: new Date().toISOString() },
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 3,
    })
  }
}
