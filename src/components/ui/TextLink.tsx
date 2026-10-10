import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  /** Opens in a new tab and shows an outbound arrow. */
  external?: boolean
}

export function TextLink({
  href,
  children,
  external = false,
  className = '',
  ...rest
}: TextLinkProps) {
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={`group -my-1 inline-flex items-center gap-1 py-1 font-medium text-ink underline decoration-line decoration-1 underline-offset-[5px] transition-colors duration-150 hover:decoration-accent ${className}`}
      {...rest}
    >
      {children}
      {external && (
        <>
          <Icon
            name="arrow-up-right"
            className="size-3.5 text-faint transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent motion-reduce:transition-none"
          />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  )
}
