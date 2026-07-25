import React from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    navigate: (path: string) => void
}

export function Link({ href, navigate, onClick, ...props }: LinkProps) {
    const internal = href.startsWith('/')
    return (
        <a
            {...props}
            href={href}
            target={internal ? undefined : '_blank'}
            rel={internal ? undefined : 'noopener noreferrer'}
            onClick={(event) => {
                onClick?.(event)
                if (
                    event.defaultPrevented ||
                    !internal ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return
                }
                event.preventDefault()
                navigate(href)
            }}
        />
    )
}
