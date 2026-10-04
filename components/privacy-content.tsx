'use client'

import { useLang } from './lang-provider'

type Section = { title: { fr: string; ar: string }; body: { fr: string; ar: string }[] }

const sections: Section[] = [
  {
    title: { fr: 'Ce que nous ne collectons jamais', ar: 'شنوّة ما نجمعوهش أبداً' },
    body: [
      {
        fr: 'Aucun nom, numéro de téléphone, numéro de carte d’identité ni compte n’est demandé pour utiliser Dalil.',
        ar: 'ما نطلبوش لا اسم، لا رقم تليفون، لا رقم بطاقة تعريف ولا حساب باش تستعمل دليل.',
      },
      {
        fr: 'Votre position exacte n’est jamais enregistrée. Elle sert uniquement à chercher les bureaux proches, puis elle est oubliée.',
        ar: 'بلاصتك بالضبط ما تتسجّلش أبداً. تستعمل كان باش نلقاو المكاتب القريبة ومن بعد تتنسى.',
      },
      {
        fr: 'Votre voix n’est pas conservée. L’enregistrement est transcrit puis supprimé immédiatement.',
        ar: 'صوتك ما يتخزّنش. التسجيل يتكتب ومن بعد يتفسخ طول.',
      },
    ],
  },
  {
    title: { fr: 'Ce que nous enregistrons, de façon anonyme', ar: 'شنوّة نسجّلو، بلا ما نعرفوك' },
    body: [
      {
        fr: 'Pour chaque recherche : le type de besoin, le profil général (par exemple « famille »), le gouvernorat et le nombre de résultats. Ces données servent uniquement au tableau de bord public des besoins par région.',
        ar: 'على كل بحث: نوع الحاجة، الصنف العام (مثلاً «عايلة»)، الولاية وعدد النتائج. المعطيات هاذي تستعمل كان في لوحة القيادة العمومية متاع الحاجيات حسب الجهة.',
      },
      {
        fr: 'Les signalements du terrain (bureau fermé, horaires…) sont relus par un agent avant publication. N’y écrivez aucune information personnelle.',
        ar: 'البلاغات الميدانية (مكتب مسكّر، أوقات…) يراجعها عون قبل ما تتنشر. ما تكتبش فيها حتى معلومة شخصية.',
      },
      {
        fr: 'Pour éviter les abus, une empreinte chiffrée et irréversible de votre adresse réseau est gardée au plus 24 heures.',
        ar: 'باش نمنعو التجاوزات، نخبّيو بصمة مشفّرة ما ترجعش لعنوان الشبكة متاعك، مدّة أقصاها 24 ساعة.',
      },
    ],
  },
  {
    title: { fr: 'Cadre légal', ar: 'الإطار القانوني' },
    body: [
      {
        fr: 'Dalil suit les principes de la loi organique n° 2004-63 du 27 juillet 2004 relative à la protection des données à caractère personnel : minimisation, finalité précise et durée de conservation limitée.',
        ar: 'دليل يتّبع مبادئ القانون الأساسي عدد 63 لسنة 2004 المؤرّخ في 27 جويلية 2004 المتعلّق بحماية المعطيات الشخصية: أقل ما يمكن من المعطيات، هدف واضح ومدّة حفظ محدودة.',
      },
      {
        fr: 'Pour toute question sur vos données, vous pouvez saisir l’Instance nationale de protection des données personnelles (INPDP).',
        ar: 'لأي سؤال على معطياتك، تنجّم تتّصل بالهيئة الوطنية لحماية المعطيات الشخصية.',
      },
    ],
  },
]

export function PrivacyContent() {
  const { lang, tr } = useLang()
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="font-serif text-3xl font-bold text-balance text-foreground md:text-4xl">
          {lang === 'ar' ? 'حماية معطياتك' : 'Protection de vos données'}
        </h1>
        <p className="leading-relaxed text-pretty text-muted-foreground">
          {lang === 'ar'
            ? 'الناس اللي يستعملو دليل كثير منهم في وضعية هشّة. لذا نجمعو أقل ما يمكن، وما نجمعو حتى حاجة تنجّم تعرّف بيك.'
            : 'Beaucoup de personnes qui utilisent Dalil sont en situation de vulnérabilité. Nous collectons donc le strict minimum, et rien qui permette de vous identifier.'}
        </p>
      </header>
      {sections.map((s) => (
        <section key={s.title.fr} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">{tr(s.title)}</h2>
          <ul className="flex list-disc flex-col gap-2 ps-5 leading-relaxed text-foreground">
            {s.body.map((b) => (
              <li key={b.fr}>{tr(b)}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
