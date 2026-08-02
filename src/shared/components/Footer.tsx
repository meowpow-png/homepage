import type { JSX } from 'react'

import FooterContent from '@/content/footer.mdx'

import styles from './Footer.module.css'

interface SocialIcon {
  href: string
  icon: 'github' | 'linkedin' | 'mail'
  label: string
}

const socialIcons = [
  {
    href: 'https://github.com/meowpow-png',
    icon: 'github',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/marin-softi%C4%87-3a4920399/',
    icon: 'linkedin',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:marin.softic@proton.me',
    icon: 'mail',
    label: 'Email',
  },
] satisfies SocialIcon[]

export function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialIcons}>
        {socialIcons.map(({ href, icon, label }) => (
          <a
            key={label}
            className={styles.socialLink}
            href={href}
            aria-label={label}
            {...(href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
          >
            <span className={`${styles.icon} ${styles[icon]}`} aria-hidden="true" />
          </a>
        ))}
      </div>

      <div className={`${styles.attribution} mdx-content`}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>
        <FooterContent />
        <span className={styles.version}>v{__APP_VERSION__}</span>
      </div>
    </footer>
  )
}
