import styles from './About.module.css'

export function About() {
  return (
    <section className={styles.about} id="about" aria-labelledby="about-heading">
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Hi, I’m</p>
        <h1 className={styles.name} id="about-heading">
          Lorem<span className={styles.nameDot}>.</span>
        </h1>
        <p className={styles.summary}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div className={styles.divider} />

      <div className={styles.content}>
        <h2 className={styles.heading}>About</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </div>
    </section>
  )
}
