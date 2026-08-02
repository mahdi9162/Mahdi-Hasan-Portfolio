import { createClient } from '@supabase/supabase-js'
import { clientEnv } from '@/config/env.client'

// Browser-safe client using the public anon key only.
// For server-side operations requiring elevated access, create a separate
// server client using the service_role key — never expose it to the browser.
export const supabase = createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey)
