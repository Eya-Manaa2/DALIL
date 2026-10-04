'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ui, type Lang, type Localized, type UIKey } from '@/lib/i18n'

type LangContextValue = {
  lang: Lang
  toggle: () => void
  t: (key: UIKey) => string
  tr: (value: Localized) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const value: LangContextValue = {
    lang,
    toggle: () => setLang((l) => (l === 'fr' ? 'ar' : 'fr')),
    t: (key) => ui[key][lang],
    tr: (v) => v[lang],
  }

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
