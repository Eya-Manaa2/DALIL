'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { formSchemas, type FormField, type FormSchema } from '@/lib/form-schemas'
import { useLang } from './lang-provider'
import { cn } from '@/lib/utils'
import { FileUpload } from './file-upload'

interface FormWizardProps {
  serviceId: string
  onSave: (data: any) => void
  trackingCode?: string
  initialUploadedFiles?: Record<string, File[]>
}

export function FormWizard({ serviceId, onSave, trackingCode, initialUploadedFiles }: FormWizardProps) {
  const { t, tr, lang } = useLang()
  const schema = formSchemas[serviceId]
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(initialUploadedFiles || {})

  if (!schema) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
        <p className="text-foreground">
          {lang === 'fr' ? 'Formulaire non disponible' : 'النموذج غير متوفر'}
        </p>
      </div>
    )
  }

  const fieldsPerStep = 4
  const totalSteps = Math.ceil(schema.fields.length / fieldsPerStep) + 1 // +1 for documents step
  const currentFields = schema.fields.slice(step * fieldsPerStep, (step + 1) * fieldsPerStep)
  const isDocumentsStep = step === totalSteps - 1

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return lang === 'fr' ? 'Ce champ est requis' : 'هذا الحقل مطلوب'
    }

    if (field.validation) {
      if (field.validation instanceof RegExp) {
        if (!field.validation.test(value)) {
          return lang === 'fr' ? 'Format invalide' : 'تنسيق غير صالح'
        }
      } else if (typeof field.validation === 'function') {
        if (!field.validation(value)) {
          return lang === 'fr' ? 'Valeur invalide' : 'قيمة غير صالحة'
        }
      }
    }

    if (field.type === 'number') {
      const num = Number(value)
      if (field.min !== undefined && num < field.min) {
        return lang === 'fr' ? `Minimum: ${field.min}` : `الحد الأدنى: ${field.min}`
      }
      if (field.max !== undefined && num > field.max) {
        return lang === 'fr' ? `Maximum: ${field.max}` : `الحد الأقصى: ${field.max}`
      }
    }

    return null
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldId]
      return newErrors
    })
  }

  const handleFileUpload = (documentType: string, files: File[]) => {
    setUploadedFiles((prev) => ({ ...prev, [documentType]: files }))
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    currentFields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (step < totalSteps - 1) {
        setStep((s) => s + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep((s) => s - 1)
    }
  }

  const handleSave = async () => {
    if (!validateCurrentStep()) return

    setSaving(true)
    try {
      await onSave({
        serviceId,
        formData,
        trackingCode,
        uploadedFiles,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]

    const inputProps = {
      id: field.id,
      value,
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder ? tr(field.placeholder) : '',
      required: field.required,
      className: cn(
        'w-full rounded-xl border-2 px-4 py-3 text-foreground transition-colors',
        error ? 'border-destructive' : 'border-border',
        'focus:border-primary focus:outline-none'
      ),
    }

    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block text-sm font-medium text-foreground">
          {tr(field.label)}
          {field.required && <span className="text-destructive"> *</span>}
        </label>

        {field.type === 'text' && (
          <input type="text" {...inputProps} />
        )}

        {field.type === 'number' && (
          <input type="number" {...inputProps} min={field.min} max={field.max} />
        )}

        {field.type === 'date' && (
          <input type="date" {...inputProps} />
        )}

        {field.type === 'select' && (
          <select {...inputProps}>
            <option value="">{lang === 'fr' ? 'Sélectionner' : 'اختر'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {tr(opt.label)}
              </option>
            ))}
          </select>
        )}

        {field.type === 'textarea' && (
          <textarea
            {...inputProps}
            rows={4}
            className={cn(
              inputProps.className,
              'resize-none'
            )}
          />
        )}

        {error && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="size-3" />
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">{tr(schema.title)}</h2>
          <p className="mt-2 text-muted-foreground">{tr(schema.description)}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {isDocumentsStep
                ? (lang === 'fr' ? 'Documents' : 'الوثائق')
                : (lang === 'fr' ? 'Étape' : 'المرحلة')} {step + 1} / {totalSteps}
            </span>
            <span className="text-muted-foreground">
              {Math.round(((step + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Fields */}
        {!isDocumentsStep && (
          <div className="space-y-4">
            {currentFields.map(renderField)}
          </div>
        )}

        {/* Documents Step */}
        {isDocumentsStep && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {lang === 'fr'
                ? 'Veuillez déposer les documents requis pour votre demande.'
                : 'يرجى رفع الوثائق المطلوبة لطلبك.'}
            </p>
            <FileUpload
              documentType="cin"
              documentLabel={{ fr: 'Carte d\'identité (CIN)', ar: 'بطاقة التعريف الوطنية' }}
              uploadedFiles={uploadedFiles['cin'] || []}
              onUpload={(files) => handleFileUpload('cin', files)}
            />
            <FileUpload
              documentType="residence"
              documentLabel={{ fr: 'Certificat de résidence', ar: 'شهادة إقامة' }}
              uploadedFiles={uploadedFiles['residence'] || []}
              onUpload={(files) => handleFileUpload('residence', files)}
            />
            <FileUpload
              documentType="income"
              documentLabel={{ fr: 'Justificatif de revenu', ar: 'ما يثبت الدخل' }}
              uploadedFiles={uploadedFiles['income'] || []}
              onUpload={(files) => handleFileUpload('income', files)}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-foreground transition-colors disabled:invisible hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
            {lang === 'fr' ? 'Précédent' : 'السابق'}
          </button>

          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {lang === 'fr' ? 'Suivant' : 'التالي'}
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <span className="animate-spin rounded-full border-2 border-primary-foreground border-t-transparent size-5" />
              ) : saved ? (
                <>
                  <CheckCircle className="size-4" />
                  {lang === 'fr' ? 'Sauvegardé!' : 'تم الحفظ!'}
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {lang === 'fr' ? 'Sauvegarder' : 'حفظ'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
