import type { Lang } from './i18n'
import { audiences, hotlines, matchServices, needs, type Audience, type Need, type Service } from './services-data'

// GSM-7 USSD screens hold 182 chars; Arabic needs UCS-2, which cuts the budget to about 80.
const LIMIT: Record<Lang, number> = { fr: 175, ar: 78 }
const PAGE_SIZE: Record<Lang, number> = { fr: 4, ar: 3 }
const NEXT = '9'
const BACK = '00'

const shortTitles: Record<string, { fr: string; ar: string }> = {
  amen: { fr: 'AMEN Social', ar: 'الأمان الاجتماعي' },
  amg1: { fr: 'Soins gratuits AMG1', ar: 'علاج مجاني' },
  amg2: { fr: 'Soins reduits AMG2', ar: 'علاج بتعريفة منخفضة' },
  handicap: { fr: 'Carte handicap', ar: 'بطاقة إعاقة' },
  rentree: { fr: 'Rentree scolaire', ar: 'العودة المدرسية' },
  'protection-enfance': { fr: 'Enfant en danger', ar: 'طفل في خطر' },
  cdis: { fr: 'Centres CDIS', ar: 'مراكز الإدماج' },
  agees: { fr: 'Personnes agees', ar: 'كبار السن' },
  logement: { fr: 'Logement social', ar: 'سكن اجتماعي' },
  violence: { fr: 'Femmes victimes', ar: 'نساء ضحايا عنف' },
  projet: { fr: 'Petit projet', ar: 'مورد رزق' },
  cnss: { fr: 'Alloc. familiales', ar: 'منح عائلية' },
}

const shortAudience: Record<Audience, { fr: string; ar: string }> = {
  family: { fr: 'Moi/ma famille', ar: 'عائلتي' },
  child: { fr: 'Un enfant', ar: 'طفل' },
  elderly: { fr: 'Personne agee', ar: 'مسن' },
  disability: { fr: 'Handicap', ar: 'إعاقة' },
  woman: { fr: 'Femme en difficulte', ar: 'امرأة' },
}

const shortNeed: Record<Need, { fr: string; ar: string }> = {
  income: { fr: 'Argent', ar: 'فلوس' },
  health: { fr: 'Soins', ar: 'علاج' },
  education: { fr: 'Ecole', ar: 'قراية' },
  housing: { fr: 'Logement', ar: 'سكن' },
  protection: { fr: 'Protection', ar: 'حماية' },
  work: { fr: 'Travail', ar: 'خدمة' },
}

const copy = {
  forWho: { fr: 'Pour qui ?', ar: 'لمن؟' },
  urgent: { fr: 'Urgences', ar: 'استعجالي' },
  need: { fr: 'Votre besoin ?', ar: 'شنوة تحتاج؟' },
  back: { fr: 'Retour', ar: 'رجوع' },
  more: { fr: 'Suite', ar: 'المزيد' },
  pick: { fr: 'Programmes :', ar: 'البرامج:' },
  none: {
    fr: "Aucun programme trouve. Allez a l'Unite locale de promotion sociale de votre delegation.",
    ar: 'ما لقينا حتى برنامج. توجه للوحدة المحلية للنهوض الاجتماعي.',
  },
  invalid: { fr: 'Choix invalide. Recomposez le code.', ar: 'اختيار غالط. عاود اطلب الرمز.' },
  where: { fr: 'Ou', ar: 'وين' },
  docs: { fr: 'Pieces', ar: 'وثائق' },
  call: { fr: 'Appelez', ar: 'اطلب' },
} satisfies Record<string, { fr: string; ar: string }>

export type UssdReply = {
  end: boolean
  message: string
  completedSearch?: { audience: Audience; needs: Need[]; resultsCount: number }
}

function fit(message: string, lang: Lang) {
  const limit = LIMIT[lang]
  return message.length <= limit ? message : `${message.slice(0, limit - 1).trimEnd()}…`
}

function menu(title: string, options: string[], lang: Lang, footer: string[] = []) {
  return fit([title, ...options.map((o, i) => `${i + 1} ${o}`), ...footer].join('\n'), lang)
}

const con = (message: string): UssdReply => ({ end: false, message })
const end = (message: string): UssdReply => ({ end: true, message })

function normalize(text: string) {
  const stack: string[] = []
  for (const step of text.split('*').filter(Boolean)) {
    if (step === BACK) stack.pop()
    else stack.push(step)
  }
  return stack
}

function pickIndex(step: string | undefined, max: number) {
  const n = Number(step)
  return Number.isInteger(n) && n >= 1 && n <= max ? n - 1 : -1
}

function detail(service: Service, lang: Lang, back: string) {
  const footer = service.documents.length ? [`1 ${copy.docs[lang]}`, back] : [back]
  const head = [shortTitles[service.id]?.[lang] ?? service.title[lang]]
  if (service.hotline) head.push(`${copy.call[lang]} ${service.hotline}`)
  const budget = LIMIT[lang] - [...head, ...footer].join('\n').length - 1
  const where = fit(`${copy.where[lang]}: ${service.where[lang]}`, lang)
  const whereLine = where.length <= budget ? where : `${where.slice(0, Math.max(0, budget - 1)).trimEnd()}…`
  return [...head, whereLine, ...footer].join('\n')
}

function documentsScreen(service: Service, lang: Lang) {
  return fit(`${copy.docs[lang]}:\n${service.documents.map((d) => `- ${d[lang]}`).join('\n')}`, lang)
}

export function runUssd(text: string): UssdReply {
  const steps = normalize(text)

  if (steps.length === 0) return con('Guichet social / الشباك الاجتماعي\n1 Francais\n2 العربية')

  const lang: Lang | null = steps[0] === '1' ? 'fr' : steps[0] === '2' ? 'ar' : null
  if (!lang) return end(copy.invalid.fr)

  const back = `${BACK} ${copy.back[lang]}`

  if (steps.length === 1) {
    return con(menu(copy.forWho[lang], audiences.map((a) => shortAudience[a.id][lang]), lang, [`0 ${copy.urgent[lang]}`]))
  }

  if (steps[1] === '0') {
    return end(fit(hotlines.map((h) => `${h.number} ${h.label[lang]}`).join('\n'), lang))
  }

  const audienceIdx = pickIndex(steps[1], audiences.length)
  if (audienceIdx < 0) return end(copy.invalid[lang])
  const audience = audiences[audienceIdx].id

  if (steps.length === 2) {
    return con(menu(copy.need[lang], needs.map((n) => shortNeed[n.id][lang]), lang, [back]))
  }

  const needIdx = pickIndex(steps[2], needs.length)
  if (needIdx < 0) return end(copy.invalid[lang])
  const need = needs[needIdx].id

  const results = matchServices(audience, [need])
  if (results.length === 0) {
    return { ...end(fit(copy.none[lang], lang)), completedSearch: { audience, needs: [need], resultsCount: 0 } }
  }

  let page = 0
  let cursor = 3
  while (steps[cursor] === NEXT && (page + 1) * PAGE_SIZE[lang] < results.length) {
    page++
    cursor++
  }

  const pageItems = results.slice(page * PAGE_SIZE[lang], (page + 1) * PAGE_SIZE[lang])

  if (cursor >= steps.length) {
    const hasMore = (page + 1) * PAGE_SIZE[lang] < results.length
    const reply = con(
      menu(
        copy.pick[lang],
        pageItems.map((s) => shortTitles[s.id]?.[lang] ?? s.title[lang]),
        lang,
        [...(hasMore ? [`${NEXT} ${copy.more[lang]}`] : []), back],
      ),
    )
    return page === 0 ? { ...reply, completedSearch: { audience, needs: [need], resultsCount: results.length } } : reply
  }

  const serviceIdx = pickIndex(steps[cursor], pageItems.length)
  if (serviceIdx < 0) return end(copy.invalid[lang])
  const service = pageItems[serviceIdx]

  if (cursor + 1 >= steps.length) return con(detail(service, lang, back))
  if (steps[cursor + 1] === '1' && service.documents.length) return end(documentsScreen(service, lang))
  return end(copy.invalid[lang])
}
