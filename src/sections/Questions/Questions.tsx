import QuestionsContent, { metadata } from '../../content/questions.mdx'

import { Question } from './components/Question/Question'

import styles from './Questions.module.css'

type QuestionsMetadata = {
  title: string
}

const questionsMetadata = metadata as QuestionsMetadata

export function Questions() {
  return (
    <section className={styles.questions}>
      <h1 className={styles.heading} id="questions-heading">
        {questionsMetadata.title}
      </h1>
      <div className={styles.content}>
        <QuestionsContent components={{ Question }} />
      </div>
    </section>
  )
}
