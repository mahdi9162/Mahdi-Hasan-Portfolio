import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedUser, isPortfolioAdmin } from '@/lib/admin-authorization'
import { isValidProjectSlug } from '@/lib/project-indexing'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Extract the user's access token from the Authorization header ──
    // Dashboard client sends: Authorization: Bearer <supabase_access_token>
    const authHeader = req.headers.get('authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── 2. Validate the token server-side — never trust the client ────────
    const user = await getAuthenticatedUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isPortfolioAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: unknown = await req.json().catch(() => null)
    const requestedProjectSlugs = body && typeof body === 'object' && Array.isArray((body as { projectSlugs?: unknown }).projectSlugs)
      ? (body as { projectSlugs: unknown[] }).projectSlugs
      : null
    const projectSlugs = requestedProjectSlugs
      ? [...new Set(requestedProjectSlugs.filter(isValidProjectSlug))]
      : []

    // ── 3. Revalidate the public homepage ─────────────────────────────────
    revalidatePath('/')

    if (requestedProjectSlugs) {
      projectSlugs.forEach((slug) => revalidatePath(`/projects/${slug}`))
      revalidatePath('/sitemap.xml')
    }

    return NextResponse.json({ revalidated: true, at: new Date().toISOString(), projectSlugs })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
