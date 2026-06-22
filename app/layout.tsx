import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthProvider from './components/SessionProvider'

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
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}