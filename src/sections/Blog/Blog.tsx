import styles from './Blog.module.css'

export function Blog() {
  return (
    <section className={styles.blog} aria-labelledby="blog-heading">
      <h1 className={styles.heading} id="blog-heading">
        Blog
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
