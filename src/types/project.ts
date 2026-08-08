export const TECHNICAL_HIGHLIGHT_ICON_KEYS = [
  'shield',
  'lock',
  'database',
  'workflow',
  'globe',
  'messages',
  'credit-card',
  'gauge',
  'layers',
  'server',
  'zap',
  'sparkles',
] as const

export type TechnicalHighlightIcon = typeof TECHNICAL_HIGHLIGHT_ICON_KEYS[number]

export interface TechnicalHighlight {
  text: string
  icon: TechnicalHighlightIcon | null
}

export const normalizeTechnicalHighlights = (value: unknown): TechnicalHighlight[] => {
  if (!Array.isArray(value)) return []

  return value.reduce<TechnicalHighlight[]>((highlights, item) => {
    if (typeof item === 'string') {
      const text = item.trim()
      if (text) highlights.push({ text, icon: null })
      return highlights
    }

    if (!item || typeof item !== 'object') return highlights
    const { text, icon } = item as { text?: unknown; icon?: unknown }
    if (typeof text !== 'string' || !text.trim()) return highlights

    highlights.push({
      text: text.trim(),
      icon: typeof icon === 'string' && TECHNICAL_HIGHLIGHT_ICON_KEYS.includes(icon as TechnicalHighlightIcon)
        ? icon as TechnicalHighlightIcon
        : null,
    })
    return highlights
  }, [])
}

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
  technicalHighlights: TechnicalHighlight[]
  bullets?: string[]
  status: 'published' | 'draft'
}
