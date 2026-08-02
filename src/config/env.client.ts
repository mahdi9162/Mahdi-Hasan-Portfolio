// Browser-safe environment variables only.
// This file must never contain RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY,
// or any other secret. Only NEXT_PUBLIC_* variables belong here.
//
// IMPORTANT: Next.js (Webpack/Turbopack) only inlines NEXT_PUBLIC_* values
// when they appear as *static* references: process.env.NEXT_PUBLIC_FOO.
// Dynamic access like process.env[name] produces undefined in the client
// bundle because the browser receives an empty process.env stub.
// Every variable below must therefore use a direct static reference.

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl         = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thisismahdihasan.com'

if (!supabaseUrl) {
  throw new Error('[env.client] Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  throw new Error('[env.client] Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const clientEnv = Object.freeze({
  supabaseUrl,
  supabaseAnonKey,
  siteUrl,
} as const)
