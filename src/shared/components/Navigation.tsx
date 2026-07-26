import type {JSX} from "react";

import type {NavigationPage, RoutePath} from '@/shared/routing'
import {Link} from '@/shared/routing'

import styles from './Navigation.module.css'

interface NavigationItem {
    href: RoutePath
    id: NavigationPage
    label: string
}

const navigationItems = [
    {href: '/about', id: 'about', label: 'About'},
    {href: '/projects', id: 'projects', label: 'Projects'},
    {href: '/blog', id: 'blog', label: 'Blog'},
    {href: '/questions', id: 'questions', label: 'Questions'},
] satisfies NavigationItem[]

interface NavigationProps {
    currentPage?: NavigationPage
}

export function Navigation({currentPage}: NavigationProps): JSX.Element {
    return (
        <nav className={styles.navigation} aria-label="Primary navigation">
            <Link className={styles.brand} href="/about">
                <span className={styles.brandDot} aria-hidden="true"/>
                marin.dev
            </Link>
            <ul className={styles.links}>
                {navigationItems.map(({href, id, label}) => (
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
