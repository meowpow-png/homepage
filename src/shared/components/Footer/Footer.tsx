import githubIcon from '../../assets/icons/github.svg'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import mailIcon from '../../assets/icons/mail.svg'

import styles from './Footer.module.css'

const socialIcons = [
  { alt: 'GitHub', src: githubIcon },
  { alt: 'LinkedIn', src: linkedinIcon },
  { alt: 'Email', src: mailIcon },
]

export function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.socialIcons}>
        {socialIcons.map(({ alt, src }) => (
          <img key={alt} className={styles.icon} src={src} alt={alt} />
        ))}
      </div>
      <p className={styles.attribution}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>{' '}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
  )
}
