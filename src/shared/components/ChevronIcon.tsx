import type { ComponentPropsWithoutRef, JSX } from 'react'

import ChevronSvg from '@/shared/assets/icons/chevron.svg?react'

import styles from './ChevronIcon.module.css'

interface ChevronIconProps extends ComponentPropsWithoutRef<typeof ChevronSvg> {
  direction?: 'down' | 'up'
}

export function ChevronIcon({
  className,
  direction = 'down',
  ...props
}: ChevronIconProps): JSX.Element {
  return (
    <ChevronSvg {...props} className={`${styles.icon} ${styles[direction]} ${className ?? ''}`} />
  )
}
