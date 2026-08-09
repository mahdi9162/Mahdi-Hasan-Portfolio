import 'server-only'

import { createClient, type User } from '@supabase/supabase-js'
import { serverEnv } from '@/config/env.server'

const normalizeEmail = (value: string | null | undefined) => value?.trim().toLowerCase() ?? ''

const getAdminClient = () => createClient(
  serverEnv.supabaseUrl,
  serverEnv.supabaseServiceRoleKey,
  { auth: { persistSession: false } },
)

export const isPortfolioAdmin = (user: Pick<User, 'email' | 'app_metadata'> | null | undefined) => {
  const configuredEmail = normalizeEmail(serverEnv.portfolioAdminEmail)
  const userEmail = normalizeEmail(user?.email)
  const role = user?.app_metadata?.portfolio_role
  return Boolean(
    configuredEmail
    && userEmail
    && configuredEmail === userEmail
    && role === 'admin'
  )
}

export async function getAuthenticatedUser(accessToken: string) {
  const { data: { user }, error } = await getAdminClient().auth.getUser(accessToken)
  return error ? null : user
}
