import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, Readex_Pro } from 'next/font/google'
import { SiteFooter } from '@/components/hotlines'
import { LangProvider } from '@/components/lang-provider'
import { MobileTabBar, SiteHeader } from '@/components/site-header'
import './globals.css'

const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex',
})
const readex = Readex_Pro({ subsets: ['arabic', 'latin'], weight: ['500', '600', '700'], variable: '--font-readex' })

export const metadata: Metadata = {
  title: 'Dalil Social – Guide des services sociaux en Tunisie | دليل اجتماعي',
  description:
    'Trouvez les aides sociales adaptées à votre situation en Tunisie, en parlant en darija ou en touchant une image : AMEN Social, soins gratuits, carte handicap, protection de l’enfance, et le bureau le plus proche.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dalil',
  },
}

export const viewport: Viewport = {
  themeColor: '#E70013',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" dir="ltr" className={`bg-background ${plex.variable} ${readex.variable}`}>
      <body className="pb-20 antialiased md:pb-0 print:pb-0">
        <LangProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <MobileTabBar />
        </LangProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Unregister any existing service workers
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                  registrations.forEach((registration) => {
                    registration.unregister()
                    console.log('Service Worker unregistered')
                  })
                })
              }
            `,
          }}
        />
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(() => {
                      console.log('Service Worker registered')
                    }).catch((err) => {
                      console.log('Service Worker registration failed', err)
                    })
                  })
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
