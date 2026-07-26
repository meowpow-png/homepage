import AnUnscheduledDesignReviewContent, {
  metadata as anUnscheduledDesignReviewMetadata,
} from './telekom-assignment-ui-design.mdx'
import IHiredSomeRobotsContent, {
  metadata as iHiredSomeRobotsMetadata
} from './telekom-assignment-ai-agents.mdx'
import OptionalMeansOptionalContent, {
  metadata as optionalMeansOptionalMetadata,
} from './telekom-assignment-bonus-tasks.mdx'
import TheAssignmentEscalatesContent, {
  metadata as theAssignmentEscalatesMetadata,
} from './telekom-assignment-architecture.mdx'
import ThePlatformFightsBackContent, {
  metadata as thePlatformFightsBackMetadata,
} from './telekom-assignment-soap-integration-bugs.mdx'
import SoapChroniclesContent, {
  metadata as soapChroniclesMetadata
} from './telekom-assignment-overview.mdx'

export type BlogPostMetadata = {
  filename: string
  modifiedAt: string
  publishedAt: string
  size: string
  slug: string
  title: string
}

export const blogPosts = [
  {
    Content: SoapChroniclesContent,
    metadata: soapChroniclesMetadata as BlogPostMetadata
  },
  { Content:
    TheAssignmentEscalatesContent,
    metadata: theAssignmentEscalatesMetadata as BlogPostMetadata
  },
  {
    Content: ThePlatformFightsBackContent,
    metadata: thePlatformFightsBackMetadata as BlogPostMetadata
  },
  {
    Content: OptionalMeansOptionalContent,
    metadata: optionalMeansOptionalMetadata as BlogPostMetadata
  },
  {
    Content: IHiredSomeRobotsContent,
    metadata: iHiredSomeRobotsMetadata as BlogPostMetadata
  },
  {
    Content: AnUnscheduledDesignReviewContent,
    metadata: anUnscheduledDesignReviewMetadata as BlogPostMetadata,
  },
] as const

export type BlogPost = (typeof blogPosts)[number]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.metadata.slug === slug)
}

const postsByDate = [...blogPosts].sort(
  (a, b) => a.metadata.publishedAt.localeCompare(b.metadata.publishedAt)
)

export function getNextPost(slug: string) {
  const index = postsByDate.findIndex((post) => post.metadata.slug === slug)

  if (index === -1) {
    return undefined
  }
  return postsByDate[index + 1]
}
