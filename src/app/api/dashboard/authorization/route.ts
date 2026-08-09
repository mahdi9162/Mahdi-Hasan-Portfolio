import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isPortfolioAdmin } from '@/lib/admin-authorization'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) return NextResponse.json({ authorized: false }, { status: 401 })

  const user = await getAuthenticatedUser(token)
  if (!user) return NextResponse.json({ authorized: false }, { status: 401 })

  if (!isPortfolioAdmin(user)) {
    return NextResponse.json({ authorized: false }, { status: 403 })
  }

  return NextResponse.json({ authorized: true })
}
