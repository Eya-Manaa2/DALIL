'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Info } from 'lucide-react'
import { useLang } from '@/components/lang-provider'

export default function SelectRolePage() {
  const { t, lang } = useLang()
  const router = useRouter()

  const selectRole = (role: 'citizen' | 'admin') => {
    localStorage.setItem('dalil-role', role)
    router.push(role === 'admin' ? '/tableau-de-bord' : '/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary to-background flex items-center justify-center px-4">
      <div className="mx-auto max-w-2xl w-full">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {lang === 'fr' ? 'Bienvenue sur Dalil Social' : 'مرحباً بك في دليل الاجتماعي'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'fr'
              ? 'Sélectionnez votre profil pour accéder aux fonctionnalités appropriées'
              : 'اختر ملفك الشخصي للوصول إلى الوظائف المناسبة'}
          </p>
        </div>

        {/* POC Disclaimer */}
        <div className="mb-8 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 text-yellow-600 shrink-0" />
            <div>
              <p className="font-semibold text-yellow-700">
                {lang === 'fr' ? 'POC - Démonstration' : 'POC - عرض توضيحي'}
              </p>
              <p className="mt-1 text-sm text-yellow-600/80">
                {lang === 'fr'
                  ? 'Cette page est une démonstration pour le hackathon. En production, l\'authentification sera intégrée avec le système d\'identité du Ministère des Affaires Sociales.'
                  : 'هذه الصفحة هي عرض توضيحي للهاكاثون. في الإنتاج، سيتم دمج المصادقة مع نظام هوية وزارة الشؤون الاجتماعية.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Citizen Card */}
          <button
            onClick={() => selectRole('citizen')}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 text-left transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="relative z-10">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <User className="size-8" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {lang === 'fr' ? 'Citoyen / Bénéficiaire' : 'مواطن / مستفيد'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {lang === 'fr'
                  ? 'Accédez aux services sociaux, à l\'assistant IA, au guide d\'orientation et au suivi de vos demandes.'
                  : 'الوصول إلى الخدمات الاجتماعية، والمساعد الذكي، ودليل التوجيه، ومتابعة طلباتك.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {lang === 'fr' ? 'Assistant IA' : 'مساعد ذكي'}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {lang === 'fr' ? 'Guide orientation' : 'دليل التوجيه'}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {lang === 'fr' ? 'Suivi demande' : 'متابعة الطلب'}
                </span>
              </div>
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => selectRole('admin')}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 text-left transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="relative z-10">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Shield className="size-8" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {lang === 'fr' ? 'Intervenant Social / Admin' : 'عامل اجتماعي / مدير'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {lang === 'fr'
                  ? 'Gérez les demandes, suivez les dossiers, et organisez le workflow des intervenants sociaux.'
                  : 'إدارة الطلبات، ومتابعة الملفات، وتنظيم سير عمل العاملين الاجتماعيين.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {lang === 'fr' ? 'Dashboard' : 'لوحة القيادة'}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {lang === 'fr' ? 'Gestion demandes' : 'إدارة الطلبات'}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {lang === 'fr' ? 'Workflow' : 'سير العمل'}
                </span>
              </div>
            </div>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {lang === 'fr'
            ? 'Vous pourrez changer de rôle à tout moment depuis le menu.'
            : 'يمكنك تغيير الدور في أي وقت من القائمة.'}
        </p>
      </div>
    </main>
  )
}
