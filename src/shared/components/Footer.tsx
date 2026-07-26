import type {JSX} from "react";

import FooterContent from '@/content/footer.mdx'

import styles from './Footer.module.css'

interface SocialIcon {
    href: string
    icon: 'github' | 'linkedin' | 'mail'
    label: string
}

const socialIcons = [
    {
        href: '#',
        icon: 'github',
        label: 'GitHub',
    },
    {
        href: '#',
        icon: 'linkedin',
        label: 'LinkedIn',
    },
    {
        href: '#',
        icon: 'mail',
        label: 'Email',
    },
] satisfies SocialIcon[]

export function Footer(): JSX.Element {
    return (
        <footer className={styles.footer}>
            <div className={styles.socialIcons}>
                {socialIcons.map(({href, icon, label}) => (
                    <a
                        key={href}
                        className={styles.socialLink}
                        href={href}
                        aria-label={label}
                    >
            <span
                className={`${styles.icon} ${styles[icon]}`}
                aria-hidden="true"
            />
                    </a>
                ))}
            </div>

            <div className={`${styles.attribution} mdx-content`}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>
                <FooterContent/>
            </div>
        </footer>
    )
}
