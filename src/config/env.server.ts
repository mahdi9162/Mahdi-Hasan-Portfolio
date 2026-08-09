// Importing 'server-only' causes a build error if this module is ever
// imported into a Client Component or any browser bundle. This is the
// intended safety net — secrets must never reach the client.
import 'server-only'

function require(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `[env.server] Missing required environment variable: ${name}`
    )
  }
  return value
}

const optional = (name: string) => process.env[name]?.trim() || null

// Validated at first import. The server crashes immediately on startup
// (or at first request in edge/serverless) if any variable is absent,
// rather than failing silently mid-request.
export const serverEnv = Object.freeze({
  supabaseUrl:            require('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseServiceRoleKey: require('SUPABASE_SERVICE_ROLE_KEY'),
  resendApiKey:           require('RESEND_API_KEY'),
  resendFrom:             require('RESEND_FROM'),
  resendTo:               require('RESEND_TO'),
  // This remains optional at boot so a missing deployment setting fails closed
  // for dashboard/API authorization instead of exposing an admin surface.
  portfolioAdminEmail:    optional('PORTFOLIO_ADMIN_EMAIL'),
} as const)
