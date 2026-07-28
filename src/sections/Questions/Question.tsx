import type { JSX, ReactNode } from 'react'

import styles from './Question.module.css'

interface QuestionProps {
  children: ReactNode
  prompt: string
}

export function Question({ children, prompt }: QuestionProps): JSX.Element {
  return (
    <details className={styles.question}>
      <summary className={styles.prompt}>
        <span className={styles.quote} aria-hidden="true">
          “
        </span>
        <span>{prompt}</span>
      </summary>
      <div className={`${styles.answer} mdx-content`}>{children}</div>
    </details>
  )
}
