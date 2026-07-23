import styles from './Questions.module.css'

export function Questions() {
  return (
    <section className={styles.questions} aria-labelledby="questions-heading">
      <h1 className={styles.heading} id="questions-heading">
        Questions
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </section>
  )
}
