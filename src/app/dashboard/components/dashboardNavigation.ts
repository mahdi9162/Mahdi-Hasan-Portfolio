export type DashboardSection =
  | 'overview'
  | 'home'
  | 'about'
  | 'projects'
  | 'skills'
  | 'analytics'
  | 'inbox'
  | 'seo'
  | 'settings'

export interface DashboardNavItem {
  id: DashboardSection
  label: string
  icon: string
  href: string
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'grid_view', href: '/dashboard' },
  { id: 'home', label: 'Home', icon: 'cottage', href: '/dashboard/home' },
  { id: 'about', label: 'About', icon: 'menu_book', href: '/dashboard/about' },
  { id: 'projects', label: 'Projects', icon: 'folder_open', href: '/dashboard/projects' },
  { id: 'skills', label: 'Skills', icon: 'auto_awesome', href: '/dashboard/skills' },
  { id: 'analytics', label: 'Analytics', icon: 'insights', href: '/dashboard/analytics' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', href: '/dashboard/inbox' },
  { id: 'seo', label: 'SEO', icon: 'search', href: '/dashboard/seo' },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '/dashboard/settings' },
]

export const dashboardHref = (section: DashboardSection) =>
  DASHBOARD_NAV.find((item) => item.id === section)?.href ?? '/dashboard'

export const isDashboardNavActive = (pathname: string, href: string) =>
  href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
