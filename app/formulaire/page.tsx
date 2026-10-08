'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { FormWizard } from '@/components/form-wizard'
import { useLang } from '@/components/lang-provider'

export default function FormulairePage() {
  const { t, lang } = useLang()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') || 'amen'
  const [trackingCode, setTrackingCode] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('trackingCode')
    if (code) setTrackingCode(code)
  }, [searchParams])

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/formulaire/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      const result = await res.json()
      if (result.trackingCode) {
        setTrackingCode(result.trackingCode)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert(lang === 'fr' ? 'Erreur lors de la sauvegarde' : 'خطأ أثناء الحفظ')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary to-background">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {lang === 'fr' ? 'Retour' : 'رجوع'}
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {lang === 'fr' ? 'Formulaire de demande' : 'نموذج الطلب'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'fr'
              ? 'Remplissez le formulaire pour votre demande. Les champs marqués d\'un * sont obligatoires.'
              : 'املأ النموذج لطلبك. الحقول المشار إليها بـ * إلزامية.'}
          </p>
        </div>

        <FormWizard
          serviceId={serviceId}
          onSave={handleSave}
          trackingCode={trackingCode || undefined}
        />

        {trackingCode && (
          <div className="mt-6 rounded-2xl bg-primary/10 p-4 text-center">
            <p className="mb-2 font-semibold text-primary">
              {lang === 'fr' ? 'Code de suivi' : 'رمز المتابعة'}
            </p>
            <code className="rounded-lg bg-primary px-4 py-2 text-2xl font-mono text-primary-foreground">
              {trackingCode}
            </code>
            <p className="mt-2 text-sm text-primary/80">
              {lang === 'fr'
                ? 'Utilisez ce code pour suivre votre demande'
                : 'استخدم هذا الرمز لمتابعة طلبك'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
