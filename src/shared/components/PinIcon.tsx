import type {ComponentPropsWithoutRef, JSX} from 'react'

import PinSvg from '@/shared/assets/icons/pin.svg?react'

import styles from './PinIcon.module.css'

type PinIconProps = ComponentPropsWithoutRef<typeof PinSvg>

export function PinIcon({className, ...props}: PinIconProps): JSX.Element {
    return (
        <PinSvg
            {...props}
            className={`${styles.icon} ${className ?? ''}`}
        />
    )
}
