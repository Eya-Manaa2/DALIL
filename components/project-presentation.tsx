'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BarChart3, LayoutGrid, MapPin, Mic, ShieldCheck, Smartphone } from 'lucide-react'
import { useLang } from './lang-provider'

type L = { fr: string; ar: string }

const copy = {
  kicker: { fr: 'Défi 1 · Faciliter l’accès et l’orientation vers les services sociaux', ar: 'التحدي 1 · تسهيل النفاذ والتوجيه للخدمات الاجتماعية' },
  title: {
    fr: 'Un seul guichet pour savoir à quelle aide on a droit, et où aller. Même sans internet, même sans savoir lire.',
    ar: 'شبّاك واحد باش تعرف شنوّة الإعانة إلّي من حقّك ووين تمشي. حتى بلا إنترنت، وحتى إلّي ما يعرفش يقرا.',
  },
  problemTitle: { fr: 'Le problème', ar: 'المشكل' },
  problems: [
    {
      fr: 'L’information est dispersée entre le ministère des Affaires sociales, la CNSS, la CNAM, l’UTSS et les délégations de protection de l’enfance.',
      ar: 'المعلومة مشتّتة بين وزارة الشؤون الاجتماعية والـCNSS والـCNAM والـUTSS ومندوبي حماية الطفولة.',
    },
    {
      fr: 'Les familles se déplacent plusieurs fois au mauvais bureau, sans les bons papiers.',
      ar: 'العايلات تمشي برشا مرات للمكتب الغالط، ومن غير الأوراق الصحيحة.',
    },
    {
      fr: 'Les personnes qui ont le plus besoin d’aide sont souvent celles qui ont le moins accès au numérique.',
      ar: 'إلّي محتاجين أكثر للإعانة، هوما غالبًا إلّي عندهم أقل نفاذ للرقمي.',
    },
  ] as L[],
  solutionTitle: { fr: 'La solution : cinq portes d’entrée, une seule base vérifiée', ar: 'الحل: خمسة أبواب، وقاعدة معلومات وحدة مثبّتة' },
  channels: [
    { href: '/assistant', icon: Mic, t: { fr: 'Parler en darija', ar: 'الحكي بالدارجة' }, d: { fr: 'On explique sa situation à voix haute ; l’assistant répète ce qu’il a compris, puis oriente.', ar: 'تحكي على وضعيتك، المساعد يعاود إلّي فهمو، ومبعد يوجّهك.' } },
    { href: '/', icon: LayoutGrid, t: { fr: 'Trois questions en images', ar: 'ثلاثة أسئلة بالتصاور' }, d: { fr: 'Pour qui, quel besoin, quel gouvernorat : la liste des aides et des papiers à préparer.', ar: 'لمن، شنوّة الحاجة، أنا ولاية: قائمة الإعانات والأوراق.' } },
    { href: '/carte', icon: MapPin, t: { fr: 'Le bureau le plus proche', ar: 'أقرب مكتب' }, d: { fr: 'Carte et itinéraire vers les vrais bureaux, à partir des données ouvertes.', ar: 'خريطة وطريق للمكاتب الحقيقية، من المعطيات المفتوحة.' } },
    { href: '/sans-internet', icon: Smartphone, t: { fr: 'Code USSD pour tout téléphone', ar: 'كود USSD لأي تليفون' }, d: { fr: 'Le même parcours sans smartphone ni connexion, résultat envoyé par SMS.', ar: 'نفس المسار بلا تليفون ذكي وبلا إنترنت، والنتيجة بـSMS.' } },
    { href: '/tableau-de-bord', icon: BarChart3, t: { fr: 'Tableau de bord du ministère', ar: 'لوحة قيادة للوزارة' }, d: { fr: 'Besoins recherchés par région, zones mal desservies, signalements modérés du terrain.', ar: 'الحاجيات حسب الجهة، المناطق الناقصة، وإشعارات الميدان بعد المراجعة.' } },
  ],
  trustTitle: { fr: 'Pourquoi on peut lui faire confiance', ar: 'علاش تنجّم تثق فيه' },
  trust: [
    { fr: 'Informations vérifiées sur les sites officiels, avec la source affichée.', ar: 'معلومات مثبّتة من المواقع الرسمية، والمصدر ظاهر.' },
    { fr: 'L’assistant ne répond qu’à partir de cette base : il n’invente pas de programme.', ar: 'المساعد يجاوب كان من القاعدة هاذي: ما يخترعش برامج.' },
    { fr: 'Aucun nom, numéro de CIN ou position exacte enregistrés, conformément à la loi organique n° 2004-63.', ar: 'ما يتسجّل حتى اسم ولا رقم بطاقة تعريف ولا موقع دقيق، طبقًا للقانون الأساسي عدد 63 لسنة 2004.' },
    { fr: 'Signalements publiés seulement après modération ; protection contre les abus.', ar: 'الإشعارات ما تتنشرش كان بعد المراجعة، وحماية من التجاوزات.' },
  ] as L[],
  impactTitle: { fr: 'Ce que nous mesurerons pendant le pilote', ar: 'شنوّة باش نقيسو في التجربة' },
  impact: [
    { fr: 'Part des parcours qui aboutissent à une aide identifiée', ar: 'نسبة المسارات إلّي توصل لإعانة محدّدة' },
    { fr: 'Déplacements inutiles évités, déclarés par les agents', ar: 'التنقلات إلّي ما عادش لازمة، حسب الأعوان' },
    { fr: 'Taux de compréhension de la voix, par région', ar: 'نسبة فهم الصوت، حسب الجهة' },
    { fr: 'Zones où la demande dépasse l’offre de bureaux', ar: 'المناطق إلّي الطلب فيها أكثر من المكاتب' },
  ] as L[],
  planTitle: { fr: 'Plan de déploiement', ar: 'خطة التعميم' },
  plan: [
    { t: { fr: 'Pilote dans un gouvernorat', ar: 'تجربة في ولاية وحدة' }, d: { fr: 'Avec les bureaux d’action sociale et un centre de défense et d’intégration sociale ; tests avec de vrais bénéficiaires.', ar: 'مع مكاتب النهوض الاجتماعي ومركز دفاع وإدماج اجتماعي؛ تجارب مع مستفيدين حقيقيين.' } },
    { t: { fr: 'Code USSD avec un opérateur', ar: 'كود USSD مع مشغّل' }, d: { fr: 'Ouverture du code court et des SMS gratuits pour l’utilisateur.', ar: 'فتح الكود القصير والـSMS مجانًا للمستعمل.' } },
    { t: { fr: 'Généralisation nationale', ar: 'التعميم على كامل البلاد' }, d: { fr: 'Les 24 gouvernorats, données tenues à jour par les agents de terrain.', ar: 'الـ24 ولاية، والمعطيات يحيّنوها أعوان الميدان.' } },
  ],
  limitsTitle: { fr: 'Limites connues, et comment nous les traitons', ar: 'الحدود المعروفة، وكيفاش نعالجوها' },
  limits: [
    { fr: 'La carte dépend d’OpenStreetMap : il manque des bureaux, surtout à l’intérieur du pays. Un annuaire officiel du ministère la compléterait.', ar: 'الخريطة تعتمد على OpenStreetMap: فمّا مكاتب ناقصة خاصة في الداخل. دليل رسمي من الوزارة يكمّلها.' },
    { fr: 'La reconnaissance vocale doit encore être testée avec des voix réelles de toutes les régions.', ar: 'التعرّف على الصوت لازم يتجرّب بأصوات حقيقية من كل الجهات.' },
    { fr: 'Les montants et conditions changent : un circuit de validation avec le ministère est prévu.', ar: 'المبالغ والشروط تتبدّل: مبرمج مسار تثبيت مع الوزارة.' },
  ] as L[],
  cta: { fr: 'Essayer le guichet', ar: 'جرّب الشبّاك' },
}

export function ProjectPresentation() {
  const { tr } = useLang()

  return (
    <div className="flex flex-col">
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-primary">{tr(copy.kicker)}</p>
            <h1 className="font-heading text-3xl font-bold leading-tight text-balance text-foreground md:text-4xl">
              {tr(copy.title)}
            </h1>
            <Link
              href="/"
              className="w-fit rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-95"
            >
              {tr(copy.cta)}
            </Link>
          </div>
          <Image
            src="/images/hero.jpg"
            alt=""
            width={960}
            height={720}
            className="aspect-[4/3] w-full rounded-3xl object-cover"
            priority
          />
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-14 px-4 py-12">
        <section aria-labelledby="p-problem" className="flex flex-col gap-4">
          <h2 id="p-problem" className="font-heading text-2xl font-semibold text-foreground">
            {tr(copy.problemTitle)}
          </h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {copy.problems.map((p) => (
              <li key={p.fr} className="rounded-2xl border border-border p-4 leading-relaxed text-foreground">
                {tr(p)}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="p-solution" className="flex flex-col gap-4">
          <h2 id="p-solution" className="font-heading text-2xl font-semibold text-balance text-foreground">
            {tr(copy.solutionTitle)}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {copy.channels.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="flex h-full items-start gap-4 rounded-2xl bg-card p-4 transition-colors hover:bg-secondary"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold text-card-foreground">{tr(c.t)}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{tr(c.d)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="p-trust" className="flex flex-col gap-4">
          <h2 id="p-trust" className="font-heading text-2xl font-semibold text-foreground">
            {tr(copy.trustTitle)}
          </h2>
          <ul className="flex flex-col gap-3">
            {copy.trust.map((item) => (
              <li key={item.fr} className="flex items-start gap-3 leading-relaxed text-foreground">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                {tr(item)}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-10 md:grid-cols-2">
          <section aria-labelledby="p-impact" className="flex flex-col gap-4">
            <h2 id="p-impact" className="font-heading text-2xl font-semibold text-foreground">
              {tr(copy.impactTitle)}
            </h2>
            <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
              {copy.impact.map((m) => (
                <li key={m.fr} className="p-4 leading-relaxed text-foreground">
                  {tr(m)}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="p-plan" className="flex flex-col gap-4">
            <h2 id="p-plan" className="font-heading text-2xl font-semibold text-foreground">
              {tr(copy.planTitle)}
            </h2>
            <ol className="flex flex-col gap-4">
              {copy.plan.map((step, i) => (
                <li key={step.t.fr} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold text-foreground">{tr(step.t)}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{tr(step.d)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section aria-labelledby="p-limits" className="flex flex-col gap-4 rounded-3xl bg-muted p-6">
          <h2 id="p-limits" className="font-heading text-2xl font-semibold text-foreground">
            {tr(copy.limitsTitle)}
          </h2>
          <ul className="flex list-disc flex-col gap-2 ps-5 leading-relaxed text-foreground">
            {copy.limits.map((l) => (
              <li key={l.fr}>{tr(l)}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
