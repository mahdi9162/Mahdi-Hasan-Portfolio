export interface Project {
  id: string | number
  title: string
  description: string
  tech: string[]
  image: string
  liveUrl: string
  sourceUrl?: string
  showViewProject: boolean
  showSource: boolean
  classification: 'production' | 'personal'
  year?: number | null
  projectContext?: string | null
  keyFeatures: string[]
  galleryImages: string[]
  showTechnicalHighlights: boolean
  technicalHighlights: string[]
  bullets?: string[]
  status: 'published' | 'draft'
}
