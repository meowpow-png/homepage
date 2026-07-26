import { Link, useRouter } from '../routing'

import styles from './Navigation.module.css'

const navigationItems = [
  { href: '/about', id: 'about', label: 'About' },
  { href: '/projects', id: 'projects', label: 'Projects' },
  { href: '/blog', id: 'blog', label: 'Blog' },
  { href: '/questions', id: 'questions', label: 'Questions' },
]

type NavigationProps = {
  currentPage?: 'about' | 'projects' | 'blog' | 'questions'
}

export function Navigation({ currentPage }: NavigationProps) {
  const { navigate } = useRouter()

  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      <Link className={styles.brand} href="/about" navigate={navigate}>
        <span className={styles.brandDot} aria-hidden="true" />
        marin.dev
      </Link>
      <ul className={styles.links}>
        {navigationItems.map(({ href, id, label }) => (
          <li key={href}>
            <Link
              className={styles.link}
              href={href}
              navigate={navigate}
              aria-current={id === currentPage ? 'page' : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
