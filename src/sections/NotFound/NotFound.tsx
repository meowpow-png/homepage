import { useEffect } from 'react'

import art404 from '@/shared/assets/images/404.webp'

import styles from './NotFound.module.css'

export function NotFound() {
  useEffect(() => {
    // staging already has a site-wide noindex tag,
    // don't add a second one (see blockNonProductionIndexing)
    if (document.querySelector('meta[name="robots"]')) {
      return
    }
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

      <div className={styles.log}>
        <p className={styles.title}>Page Not Found</p>
        <p>The kraken got here first.</p>
        <p className={styles.prompt}>$ cat ./404.txt</p>

        <div className={styles.artWrapper}>
          <img src={art404} alt="" aria-hidden="true" className={styles.art} />
        </div>
      </div>
    </section>
  )
}
