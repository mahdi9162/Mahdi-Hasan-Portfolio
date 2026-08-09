export interface ProjectIndexingCandidate {
  slug: string | null | undefined
  status: string | null | undefined
  indexProjectCaseStudy: boolean | null | undefined
}

export const isValidProjectSlug = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

export const isIndexableProjectCaseStudy = ({
  slug,
  status,
  indexProjectCaseStudy,
}: ProjectIndexingCandidate) =>
  status === 'published'
  && indexProjectCaseStudy === true
  && isValidProjectSlug(slug)
