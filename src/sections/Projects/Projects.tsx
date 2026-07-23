import styles from './Projects.module.css'

export function Projects() {
  return (
    <section className={styles.projects} aria-labelledby="projects-heading">
      <h2 className={styles.heading} id="projects-heading">
        Projects
      </h2>
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
