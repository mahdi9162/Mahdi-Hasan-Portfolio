'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import DashboardLayout from './DashboardLayout'
import { dashboardHref, type DashboardSection } from './dashboardNavigation'

interface DashboardContextValue {
  user: User
  navigate: (section: DashboardSection) => void
  signOut: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard must be used inside DashboardShell.')
  return context
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['dashboard-contact-messages-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread')
      if (error) return 0
      return count ?? 0
    },
    enabled: !!user,
    refetchInterval: 60_000,
  })

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setAuthError(null)
    setSigningIn(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
    setSigningIn(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#D4AF37]/70" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4">
        <div className="w-full max-w-sm">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Portfolio Admin</p>
          <h1 className="mb-1 text-xl font-semibold text-white">Sign in</h1>
          <p className="mb-8 text-sm text-white/30">Premium access only</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Email</label>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/[0.10] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/20 transition-colors focus:border-[#D4AF37]/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Password</label>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/[0.10] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/20 transition-colors focus:border-[#D4AF37]/40 focus:outline-none"
              />
            </div>
            {authError && <p className="text-xs text-red-400/80">{authError}</p>}
            <button
              type="submit"
              disabled={signingIn}
              className="w-full rounded-xl bg-[#D4AF37] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#D4AF37]/90 disabled:opacity-50"
            >
              {signingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const navigate = (section: DashboardSection) => router.push(dashboardHref(section))

  return (
    <DashboardContext.Provider value={{ user, navigate, signOut }}>
      <DashboardLayout user={user} onSignOut={signOut} unreadCount={unreadCount}>
        {children}
      </DashboardLayout>
    </DashboardContext.Provider>
  )
}
