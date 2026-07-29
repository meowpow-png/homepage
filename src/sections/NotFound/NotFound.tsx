import { useEffect } from 'react'

import styles from './NotFound.module.css'

export function NotFound() {
  useEffect(() => {
    // Vercel SPA fallback serves the page with 200 status,
    // so noindex is the only signal crawlers get. Must clean up on
    // unmount, or it leaks onto whichever page the user navigates to next
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <section className={styles.notFound} aria-labelledby="not-found-heading">
      <h1 className={styles.heading} id="not-found-heading">
        Not Found
      </h1>
      <p>The requested page could not be found.</p>
    </section>
  )
}
