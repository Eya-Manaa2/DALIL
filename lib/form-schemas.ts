import type { Localized } from './i18n'

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file' | 'textarea'

export interface FormField {
  id: string
  type: FieldType
  label: Localized
  placeholder?: Localized
  required: boolean
  validation?: RegExp | ((value: any) => boolean)
  min?: number
  max?: number
  options?: { value: string; label: Localized }[]
  accept?: string // Pour file input
}

export interface FormSchema {
  id: string
  title: Localized
  description: Localized
  fields: FormField[]
}

export const formSchemas: Record<string, FormSchema> = {
  amen: {
    id: 'amen',
    title: { fr: 'Demande AMEN Social', ar: 'طلب الأمان الاجتماعي' },
    description: {
      fr: 'Formulaire de demande pour le programme AMEN Social - aide aux familles',
      ar: 'نموذج طلب لبرنامج الأمان الاجتماعي - منحة العائلات',
    },
    fields: [
      {
        id: 'nom',
        type: 'text',
        label: { fr: 'Nom complet', ar: 'الاسم الكامل' },
        placeholder: { fr: 'Entrez votre nom complet', ar: 'أدخل اسمك الكامل' },
        required: true,
      },
      {
        id: 'cin',
        type: 'text',
        label: { fr: 'Numéro CIN', ar: 'رقم بطاقة التعريف' },
        placeholder: { fr: 'Ex: 12345678', ar: 'مثال: 12345678' },
        required: true,
        validation: /^[0-9]{8}$/,
      },
      {
        id: 'date_naissance',
        type: 'date',
        label: { fr: 'Date de naissance', ar: 'تاريخ الميلاد' },
        required: true,
      },
      {
        id: 'sexe',
        type: 'select',
        label: { fr: 'Sexe', ar: 'الجنس' },
        required: true,
        options: [
          { value: 'M', label: { fr: 'Masculin', ar: 'ذكر' } },
          { value: 'F', label: { fr: 'Féminin', ar: 'أنثى' } },
        ],
      },
      {
        id: 'enfants',
        type: 'number',
        label: { fr: 'Nombre d\'enfants à charge', ar: 'عدد الأبناء في الكفالة' },
        placeholder: { fr: '0', ar: '0' },
        required: true,
        min: 0,
        max: 20,
      },
      {
        id: 'enfants_details',
        type: 'textarea',
        label: { fr: 'Détails des enfants (âges, scolarité)', ar: 'تفاصيل الأبناء (الأعمار، الدراسة)' },
        placeholder: { fr: 'Ex: Enfant 1: 8 ans, primaire', ar: 'مثال: الابن 1: 8 سنوات، ابتدائي' },
        required: false,
      },
      {
        id: 'gouvernorat',
        type: 'select',
        label: { fr: 'Gouvernorat de résidence', ar: 'ولاية الإقامة' },
        required: true,
        options: [
          { value: 'Tunis', label: { fr: 'Tunis', ar: 'تونس' } },
          { value: 'Ariana', label: { fr: 'Ariana', ar: 'أريانة' } },
          { value: 'Ben Arous', label: { fr: 'Ben Arous', ar: 'بن عروس' } },
          { value: 'Manouba', label: { fr: 'Manouba', ar: 'منوبة' } },
          { value: 'Nabeul', label: { fr: 'Nabeul', ar: 'نابل' } },
          { value: 'Zaghouan', label: { fr: 'Zaghouan', ar: 'زغوان' } },
          { value: 'Bizerte', label: { fr: 'Bizerte', ar: 'بنزرت' } },
          { value: 'Béja', label: { fr: 'Béja', ar: 'باجة' } },
          { value: 'Jendouba', label: { fr: 'Jendouba', ar: 'جندوبة' } },
          { value: 'Le Kef', label: { fr: 'Le Kef', ar: 'الكاف' } },
          { value: 'Siliana', label: { fr: 'Siliana', ar: 'سليانة' } },
          { value: 'Sousse', label: { fr: 'Sousse', ar: 'سوسة' } },
          { value: 'Monastir', label: { fr: 'Monastir', ar: 'المنستير' } },
          { value: 'Mahdia', label: { fr: 'Mahdia', ar: 'المهدية' } },
          { value: 'Kairouan', label: { fr: 'Kairouan', ar: 'القيروان' } },
          { value: 'Kasserine', label: { fr: 'Kasserine', ar: 'القصرين' } },
          { value: 'Sidi Bouzid', label: { fr: 'Sidi Bouzid', ar: 'سيدي بوزيد' } },
          { value: 'Sfax', label: { fr: 'Sfax', ar: 'صفاقس' } },
          { value: 'Gabès', label: { fr: 'Gabès', ar: 'قابس' } },
          { value: 'Medenine', label: { fr: 'Medenine', ar: 'مدنين' } },
          { value: 'Tataouine', label: { fr: 'Tataouine', ar: 'تطاوين' } },
          { value: 'Gafsa', label: { fr: 'Gafsa', ar: 'قفصة' } },
          { value: 'Tozeur', label: { fr: 'Tozeur', ar: 'توزر' } },
          { value: 'Kébili', label: { fr: 'Kébili', ar: 'قبلي' } },
        ],
      },
      {
        id: 'delegation',
        type: 'text',
        label: { fr: 'Délégation', ar: 'المعتمدية' },
        placeholder: { fr: 'Entrez votre délégation', ar: 'أدخل معتمديتك' },
        required: true,
      },
      {
        id: 'telephone',
        type: 'text',
        label: { fr: 'Numéro de téléphone', ar: 'رقم الهاتف' },
        placeholder: { fr: 'Ex: 71 123 456', ar: 'مثال: 71 123 456' },
        required: true,
        validation: /^[0-9\s]{8,15}$/,
      },
      {
        id: 'email',
        type: 'text',
        label: { fr: 'Email (optionnel)', ar: 'البريد الإلكتروني (اختياري)' },
        placeholder: { fr: 'exemple@email.com', ar: 'exemple@email.com' },
        required: false,
        validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      {
        id: 'situation_logement',
        type: 'select',
        label: { fr: 'Situation de logement', ar: 'وضعية السكن' },
        required: true,
        options: [
          { value: 'owner', label: { fr: 'Propriétaire', ar: 'مالك' } },
          { value: 'rent', label: { fr: 'Locataire', ar: 'مستأجر' } },
          { value: 'family', label: { fr: 'Chez la famille', ar: 'عند العائلة' } },
          { value: 'other', label: { fr: 'Autre', ar: 'أخرى' } },
        ],
      },
      {
        id: 'revenu',
        type: 'select',
        label: { fr: 'Situation de revenu', ar: 'وضعية الدخل' },
        required: true,
        options: [
          { value: 'none', label: { fr: 'Aucun revenu', ar: 'لا دخل' } },
          { value: 'low', label: { fr: 'Revenu faible', ar: 'دخل ضعيف' } },
          { value: 'medium', label: { fr: 'Revenu moyen', ar: 'دخل متوسط' } },
          { value: 'other', label: { fr: 'Autre', ar: 'أخرى' } },
        ],
      },
      {
        id: 'affiliation_cnss',
        type: 'select',
        label: { fr: 'Affiliation CNSS', ar: 'الانخراط في الضمان الاجتماعي' },
        required: true,
        options: [
          { value: 'yes', label: { fr: 'Oui', ar: 'نعم' } },
          { value: 'no', label: { fr: 'Non', ar: 'لا' } },
        ],
      },
      {
        id: 'handicap',
        type: 'select',
        label: { fr: 'Personne handicapée dans le foyer?', ar: 'شخص ذو إعاقة في الأسرة؟' },
        required: true,
        options: [
          { value: 'yes', label: { fr: 'Oui', ar: 'نعم' } },
          { value: 'no', label: { fr: 'Non', ar: 'لا' } },
        ],
      },
      {
        id: 'handicap_details',
        type: 'textarea',
        label: { fr: 'Détails du handicap (si oui)', ar: 'تفاصيل الإعاقة (إذا كانت الإجابة نعم)' },
        placeholder: { fr: 'Décrivez la situation', ar: 'صف الوضعية' },
        required: false,
      },
    ],
  },
  handicap: {
    id: 'handicap',
    title: { fr: 'Demande de carte handicap', ar: 'طلب بطاقة الإعاقة' },
    description: {
      fr: 'Formulaire de demande pour la carte de personne handicapée',
      ar: 'نموذج طلب لبطاقة الشخص ذو الإعاقة',
    },
    fields: [
      {
        id: 'nom',
        type: 'text',
        label: { fr: 'Nom complet', ar: 'الاسم الكامل' },
        required: true,
      },
      {
        id: 'cin',
        type: 'text',
        label: { fr: 'Numéro CIN', ar: 'رقم بطاقة التعريف' },
        required: true,
        validation: /^[0-9]{8}$/,
      },
      {
        id: 'date_naissance',
        type: 'date',
        label: { fr: 'Date de naissance', ar: 'تاريخ الميلاد' },
        required: true,
      },
      {
        id: 'sexe',
        type: 'select',
        label: { fr: 'Sexe', ar: 'الجنس' },
        required: true,
        options: [
          { value: 'M', label: { fr: 'Masculin', ar: 'ذكر' } },
          { value: 'F', label: { fr: 'Féminin', ar: 'أنثى' } },
        ],
      },
      {
        id: 'type_handicap',
        type: 'select',
        label: { fr: 'Type de handicap', ar: 'نوع الإعاقة' },
        required: true,
        options: [
          { value: 'moteur', label: { fr: 'Moteur', ar: 'حركي' } },
          { value: 'sensoriel', label: { fr: 'Sensoriel', ar: 'حسي' } },
          { value: 'mental', label: { fr: 'Mental', ar: 'ذهني' } },
          { value: 'multiple', label: { fr: 'Multiple', ar: 'متعدد' } },
          { value: 'other', label: { fr: 'Autre', ar: 'أخرى' } },
        ],
      },
      {
        id: 'gouvernorat',
        type: 'select',
        label: { fr: 'Gouvernorat', ar: 'الولاية' },
        required: true,
        options: [
          { value: 'Tunis', label: { fr: 'Tunis', ar: 'تونس' } },
          { value: 'Ariana', label: { fr: 'Ariana', ar: 'أريانة' } },
          { value: 'Ben Arous', label: { fr: 'Ben Arous', ar: 'بن عروس' } },
          { value: 'Manouba', label: { fr: 'Manouba', ar: 'منوبة' } },
          { value: 'Nabeul', label: { fr: 'Nabeul', ar: 'نابل' } },
          { value: 'Sfax', label: { fr: 'Sfax', ar: 'صفاقس' } },
          { value: 'Sousse', label: { fr: 'Sousse', ar: 'سوسة' } },
          { value: 'Gabès', label: { fr: 'Gabès', ar: 'قابس' } },
        ],
      },
      {
        id: 'telephone',
        type: 'text',
        label: { fr: 'Numéro de téléphone', ar: 'رقم الهاتف' },
        required: true,
        validation: /^[0-9\s]{8,15}$/,
      },
    ],
  },
}
