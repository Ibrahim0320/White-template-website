import '@/styles/globals.css'
import Providers from './providers'
import { SiteHeader } from '@/components/nav/site-header'

export const metadata = {
  title: 'Monolith Atelier',
  description: 'Luxury-inspired fashion storefront',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
