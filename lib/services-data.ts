import type { Localized } from './i18n'

export type Audience = 'family' | 'child' | 'elderly' | 'disability' | 'woman'
export type Need = 'income' | 'health' | 'education' | 'housing' | 'protection' | 'work'

export const audiences: { id: Audience; label: Localized; hint: Localized }[] = [
  { id: 'family', label: { fr: 'Moi ou ma famille', ar: 'أنا أو عائلتي' }, hint: { fr: 'Revenus faibles, difficultés', ar: 'دخل ضعيف، صعوبات' } },
  { id: 'child', label: { fr: 'Un enfant', ar: 'طفل' }, hint: { fr: 'Scolarité, danger, suivi', ar: 'دراسة، خطر، متابعة' } },
  { id: 'elderly', label: { fr: 'Une personne âgée', ar: 'مسنّ' }, hint: { fr: 'Isolement, soins, revenus', ar: 'عزلة، علاج، دخل' } },
  { id: 'disability', label: { fr: 'Une personne handicapée', ar: 'شخص ذو إعاقة' }, hint: { fr: 'Carte, aides, insertion', ar: 'بطاقة، منح، إدماج' } },
  { id: 'woman', label: { fr: 'Une femme en difficulté', ar: 'امرأة في وضعية صعبة' }, hint: { fr: 'Violence, isolement', ar: 'عنف، عزلة' } },
]

export const needs: { id: Need; label: Localized }[] = [
  { id: 'income', label: { fr: 'Argent / revenu', ar: 'مال / دخل' } },
  { id: 'health', label: { fr: 'Soins médicaux', ar: 'العلاج' } },
  { id: 'education', label: { fr: 'École et études', ar: 'الدراسة' } },
  { id: 'housing', label: { fr: 'Logement', ar: 'السكن' } },
  { id: 'protection', label: { fr: 'Protection / danger', ar: 'حماية / خطر' } },
  { id: 'work', label: { fr: 'Travail / projet', ar: 'شغل / مشروع' } },
]

export const governorates: Localized[] = [
  { fr: 'Ariana', ar: 'أريانة' }, { fr: 'Béja', ar: 'باجة' }, { fr: 'Ben Arous', ar: 'بن عروس' },
  { fr: 'Bizerte', ar: 'بنزرت' }, { fr: 'Gabès', ar: 'قابس' }, { fr: 'Gafsa', ar: 'قفصة' },
  { fr: 'Jendouba', ar: 'جندوبة' }, { fr: 'Kairouan', ar: 'القيروان' }, { fr: 'Kasserine', ar: 'القصرين' },
  { fr: 'Kébili', ar: 'قبلي' }, { fr: 'Le Kef', ar: 'الكاف' }, { fr: 'Mahdia', ar: 'المهدية' },
  { fr: 'La Manouba', ar: 'منوبة' }, { fr: 'Médenine', ar: 'مدنين' }, { fr: 'Monastir', ar: 'المنستير' },
  { fr: 'Nabeul', ar: 'نابل' }, { fr: 'Sfax', ar: 'صفاقس' }, { fr: 'Sidi Bouzid', ar: 'سيدي بوزيد' },
  { fr: 'Siliana', ar: 'سليانة' }, { fr: 'Sousse', ar: 'سوسة' }, { fr: 'Tataouine', ar: 'تطاوين' },
  { fr: 'Tozeur', ar: 'توزر' }, { fr: 'Tunis', ar: 'تونس' }, { fr: 'Zaghouan', ar: 'زغوان' },
]

export type Service = {
  id: string
  title: Localized
  summary: Localized
  audiences: Audience[]
  needs: Need[]
  urgent?: boolean
  hotline?: string
  documents: Localized[]
  where: Localized
  steps: Localized[]
}

const cin = { fr: 'Carte d’identité nationale (CIN)', ar: 'بطاقة التعريف الوطنية' }
const residence = { fr: 'Certificat de résidence', ar: 'شهادة إقامة' }
const income = { fr: 'Justificatif de revenu ou de non-emploi', ar: 'ما يثبت الدخل أو عدم الشغل' }
const ulps = {
  fr: 'Unité locale de promotion sociale de votre délégation',
  ar: 'الوحدة المحلية للنهوض الاجتماعي بمعتمديتك',
}

export const services: Service[] = [
  {
    id: 'amen',
    title: { fr: 'Programme AMEN Social – aide aux familles', ar: 'برنامج الأمان الاجتماعي – منحة العائلات' },
    summary: {
      fr: 'Programme créé par la loi organique n° 2019-10 : aide financière mensuelle et accès aux soins publics (AMG) pour les familles pauvres ou à revenu limité, non affiliées à une caisse sociale.',
      ar: 'برنامج أُحدث بالقانون الأساسي عدد 10 لسنة 2019: منحة مالية شهرية ونفاذ إلى العلاج العمومي للعائلات الفقيرة أو محدودة الدخل غير المنخرطة بصندوق اجتماعي.',
    },
    audiences: ['family', 'elderly', 'disability', 'woman'],
    needs: ['income', 'health'],
    documents: [
      { fr: 'Copies des CIN des membres de plus de 18 ans', ar: 'نسخ بطاقات تعريف الأفراد فوق 18 سنة' },
      { fr: 'Extraits de naissance des membres de la famille', ar: 'مضامين ولادة أفراد العائلة' },
      { fr: 'Certificats de scolarité ou d’études des enfants', ar: 'شهادات الحضور أو الترسيم للأبناء' },
      { fr: 'Dernières factures d’eau et d’électricité', ar: 'آخر فواتير الماء والكهرباء' },
      { fr: 'Justificatifs de situation (handicap, divorce, décès…)', ar: 'ما يثبت الوضعية (إعاقة، طلاق، وفاة…)' },
    ],
    where: {
      fr: 'En ligne sur amen.social.tn, ou à l’Unité locale de promotion sociale de votre délégation',
      ar: 'عن بعد عبر amen.social.tn أو لدى الوحدة المحلية للنهوض الاجتماعي بمعتمديتك',
    },
    steps: [
      { fr: 'S’inscrire en ligne ou déposer le dossier à l’Unité locale', ar: 'التسجيل عن بعد أو إيداع الملف بالوحدة المحلية' },
      { fr: 'Enquête sociale et calcul d’un score selon la situation du ménage', ar: 'بحث اجتماعي واحتساب مجموع نقاط حسب وضعية الأسرة' },
      { fr: 'Décision d’admission et versement', ar: 'قرار الانتفاع وصرف المنحة' },
    ],
  },
  {
    id: 'amg1',
    title: { fr: 'Carte de soins gratuits (AMG 1)', ar: 'بطاقة العلاج المجاني' },
    summary: {
      fr: 'Gratuité totale des soins et de l’hospitalisation dans les structures de santé publiques pour les familles pauvres inscrites à AMEN Social.',
      ar: 'مجانية العلاج والإقامة بالهياكل الصحية العمومية للعائلات الفقيرة المنتفعة ببرنامج الأمان الاجتماعي.',
    },
    audiences: ['family', 'elderly', 'disability', 'woman', 'child'],
    needs: ['health'],
    documents: [cin, residence, income, { fr: 'Deux photos d’identité', ar: 'صورتان شمسيتان' }],
    where: ulps,
    steps: [
      { fr: 'Demande à l’Unité locale', ar: 'تقديم مطلب للوحدة المحلية' },
      { fr: 'Enquête sociale', ar: 'بحث اجتماعي' },
      { fr: 'Retrait de la carte, à présenter à chaque consultation', ar: 'سحب البطاقة وتقديمها عند كل عيادة' },
    ],
  },
  {
    id: 'amg2',
    title: { fr: 'Carte de soins à tarif réduit (AMG 2)', ar: 'بطاقة العلاج بالتعريفة المنخفضة' },
    summary: {
      fr: 'Accès aux structures de santé publiques à tarif réduit pour les familles à revenu limité, dans le cadre du programme AMEN Social.',
      ar: 'نفاذ إلى الهياكل الصحية العمومية بتعريفة منخفضة للعائلات محدودة الدخل، في إطار برنامج الأمان الاجتماعي.',
    },
    audiences: ['family', 'elderly', 'woman'],
    needs: ['health'],
    documents: [cin, residence, income],
    where: ulps,
    steps: [
      { fr: 'Demande via AMEN Social (en ligne ou à l’Unité locale)', ar: 'تقديم مطلب عبر الأمان الاجتماعي (عن بعد أو بالوحدة المحلية)' },
      { fr: 'Étude de la situation', ar: 'دراسة الوضعية' },
      { fr: 'Cotisation annuelle de 10 dinars (timbre) + ticket modérateur réduit par consultation', ar: 'معلوم سنوي بـ10 دنانير (طابع جبائي) + معلوم تعديلي منخفض عند كل عيادة' },
    ],
  },
  {
    id: 'handicap',
    title: { fr: 'Carte de personne handicapée', ar: 'بطاقة إعاقة' },
    summary: {
      fr: 'Donne accès à la gratuité ou réduction des transports, aux soins, à des aides et à l’insertion professionnelle.',
      ar: 'تمكن من مجانية أو تخفيض النقل، والعلاج، والمنح، والإدماج المهني.',
    },
    audiences: ['disability', 'child', 'elderly'],
    needs: ['health', 'income', 'work'],
    documents: [
      cin,
      { fr: 'Certificat médical détaillé', ar: 'شهادة طبية مفصلة' },
      { fr: 'Deux photos d’identité', ar: 'صورتان شمسيتان' },
      { fr: 'Extrait de naissance (pour un enfant)', ar: 'مضمون ولادة (بالنسبة للطفل)' },
    ],
    where: {
      fr: 'Plateforme numérique du ministère des Affaires sociales, ou Direction régionale des affaires sociales (commission régionale des personnes handicapées)',
      ar: 'المنصة الرقمية لوزارة الشؤون الاجتماعية، أو الإدارة الجهوية للشؤون الاجتماعية (اللجنة الجهوية لحاملي الإعاقة)',
    },
    steps: [
      { fr: 'Déposer la demande en ligne (documents téléversés) ou au bureau régional', ar: 'تقديم المطلب عن بعد (تحميل الوثائق) أو بالإدارة الجهوية' },
      { fr: 'Examen par la commission régionale des personnes handicapées', ar: 'دراسة الملف من قبل اللجنة الجهوية' },
      { fr: 'Suivi du dossier dans l’espace citoyen, puis remise de la carte', ar: 'متابعة الملف عبر فضاء المواطن ثم تسلم البطاقة' },
      { fr: 'Renouvellement : demande à distance avec un certificat médical', ar: 'التجديد: مطلب عن بعد مع شهادة طبية' },
    ],
  },
  {
    id: 'rentree',
    title: { fr: 'Aide à la rentrée scolaire', ar: 'منحة العودة المدرسية' },
    summary: {
      fr: 'Transfert monétaire annuel par enfant scolarisé et par étudiant, réservé aux familles inscrites à AMEN Social. Le montant est fixé chaque année par le ministère.',
      ar: 'تحويل مالي سنوي عن كل تلميذ وطالب، خاص بالعائلات المنتفعة ببرنامج الأمان الاجتماعي. يُحدَّد المبلغ سنويا من قبل الوزارة.',
    },
    audiences: ['child', 'family'],
    needs: ['education', 'income'],
    documents: [{ fr: 'Inscription préalable à AMEN Social', ar: 'التسجيل المسبق ببرنامج الأمان الاجتماعي' }, { fr: 'Certificat de scolarité ou d’inscription à jour', ar: 'شهادة حضور أو ترسيم محيّنة' }],
    where: ulps,
    steps: [
      { fr: 'Être inscrit à AMEN Social et tenir à jour la scolarité des enfants', ar: 'التسجيل بالأمان الاجتماعي وتحيين وضعية تمدرس الأبناء' },
      { fr: 'Versement en septembre, parfois en deux tranches', ar: 'الصرف في سبتمبر، أحيانا على قسطين' },
    ],
  },
  {
    id: 'protection-enfance',
    title: { fr: 'Signaler un enfant en danger', ar: 'الإشعار بطفل في خطر' },
    summary: {
      fr: 'Maltraitance, abandon, exploitation, vie dans la rue : l’article 31 du Code de la protection de l’enfant oblige toute personne à signaler au délégué à la protection de l’enfance. L’anonymat est garanti. Le 1809 (24h/24) écoute et oriente, mais ne verse aucune aide financière.',
      ar: 'سوء معاملة، إهمال، استغلال، تشرد: يفرض الفصل 31 من مجلة حماية الطفل على كل شخص إشعار مندوب حماية الطفولة، مع ضمان عدم الكشف عن هويته. الرقم 1809 (24/24) للإصغاء والتوجيه ولا يقدم أي مساعدة مالية.',
    },
    audiences: ['child'],
    needs: ['protection'],
    urgent: true,
    hotline: '1809',
    documents: [{ fr: 'Aucun papier nécessaire pour signaler', ar: 'لا حاجة لأي وثيقة للإشعار' }],
    where: { fr: 'Délégué à la protection de l’enfance du gouvernorat, ou le 1809', ar: 'مندوب حماية الطفولة بالولاية أو الرقم 1809' },
    steps: [
      { fr: 'Appeler le 1809 ou se rendre chez le délégué', ar: 'الاتصال بـ1809 أو التوجه إلى المندوب' },
      { fr: 'Le délégué évalue la situation', ar: 'يقيّم المندوب الوضعية' },
      { fr: 'Mesures de protection et de suivi de l’enfant', ar: 'اتخاذ تدابير حماية الطفل ومتابعته' },
    ],
  },
  {
    id: 'cdis',
    title: { fr: 'Centres de défense et d’intégration sociale (CDIS)', ar: 'مراكز الدفاع والإدماج الاجتماعي' },
    summary: {
      fr: 'Établissements publics du ministère des Affaires sociales : dépistage précoce, encadrement éducatif et suivi des mineurs en difficulté, prévention de la délinquance, et accompagnement des femmes et jeunes filles vulnérables.',
      ar: 'مؤسسات عمومية تابعة لوزارة الشؤون الاجتماعية: الكشف المبكر، الإحاطة التربوية ومتابعة القصّر في وضعيات صعبة، الوقاية من الانحراف، ومرافقة النساء والفتيات في وضعية هشاشة.',
    },
    audiences: ['child', 'woman'],
    needs: ['education', 'protection'],
    documents: [{ fr: 'Extrait de naissance de l’enfant', ar: 'مضمون ولادة الطفل' }, cin],
    where: { fr: 'CDIS le plus proche (orientation par l’Unité locale)', ar: 'أقرب مركز دفاع وإدماج اجتماعي (بتوجيه من الوحدة المحلية)' },
    steps: [
      { fr: 'Rencontre avec l’équipe du centre', ar: 'لقاء مع فريق المركز' },
      { fr: 'Plan d’accompagnement personnalisé', ar: 'خطة مرافقة فردية' },
      { fr: 'Suivi régulier avec la famille', ar: 'متابعة منتظمة مع العائلة' },
    ],
  },
  {
    id: 'agees',
    title: { fr: 'Soutien aux personnes âgées', ar: 'رعاية كبار السن' },
    summary: {
      fr: 'Aide à domicile, équipes mobiles de soins et accueil en établissement pour les personnes âgées isolées ou sans soutien familial.',
      ar: 'مساعدة في المنزل، فرق متنقلة للعلاج، وإيواء في مؤسسات لكبار السن المعزولين أو فاقدي السند.',
    },
    audiences: ['elderly'],
    needs: ['health', 'housing', 'income'],
    documents: [cin, residence, { fr: 'Certificat médical', ar: 'شهادة طبية' }],
    where: ulps,
    steps: [
      { fr: 'Signaler la situation à l’Unité locale', ar: 'الإعلام بالوضعية لدى الوحدة المحلية' },
      { fr: 'Visite d’évaluation', ar: 'زيارة تقييم' },
      { fr: 'Mise en place de l’aide adaptée', ar: 'توفير المساعدة الملائمة' },
    ],
  },
  {
    id: 'logement',
    title: { fr: 'Logement social', ar: 'السكن الاجتماعي' },
    summary: {
      fr: 'Programme du ministère de l’Équipement et de l’Habitat : logements sociaux ou lots aménagés pour les familles à revenu limité qui ne possèdent pas de logement.',
      ar: 'برنامج وزارة التجهيز والإسكان: مساكن اجتماعية أو مقاسم مهيأة للعائلات محدودة الدخل التي لا تملك مسكنا.',
    },
    audiences: ['family', 'elderly', 'disability'],
    needs: ['housing'],
    documents: [cin, residence, income, { fr: 'Attestation de non-propriété', ar: 'شهادة عدم ملكية' }],
    where: {
      fr: 'Direction régionale de l’Équipement de votre gouvernorat (l’Unité locale peut vous accompagner)',
      ar: 'الإدارة الجهوية للتجهيز بولايتك (يمكن للوحدة المحلية مرافقتك)',
    },
    steps: [
      { fr: 'Se renseigner sur les appels à candidatures en cours', ar: 'الاستعلام عن طلبات الترشح المفتوحة' },
      { fr: 'Déposer le dossier', ar: 'إيداع الملف' },
      { fr: 'Étude par la commission et attribution', ar: 'الدراسة من قبل اللجنة والإسناد' },
    ],
  },
  {
    id: 'violence',
    title: { fr: 'Aide aux femmes victimes de violence', ar: 'مساعدة النساء ضحايا العنف' },
    summary: {
      fr: 'Écoute, orientation juridique et psychologique, et hébergement d’urgence. Appel gratuit et confidentiel.',
      ar: 'إصغاء، توجيه قانوني ونفسي، وإيواء عاجل. مكالمة مجانية وسرية.',
    },
    audiences: ['woman'],
    needs: ['protection', 'housing'],
    urgent: true,
    hotline: '1899',
    documents: [{ fr: 'Aucun papier nécessaire pour appeler', ar: 'لا حاجة لأي وثيقة للاتصال' }],
    where: { fr: 'Numéro vert 1899, ou délégation régionale de la femme', ar: 'الرقم الأخضر 1899 أو المندوبية الجهوية للمرأة' },
    steps: [
      { fr: 'Appeler le 1899, 24h/24', ar: 'الاتصال بـ1899 على مدار الساعة' },
      { fr: 'Écoute et évaluation du danger', ar: 'الإصغاء وتقييم الخطر' },
      { fr: 'Orientation vers un centre ou une aide juridique', ar: 'التوجيه إلى مركز أو مساعدة قانونية' },
    ],
  },
  {
    id: 'projet',
    title: { fr: 'Aide à un petit projet (source de revenu)', ar: 'منحة بعث مورد رزق' },
    summary: {
      fr: 'Programme d’insertion économique des familles en situation particulière (ministère de la Famille, de la Femme, de l’Enfance et des Personnes âgées) : subvention conditionnelle pour un petit projet. Réservé aux familles inscrites à AMEN Social ou dont la vulnérabilité est établie par enquête sociale.',
      ar: 'برنامج الإدماج الاقتصادي للأسر ذات الوضعيات الخاصة (وزارة الأسرة والمرأة والطفولة وكبار السن): هبة مشروطة لبعث مشروع صغير. للعائلات المسجلة بالأمان الاجتماعي أو المثبتة هشاشتها ببحث اجتماعي.',
    },
    audiences: ['family', 'disability', 'woman'],
    needs: ['work', 'income'],
    documents: [cin, residence, { fr: 'Description simple du projet', ar: 'وصف مبسط للمشروع' }],
    where: {
      fr: 'Délégation régionale de la Femme et de la Famille de votre gouvernorat',
      ar: 'المندوبية الجهوية لشؤون المرأة والأسرة بولايتك',
    },
    steps: [
      { fr: 'Présenter l’idée de projet', ar: 'تقديم فكرة المشروع' },
      { fr: 'Étude de faisabilité avec le travailleur social', ar: 'دراسة الجدوى مع الأخصائي الاجتماعي' },
      { fr: 'Financement et suivi', ar: 'التمويل والمتابعة' },
    ],
  },
  {
    id: 'cnss',
    title: { fr: 'Allocations familiales (CNSS)', ar: 'المنح العائلية (الصندوق الوطني للضمان الاجتماعي)' },
    summary: {
      fr: 'Pour les salariés déclarés à la CNSS : allocations trimestrielles pour les trois premiers enfants à charge (nés, adoptés ou sous garde).',
      ar: 'للأجراء المصرح بهم لدى الصندوق الوطني للضمان الاجتماعي: منح ثلاثية عن الأبناء الثلاثة الأوائل في الكفالة.',
    },
    audiences: ['family', 'child'],
    needs: ['income'],
    documents: [cin, { fr: 'Numéro d’affiliation CNSS', ar: 'رقم الانخراط بالضمان الاجتماعي' }, { fr: 'Extraits de naissance des enfants', ar: 'مضامين ولادة الأبناء' }],
    where: { fr: 'Bureau régional de la CNSS (cnss.tn)', ar: 'المكتب الجهوي للضمان الاجتماعي (cnss.tn)' },
    steps: [
      { fr: 'Déposer le dossier au bureau CNSS', ar: 'إيداع الملف بمكتب الضمان الاجتماعي' },
      { fr: 'Vérification des droits', ar: 'التثبت من الحقوق' },
      { fr: 'Versement trimestriel', ar: 'صرف المنحة كل ثلاثية' },
    ],
  },
]

export const hotlines: { number: string; label: Localized }[] = [
  { number: '1809', label: { fr: 'Enfant en danger', ar: 'طفل في خطر' } },
  { number: '1899', label: { fr: 'Violence contre les femmes', ar: 'العنف ضد المرأة' } },
  { number: '190', label: { fr: 'SAMU – urgence médicale', ar: 'الإسعاف الطبي' } },
  { number: '197', label: { fr: 'Police', ar: 'الشرطة' } },
  { number: '198', label: { fr: 'Protection civile', ar: 'الحماية المدنية' } },
]

export function matchServices(audience: Audience | null, selectedNeeds: Need[]) {
  return services
    .map((s) => {
      const audienceMatch = audience ? s.audiences.includes(audience) : true
      const needScore = selectedNeeds.filter((n) => s.needs.includes(n)).length
      return { s, score: audienceMatch ? needScore * 2 + (s.urgent ? 1 : 0) : 0 }
    })
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.s)
}
