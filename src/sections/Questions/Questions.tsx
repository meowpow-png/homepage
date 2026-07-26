import type {JSX} from "react";

import QuestionsContent, {metadata} from '@/content/questions.mdx'
import {getMetadata} from '@/content/getMetadata'

import {Question} from './Question'
import styles from './Questions.module.css'

interface QuestionsMetadata {
    title: string
}

const questionsMetadata = getMetadata<QuestionsMetadata>(
    metadata,
)

export function Questions(): JSX.Element {
    return (
        <section
            className={styles.questions}
            aria-labelledby="questions-heading"
        >
            <h1
                className={styles.heading}
                id="questions-heading"
            >
                {questionsMetadata.title}
            </h1>

            <div className={`${styles.content} mdx-content`}>
                <QuestionsContent
                    components={{Question}}
                />
            </div>
        </section>
    )
}
