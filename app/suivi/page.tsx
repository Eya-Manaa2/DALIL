'use client'

import { useState } from 'react'
import { Search, AlertCircle, CheckCircle, Clock, FileText, Printer } from 'lucide-react'
import { useLang } from '@/components/lang-provider'

export default function SuiviPage() {
  const { t, lang } = useLang()
  const [trackingCode, setTrackingCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [application, setApplication] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!trackingCode.trim()) return

    setLoading(true)
    setError('')
    setApplication(null)

    try {
      const res = await fetch(`/api/suivi/${trackingCode}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Code de suivi introuvable')
      }
      const data = await res.json()
      setApplication(data)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="size-5 text-green-500" />
      case 'rejected':
        return <AlertCircle className="size-5 text-red-500" />
      case 'under_review':
      case 'additional_docs_requested':
        return <Clock className="size-5 text-yellow-500" />
      default:
        return <FileText className="size-5 text-blue-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { fr: string; ar: string }> = {
      draft: { fr: 'Brouillon', ar: 'مسودة' },
      submitted: { fr: 'Soumis', ar: 'مقدم' },
      under_review: { fr: 'En cours d\'examen', ar: 'قيد الفحص' },
      additional_docs_requested: { fr: 'Documents demandés', ar: 'مطلوب وثائق' },
      approved: { fr: 'Approuvé', ar: 'موافق عليه' },
      rejected: { fr: 'Rejeté', ar: 'مرفوض' },
    }
    return labels[status]?.[lang] || status
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary to-background">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {lang === 'fr' ? 'Suivre votre demande' : 'متابعة طلبك'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'fr' ? 'Entrez votre code de suivi pour voir l\'état d\'avancement' : 'أدخل رمز المتابعة لرؤية حالة التقدم'}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              placeholder={lang === 'fr' ? 'Code de suivi (ex: ABC123)' : 'رمز المتابعة (مثال: ABC123)'}
              className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 text-lg focus:border-primary focus:outline-none"
              maxLength={10}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !trackingCode.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin rounded-full border-2 border-primary-foreground border-t-transparent size-5" />
              ) : (
                <Search className="size-5" />
              )}
              {lang === 'fr' ? 'Rechercher' : 'بحث'}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {application && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {lang === 'fr' ? 'Demande' : 'الطلب'} #{application.trackingCode}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {application.serviceId}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                  {getStatusIcon(application.status)}
                  <span className="font-semibold text-foreground">
                    {getStatusLabel(application.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  {lang === 'fr' ? 'Étapes' : 'الخطوات'}
                </h3>
                <div className="space-y-2">
                  {application.steps.map((step: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 rounded-lg p-3 ${
                        step.completed ? 'bg-primary/5' : 'bg-muted'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                      ) : (
                        <Clock className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{step.name[lang]}</p>
                        {step.date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(step.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-TN')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {application.nextAction && (
                <div className="mt-4 rounded-lg bg-primary/10 p-4">
                  <p className="font-semibold text-primary">
                    {lang === 'fr' ? 'Prochaine action' : 'الإجراء التالي'}
                  </p>
                  <p className="mt-1 text-sm text-primary/90">{application.nextAction[lang]}</p>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/generer-dossier?trackingCode=${application.trackingCode}`}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <FileText className="size-4" />
                    {lang === 'fr' ? 'Générer mon dossier' : 'إنشاء ملفي'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
