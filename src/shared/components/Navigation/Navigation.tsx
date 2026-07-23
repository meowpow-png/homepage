import type { MouseEvent } from 'react'

import styles from './Navigation.module.css'

const navigationItems = [
  { href: '/about', id: 'about', label: 'About' },
  { href: '/projects', id: 'projects', label: 'Projects' },
  { href: '/blog', id: 'blog', label: 'Blog' },
  { href: '/questions', id: 'questions', label: 'Questions' },
]

type NavigationProps = {
  currentPage?: 'about' | 'projects' | 'blog' | 'questions'
  onNavigate: (path: string) => void
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || isModifiedClick(event)) {
      return
    }
    event.preventDefault()
    onNavigate(event.currentTarget.pathname)
  }

  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      <a className={styles.brand} href="/about" onClick={handleNavigation}>
        <span className={styles.brandDot} aria-hidden="true" />
        marin.dev
      </a>
      <ul className={styles.links}>
        {navigationItems.map(({ href, id, label }) => (
          <li key={href}>
            <a
              className={styles.link}
              href={href}
              onClick={handleNavigation}
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
