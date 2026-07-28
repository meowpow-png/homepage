import type { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { NavigationPage, RoutePath } from '@/shared/routing'
import { Link } from '@/shared/routing'

import MenuSvg from '@/shared/assets/icons/menu.svg?react'

import styles from './Navigation.module.css'

interface NavigationItem {
  href: RoutePath
  id: NavigationPage
  label: string
}

const navigationItems = [
  { href: '/about', id: 'about', label: 'About' },
  { href: '/projects', id: 'projects', label: 'Projects' },
  { href: '/blog', id: 'blog', label: 'Blog' },
  { href: '/questions', id: 'questions', label: 'Questions' },
] satisfies NavigationItem[]

interface NavigationProps {
  currentPage?: NavigationPage
}

export function Navigation({ currentPage }: NavigationProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    function handleClickOutside(event: MouseEvent): void {
      if (!navRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <nav ref={navRef} className={styles.navigation} aria-label="Primary navigation">
      <div className={styles.topRow}>
        <Link className={styles.brand} href="/about">
          <span className={styles.brandDot} aria-hidden="true" />
          marin.dev
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation-links"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <MenuSvg className={styles.menuToggleIcon} aria-hidden="true" />
        </button>
      </div>

      <div
        className={styles.backdrop}
        data-open={isMenuOpen}
        aria-hidden="true"
        onClick={() => setIsMenuOpen(false)}
      />

      <ul
        id="primary-navigation-links"
        className={styles.links}
        data-open={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      >
        {navigationItems.map(({ href, id, label }) => (
          <li key={href}>
            <Link
              className={styles.link}
              href={href}
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
