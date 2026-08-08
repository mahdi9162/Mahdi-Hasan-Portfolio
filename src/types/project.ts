export interface Project {
  id: string | number
  title: string
  description: string
  summary: string
  tech: string[]
  image: string
  liveUrl: string
  sourceUrl?: string
  classification: 'production' | 'personal'
  bullets?: string[]
  status: 'published' | 'draft'
}
