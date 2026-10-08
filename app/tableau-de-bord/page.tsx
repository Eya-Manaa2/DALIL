'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, CheckCircle, Clock, AlertCircle, FileText, Users, TrendingUp, Shield } from 'lucide-react'
import { useLang } from '@/components/lang-provider'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { t, lang } = useLang()
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterService, setFilterService] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('dalil-role')
    if (role !== 'admin') {
      router.push('/select-role')
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications')
      if (res.ok) {
        const data = await res.json()
        setApplications(data.applications || [])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false
    if (filterService !== 'all' && app.serviceId !== filterService) return false
    if (searchQuery && !app.trackingCode.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === 'draft').length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
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
      under_review: { fr: 'En examen', ar: 'قيد الفحص' },
      additional_docs_requested: { fr: 'Documents demandés', ar: 'مطلوب وثائق' },
      approved: { fr: 'Approuvé', ar: 'موافق عليه' },
      rejected: { fr: 'Rejeté', ar: 'مرفوض' },
    }
    return labels[status]?.[lang] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent size-12" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary to-background">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {lang === 'fr' ? 'Tableau de bord - Intervenants Sociaux' : 'لوحة القيادة - العاملون الاجتماعيون'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'fr'
              ? 'Gestion des demandes et suivi des dossiers'
              : 'إدارة الطلبات ومتابعة الملفات'}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Total' : 'المجموع'}</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                <Clock className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'En cours' : 'قيد المعالجة'}</p>
                <p className="text-2xl font-bold text-foreground">{stats.under_review}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Approuvés' : 'موافق عليها'}</p>
                <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Rejetés' : 'مرفوضة'}</p>
                <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={lang === 'fr' ? 'Rechercher par code...' : 'بحث بالرمز...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-border bg-background pl-10 pr-4 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">{lang === 'fr' ? 'Tous les statuts' : 'جميع الحالات'}</option>
            <option value="draft">{lang === 'fr' ? 'Brouillon' : 'مسودة'}</option>
            <option value="submitted">{lang === 'fr' ? 'Soumis' : 'مقدم'}</option>
            <option value="under_review">{lang === 'fr' ? 'En examen' : 'قيد الفحص'}</option>
            <option value="approved">{lang === 'fr' ? 'Approuvé' : 'موافق عليه'}</option>
            <option value="rejected">{lang === 'fr' ? 'Rejeté' : 'مرفوض'}</option>
          </select>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="rounded-xl border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">{lang === 'fr' ? 'Tous les services' : 'جميع الخدمات'}</option>
            <option value="amen">{lang === 'fr' ? 'AMEN Social' : 'الأمان الاجتماعي'}</option>
            <option value="handicap">{lang === 'fr' ? 'Carte Handicap' : 'بطاقة الإعاقة'}</option>
          </select>
        </div>

        {/* Applications List */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {lang === 'fr' ? 'Code' : 'الرمز'}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {lang === 'fr' ? 'Service' : 'الخدمة'}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {lang === 'fr' ? 'Statut' : 'الحالة'}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {lang === 'fr' ? 'Date' : 'التاريخ'}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {lang === 'fr' ? 'Actions' : 'الإجراءات'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {lang === 'fr' ? 'Aucune demande trouvée' : 'لا توجد طلبات'}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="border-t border-border">
                      <td className="px-6 py-4">
                        <code className="font-mono text-sm text-foreground">{app.trackingCode}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">{app.serviceId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className="text-sm text-foreground">{getStatusLabel(app.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-TN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(app.id, 'under_review')}
                            className="rounded-lg bg-yellow-500/10 px-3 py-1.5 text-sm font-medium text-yellow-700 hover:bg-yellow-500/20"
                          >
                            {lang === 'fr' ? 'Examiner' : 'فحص'}
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'approved')}
                            className="rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-500/20"
                          >
                            {lang === 'fr' ? 'Approuver' : 'موافقة'}
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'rejected')}
                            className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-500/20"
                          >
                            {lang === 'fr' ? 'Rejeter' : 'رفض'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
            {lang === 'fr' ? 'Workflow type' : 'نوع سير العمل'}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <CheckCircle className="size-5 text-green-500" />
              <div>
                <p className="font-medium text-foreground">{lang === 'fr' ? '1. Soumission' : '1. التقديم'}</p>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Utilisateur remplit le formulaire' : 'المستخدم يملأ النموذج'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <Clock className="size-5 text-yellow-500" />
              <div>
                <p className="font-medium text-foreground">{lang === 'fr' ? '2. Examen' : '2. الفحص'}</p>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Intervenant examine le dossier' : 'العامل الاجتماعي يفحص الملف'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <CheckCircle className="size-5 text-green-500" />
              <div>
                <p className="font-medium text-foreground">{lang === 'fr' ? '3. Décision' : '3. القرار'}</p>
                <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Approuver ou rejeter la demande' : 'موافقة أو رفض الطلب'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
