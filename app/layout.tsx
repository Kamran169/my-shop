import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from './components/SessionProvider'
import { BasketProvider } from './components/BasketContext'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Tradefix – Tools & Hardware',
  description: 'Trade prices on tools, plumbing, electrical and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <BasketProvider>
            <Header />
            {children}
            <Footer />
          </BasketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}