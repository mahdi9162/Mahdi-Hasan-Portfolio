import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import DashboardQueryProvider from './components/DashboardQueryProvider'
import DashboardShell from './components/DashboardShell'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardQueryProvider>
      {/* Material Symbols — dashboard only, doesn't affect public portfolio */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <DashboardShell>{children}</DashboardShell>
    </DashboardQueryProvider>
  )
}
