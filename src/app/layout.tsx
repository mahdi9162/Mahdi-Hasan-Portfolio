import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import CustomCursor from '@/components/CustomCursor'
import { Toaster } from 'react-hot-toast'

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mahdi Hasan | Frontend Developer',
  description: 'Frontend Developer focused on React and modern JavaScript, building clean, responsive interfaces and practical web applications.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={`${syne.variable} antialiased`} suppressHydrationWarning>
        {/* Top-level cursor - HIGHEST priority, no interference */}
        <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
          <CustomCursor />
        </div>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#CFAE52',
                secondary: '#000000',
              },
            },
          }}
        />
      </body>
    </html>
  )
}