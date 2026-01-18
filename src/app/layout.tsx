import type { Metadata } from 'next'
import { Syne, Manrope, Space_Grotesk, Epilogue } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import CustomCursor from '@/components/CustomCursor'
import FallBeamBackground from '@/components/FallBeamBackground'
import { Toaster } from 'react-hot-toast'

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-epilogue',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mahdi Hasan | Frontend Developer',
  description: 'Frontend Developer focused on React and modern JavaScript, building clean, responsive interfaces and practical web applications.',
  icons: {
    icon: '/mh(4x).png',
    apple: '/mh_1x.png',
  },
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
      <body className={`${syne.variable} ${manrope.variable} ${spaceGrotesk.variable} ${epilogue.variable} antialiased`} suppressHydrationWarning>
        <div className="relative min-h-screen">
          {/* Global Fall Beam Background */}
          <FallBeamBackground 
            lineCount={40} 
            beamColorClass="golden" 
            className="z-0" 
          />
          
          <CustomCursor />
          <SmoothScrollProvider>
            <div className="relative z-10">
              {children}
            </div>
          </SmoothScrollProvider>
        </div>
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
                primary: 'rgb(207 174 82)',
                secondary: '#000000',
              },
            },
          }}
        />
      </body>
    </html>
  )
}