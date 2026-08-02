import { getMetadata } from '@/content/getMetadata'

import WhyJavaContent, { metadata as whyJavaMetadata } from './why-java.mdx'
import WhyAiContent, { metadata as whyAiMetadata } from './why-ai.mdx'
import WhySoMuchInfrastructureContent, {
  metadata as whySoMuchInfrastructureMetadata,
} from './why-so-much-infrastructure.mdx'
import WhyDocumentEverythingContent, {
  metadata as whyDocumentEverythingMetadata,
} from './why-document-everything.mdx'
import WhySoManyAbandonedRepositoriesContent, {
  metadata as whySoManyAbandonedRepositoriesMetadata,
} from './why-so-many-abandoned-repositories.mdx'

export type QuestionMetadata = {
  prompt: string
}

export const questions = [
  {
    Content: WhyJavaContent,
    metadata: getMetadata<QuestionMetadata>(whyJavaMetadata),
  },
  {
    Content: WhyAiContent,
    metadata: getMetadata<QuestionMetadata>(whyAiMetadata),
  },
  {
    Content: WhySoMuchInfrastructureContent,
    metadata: getMetadata<QuestionMetadata>(whySoMuchInfrastructureMetadata),
  },
  {
    Content: WhyDocumentEverythingContent,
    metadata: getMetadata<QuestionMetadata>(whyDocumentEverythingMetadata),
  },
  {
    Content: WhySoManyAbandonedRepositoriesContent,
    metadata: getMetadata<QuestionMetadata>(whySoManyAbandonedRepositoriesMetadata),
  },
] as const
