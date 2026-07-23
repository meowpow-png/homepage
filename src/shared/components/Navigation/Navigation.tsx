import styles from './Navigation.module.css'

const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#blog', label: 'Blog' },
  { href: '#questions', label: 'Questions' },
]

export function Navigation() {
  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      <a className={styles.brand} href="#about">
        <span className={styles.brandDot} aria-hidden="true" />
        marin.dev
      </a>
      <ul className={styles.links}>
        {navigationItems.map(({ href, label }) => (
          <li key={href}>
            <a
              className={styles.link}
              href={href}
              aria-current={href === '#about' ? 'location' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
