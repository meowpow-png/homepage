import type { JSX } from 'react'

import { getMetadata } from '@/content/getMetadata'
import AboutContent, { metadata } from '@/content/about.mdx'

import styles from './About.module.css'

interface AboutMetadata {
  name: string
  summary: string
}

const aboutMetadata = getMetadata<AboutMetadata>(metadata)

export function About(): JSX.Element {
  return (
    <section className={styles.about} id="about" aria-labelledby="about-heading">
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Hi, I’m</p>

        <h1 className={styles.name} id="about-heading">
          {aboutMetadata.name}
          <span className={styles.nameDot}>.</span>
        </h1>

        <p className={styles.summary}>{aboutMetadata.summary}</p>
      </div>

      <div className={styles.divider} />

      <div className={`${styles.content} mdx-content`}>
        <h2 className={styles.heading}>About</h2>

        <AboutContent />
      </div>
    </section>
  )
}
