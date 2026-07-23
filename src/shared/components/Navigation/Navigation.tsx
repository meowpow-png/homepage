import styles from './Navigation.module.css'

const navigationItems = [
  { href: '/', id: 'about', label: 'About' },
  { href: '/projects', id: 'projects', label: 'Projects' },
  { href: '/blog', id: 'blog', label: 'Blog' },
  { href: '/questions', id: 'questions', label: 'Questions' },
]

type NavigationProps = {
  currentPage: 'about' | 'projects' | 'blog' | 'questions'
}

export function Navigation({ currentPage }: NavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      <a className={styles.brand} href="/">
        <span className={styles.brandDot} aria-hidden="true" />
        marin.dev
      </a>
      <ul className={styles.links}>
        {navigationItems.map(({ href, id, label }) => (
          <li key={href}>
            <a
              className={styles.link}
              href={href}
              aria-current={id === currentPage ? 'page' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
