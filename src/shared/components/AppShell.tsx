import type { JSX, ReactNode } from 'react'

import styles from './AppShell.module.css'

interface AppShellProps {
  children?: ReactNode
  footer?: ReactNode
  header?: ReactNode
}

export function AppShell({ children, footer, header }: AppShellProps): JSX.Element {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <header className={styles.header}>{header}</header>
      <main className={styles.main} id="main-content">
        {children}
      </main>
      <footer className={styles.footer}>{footer}</footer>
    </div>
  )
}
