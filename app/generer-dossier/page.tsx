'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Printer, Download, CheckCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useLang } from '@/components/lang-provider'
import { services } from '@/lib/services-data'

export default function GenererDossierPage() {
  const { t, lang } = useLang()
  const searchParams = useSearchParams()
  const trackingCode = searchParams.get('trackingCode')
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (trackingCode) {
      fetchApplication(trackingCode)
    }
  }, [trackingCode])

  const fetchApplication = async (code: string) => {
    try {
      const res = await fetch(`/api/suivi/${code}`)
      if (res.ok) {
        const data = await res.json()
        setApplication(data)
      }
    } catch (error) {
      console.error('Error fetching application:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent size-12" />
      </div>
    )
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {lang === 'fr' ? 'Dossier non trouvé' : 'الملف غير موجود'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'fr'
              ? 'Aucun dossier trouvé pour ce code de suivi'
              : 'لا يوجد ملف لهذا الرمز'}
          </p>
          <Link
            href="/suivi"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            <ArrowLeft className="size-4" />
            {lang === 'fr' ? 'Retour' : 'رجوع'}
          </Link>
        </div>
      </main>
    )
  }

  const service = services.find((s) => s.id === application.serviceId)

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary to-background">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Link
            href="/suivi"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {lang === 'fr' ? 'Retour' : 'رجوع'}
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Printer className="size-4" />
              {lang === 'fr' ? 'Imprimer' : 'طباعة'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm print:shadow-none print:border-0">
          {/* Header */}
          <div className="mb-8 border-b border-border pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {lang === 'fr' ? 'Dossier de Demande' : 'ملف الطلب'}
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {service?.title[lang]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {lang === 'fr' ? 'Code de suivi' : 'رمز المتابعة'}
                </p>
                <p className="font-mono text-lg font-bold text-foreground">
                  {application.trackingCode}
                </p>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {lang === 'fr' ? 'Service' : 'الخدمة'}
            </h2>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="font-semibold text-foreground">{service?.title[lang]}</p>
              <p className="mt-2 text-sm text-muted-foreground">{service?.summary[lang]}</p>
            </div>
          </div>

          {/* Documents Checklist */}
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {lang === 'fr' ? 'Documents à fournir' : 'الوثائق المطلوبة'}
            </h2>
            <div className="space-y-2">
              {service?.documents.map((doc, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{doc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {lang === 'fr' ? 'Étapes' : 'الخطوات'}
            </h2>
            <div className="space-y-3">
              {service?.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-foreground">{step[lang]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Where to go */}
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {lang === 'fr' ? 'Où déposer le dossier' : 'أين تقدم الملف'}
            </h2>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-foreground">{service?.where[lang]}</p>
            </div>
          </div>

          {/* User Data */}
          {application.userData && (
            <div className="mb-8">
              <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
                {lang === 'fr' ? 'Vos informations' : 'معلوماتك'}
              </h2>
              <div className="rounded-lg border border-border p-4">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(application.userData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {lang === 'fr'
                ? 'Ce document a été généré par Dalil Social'
                : 'تم إنشاء هذا المستند بواسطة دليل اجتماعي'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-TN')}
            </p>
          </div>
        </div>

        {/* Print-specific instructions */}
        <div className="mt-6 rounded-2xl bg-primary/10 p-4 print:hidden">
          <p className="text-sm text-primary">
            <strong>{lang === 'fr' ? 'Instructions d\'impression' : 'تعليمات الطباعة'}:</strong>{' '}
            {lang === 'fr'
              ? 'Cliquez sur le bouton "Imprimer" pour imprimer ce dossier. Assurez-vous d\'avoir coché "Arrière-plan graphiques" dans les paramètres d\'impression.'
              : 'انقر على زر "طباعة" لطباعة هذا الملف. تأكد من تحديد "الرسومات البيانية" في إعدادات الطباعة.'}
          </p>
        </div>
      </div>
    </main>
  )
}
