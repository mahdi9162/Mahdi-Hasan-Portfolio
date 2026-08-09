import { supabase } from '@/lib/supabase'

type RevalidationPayload = {
  projectSlugs?: string[]
}

const triggerRevalidation = async (payload?: RevalidationPayload): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return false

    const res = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        ...(payload ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    })

    return res.ok
  } catch {
    return false
  }
}

/**
 * Triggers on-demand ISR revalidation of the public homepage.
 *
 * - Sends the current user's access token to POST /api/revalidate
 * - The server validates the token and calls revalidatePath("/")
 * - Returns true on success, false on failure (caller shows warning toast)
 * - Never throws — DB saves must not be blocked by revalidation failures
 */
export async function revalidateHomepage(): Promise<boolean> {
  return triggerRevalidation()
}

export const revalidateProjectPages = (slugs: Array<string | null | undefined>) =>
  triggerRevalidation({
    projectSlugs: [...new Set(slugs
      .filter((slug): slug is string => typeof slug === 'string')
      .map(slug => slug.trim())
      .filter(Boolean))],
  })
