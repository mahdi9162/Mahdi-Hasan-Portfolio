import type { ProjectCaseStudyStructuredData } from '@/lib/project-structured-data'

interface Props {
  structuredData: ProjectCaseStudyStructuredData
}

const serializeJsonLd = (structuredData: ProjectCaseStudyStructuredData) =>
  JSON.stringify(structuredData).replace(/</g, '\\u003c')

export default function ProjectCaseStudyJsonLd({ structuredData }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  )
}
