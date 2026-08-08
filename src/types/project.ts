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

const normalizeTechnicalHighlight = (value: unknown): TechnicalHighlight | null => {
  if (typeof value === 'string') {
    const legacyText = value.trim()
    if (!legacyText) return null
    let serializedValue = legacyText

    // Supabase rows may contain JSON-encoded highlight objects. A second pass
    // also makes the UI tolerant of an accidentally double-encoded value.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const parsed = JSON.parse(serializedValue)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return normalizeTechnicalHighlight(parsed)
        }
        if (typeof parsed === 'string' && parsed.trim() !== serializedValue) {
          serializedValue = parsed.trim()
          continue
        }
      } catch {
        break
      }

      break
    }

    return { text: legacyText, icon: null }
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const { text, icon } = value as { text?: unknown; icon?: unknown }
  if (typeof text !== 'string' || !text.trim()) return null

  return {
    text: text.trim(),
    icon: typeof icon === 'string' && TECHNICAL_HIGHLIGHT_ICON_KEYS.includes(icon as TechnicalHighlightIcon)
      ? icon as TechnicalHighlightIcon
      : null,
  }
}

export const normalizeTechnicalHighlights = (value: unknown): TechnicalHighlight[] => {
  if (!Array.isArray(value)) return []

  return value.reduce<TechnicalHighlight[]>((highlights, item) => {
    const highlight = normalizeTechnicalHighlight(item)
    if (highlight) highlights.push(highlight)
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
  projectSubtitle?: string | null
  organization?: string | null
  year?: number | null
  projectContext?: string | null
  keyFeatures: string[]
  galleryImages: string[]
  showTechnicalHighlights: boolean
  technicalHighlights: TechnicalHighlight[]
  bullets?: string[]
  status: 'published' | 'draft'
}
