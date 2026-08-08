'use client'

import SettingsSection from '../components/SettingsSection'
import { useDashboard } from '../components/DashboardShell'

export default function DashboardSettingsPage() {
  const { user, signOut } = useDashboard()
  return <SettingsSection user={user} onSignOut={signOut} />
}
