'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileImage, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { useLang } from './lang-provider'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onUpload: (files: File[], documentType: string) => void
  documentType: string
  documentLabel: { fr: string; ar: string }
  uploadedFiles?: File[]
  maxFiles?: number
  maxSize?: number // in MB
}

export function FileUpload({
  onUpload,
  documentType,
  documentLabel,
  uploadedFiles = [],
  maxFiles = 1,
  maxSize = 5,
}: FileUploadProps) {
  const { tr, lang } = useLang()
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      setUploading(true)

      try {
        onUpload(acceptedFiles, documentType)
      } catch (err) {
        setError(lang === 'fr' ? 'Erreur lors de l\'upload' : 'خطأ أثناء الرفع')
      } finally {
        setUploading(false)
      }
    },
    [onUpload, documentType, lang]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0]
      if (file.errors[0]?.code === 'file-too-large') {
        setError(
          lang === 'fr'
            ? `Fichier trop grand (max ${maxSize}MB)`
            : `الملف كبير جدا (الحد الأقصى ${maxSize}MB)`
        )
      } else if (file.errors[0]?.code === 'too-many-files') {
        setError(
          lang === 'fr'
            ? `Trop de fichiers (max ${maxFiles})`
            : `ملفات كثيرة جدا (الحد الأقصى ${maxFiles})`
        )
      } else {
        setError(lang === 'fr' ? 'Fichier invalide' : 'ملف غير صالح')
      }
    },
  })

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    onUpload(newFiles, documentType)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="size-5" />
    }
    return <FileText className="size-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {tr(documentLabel)}
        {uploadedFiles.length > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            ({uploadedFiles.length}/{maxFiles})
          </span>
        )}
      </label>

      <div
        {...getRootProps()}
        className={cn(
          'rounded-2xl border-2 border-dashed p-6 text-center transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="animate-spin rounded-full border-2 border-primary border-t-transparent size-8" />
          ) : (
            <Upload className="size-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? (lang === 'fr' ? 'Déposez les fichiers ici' : 'أفلت الملفات هنا')
              : (lang === 'fr'
                  ? 'Glissez vos fichiers ici ou cliquez pour sélectionner'
                  : 'اسحب الملفات هنا أو انقر للاختيار')}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === 'fr' ? 'PDF, JPG, PNG' : 'PDF، JPG، PNG'} (max {maxSize}MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
