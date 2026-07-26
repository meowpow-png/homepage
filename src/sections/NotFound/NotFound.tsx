import styles from './NotFound.module.css'

export function NotFound() {
    return (
        <section className={styles.notFound} aria-labelledby="not-found-heading">
            <h1 className={styles.heading} id="not-found-heading">
                Not Found
            </h1>
            <p>The requested page could not be found.</p>
        </section>
    )
}
