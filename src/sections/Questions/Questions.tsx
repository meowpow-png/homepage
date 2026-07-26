import type {JSX} from "react";

import QuestionsIntro from '@/content/questions.mdx'
import {questions} from '@/content/questions/questions'

import {Question} from './Question'
import styles from './Questions.module.css'

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
                Questions
            </h1>

            <div className={`${styles.content} mdx-content`}>
                <QuestionsIntro/>

                {questions.map(({Content, metadata}) => (
                    <Question
                        key={metadata.prompt}
                        prompt={metadata.prompt}
                    >
                        <Content/>
                    </Question>
                ))}
            </div>
        </section>
    )
}
