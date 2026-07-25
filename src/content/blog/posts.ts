import AnUnscheduledDesignReviewContent, {
  metadata as anUnscheduledDesignReviewMetadata,
} from './an-unscheduled-design-review.mdx'
import IHiredSomeRobotsContent, {
  metadata as iHiredSomeRobotsMetadata
} from './i-hired-some-robots.mdx'
import OptionalMeansOptionalContent, {
  metadata as optionalMeansOptionalMetadata,
} from './optional-was-never-an-option.mdx'
import TheAssignmentEscalatesContent, {
  metadata as theAssignmentEscalatesMetadata,
} from './the-assignment-escalates.mdx'
import ThePlatformFightsBackContent, {
  metadata as thePlatformFightsBackMetadata,
} from './the-platform-fights-back.mdx'
import SoapChroniclesContent, {
  metadata as soapChroniclesMetadata
} from './the-soap-chronicles.mdx'

export type BlogPostMetadata = {
  filename: string
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
