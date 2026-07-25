import type { ReactNode } from 'react'

import styles from './Question.module.css'

type QuestionProps = {
  children: ReactNode
  prompt: string
}

export function Question({ children, prompt }: QuestionProps) {
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
