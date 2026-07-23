import styles from './Footer.module.css'

const socialIcons = [
  { icon: 'github', label: 'GitHub' },
  { icon: 'linkedin', label: 'LinkedIn' },
  { icon: 'mail', label: 'Email' },
] as const

export function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.socialIcons}>
        {socialIcons.map(({ icon, label }) => (
          <a
            key={label}
            className={styles.socialLink}
            href="#"
            aria-label={label}
          >
            <span className={`${styles.icon} ${styles[icon]}`} aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className={styles.attribution}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>{' '}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
  )
}
