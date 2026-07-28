import type { AnchorHTMLAttributes, MouseEvent, ReactElement } from 'react'

import { useRouter } from './useRouter'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function Link({ href, onClick, ...props }: LinkProps): ReactElement {
  const { navigate } = useRouter()
  const internal = href.startsWith('/')

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event)
    if (!shouldInterceptNavigation(event, internal)) {
      return
    }
    event.preventDefault()
    navigate(href)
  }

  return (
    <a
      {...props}
      href={href}
      target={internal ? undefined : '_blank'}
      rel={internal ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
    />
  )
}

export function shouldInterceptNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  internal: boolean,
): boolean {
  return (
    internal &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    event.button === 0
  )
}
