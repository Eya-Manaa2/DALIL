'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Languages, LayoutGrid, MapPin, Mic, Phone, Smartphone } from 'lucide-react'
import type { UIKey } from '@/lib/i18n'
import { hotlines } from '@/lib/services-data'
import { cn } from '@/lib/utils'
import { useLang } from './lang-provider'

const navLinks: { href: string; key: UIKey; icon: typeof Home }[] = [
  { href: '/', key: 'navHome', icon: Home },
  { href: '/services', key: 'navCatalog', icon: LayoutGrid },
  { href: '/carte', key: 'navMap', icon: MapPin },
  { href: '/assistant', key: 'navVoice', icon: Mic },
  { href: '/sans-internet', key: 'navOffline', icon: Smartphone },
]

const emergencyNumbers = hotlines.slice(0, 3)

function EmergencyBar() {
  const { t, tr } = useLang()
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-1.5 text-sm">
        <span className="flex shrink-0 items-center gap-1.5 font-bold text-accent">
          <Phone className="size-3.5" aria-hidden />
          {t('emergency')}
        </span>
        <ul className="flex shrink-0 items-center gap-4">
          {emergencyNumbers.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.number}`} className="flex items-center gap-1.5 whitespace-nowrap hover:text-accent">
                <span dir="ltr" className="font-bold">
                  {h.number}
                </span>
                <span className="opacity-80">{tr(h.label)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader() {
  const { t, toggle, lang } = useLang()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 print:hidden">
      <EmergencyBar />
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="relative flex size-10 items-center justify-center">
              <Image
                src="/images/tunisia-flag.png"
                alt="Drapeau tunisien"
                width={40}
                height={40}
                className="rounded-full object-cover"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-base font-semibold text-foreground">{t('brand')}</span>
              <span className="hidden text-xs text-muted-foreground lg:block">{t('tagline')}</span>
            </span>
          </Link>
          <nav aria-label={t('mainNav')} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((l) => {
                const active = isActive(pathname, l.href)
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                        active ? 'bg-secondary text-primary' : 'text-foreground hover:text-primary',
                      )}
                    >
                      {t(l.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <button
            type="button"
            onClick={toggle}
            aria-label={t('switchLangLabel')}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Languages className="size-4" aria-hidden />
            <span lang={lang === 'fr' ? 'ar' : 'fr'}>{t('switchLang')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export function MobileTabBar() {
  const { t } = useLang()
  const pathname = usePathname()

  return (
    <nav
      aria-label={t('mainNav')}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
    >
      <ul className="grid grid-cols-5">
        {navLinks.map((l) => {
          const active = isActive(pathname, l.href)
          const Icon = l.icon
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 px-1 py-2 text-xs font-medium',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-12 items-center justify-center rounded-full',
                    active && 'bg-secondary',
                    l.href === '/assistant' && !active && 'bg-primary text-primary-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="truncate">{t(l.key)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
