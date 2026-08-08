'use client'

import OverviewSection from './components/OverviewSection'
import { useDashboard } from './components/DashboardShell'

export default function DashboardPage() {
  const { user, navigate } = useDashboard()
  return <OverviewSection user={user} onNavigate={navigate} />
}
