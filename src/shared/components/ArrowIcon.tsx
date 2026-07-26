import type { ComponentPropsWithoutRef, JSX } from 'react'

import ArrowSvg from '@/shared/icons/arrow.svg?react'

import styles from './ArrowIcon.module.css'

interface ArrowIconProps
    extends ComponentPropsWithoutRef<typeof ArrowSvg> {
    direction?: 'left' | 'right'
}

export function ArrowIcon({
    className,
    direction = 'right',
    ...props
}: ArrowIconProps): JSX.Element {
    return (
        <ArrowSvg
            {...props}
            className={`${styles.icon} ${styles[direction]} ${className ?? ''}`}
        />
    )
}
