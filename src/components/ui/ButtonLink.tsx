import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'ghost'
type Size = 'md' | 'sm'
export type ArrowDirection = 'right' | 'out' | 'down' | 'up'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Trailing arrow; it leans the way it points on hover. */
  arrow?: ArrowDirection
}

const ARROWS: Record<ArrowDirection, { glyph: string; className: string }> = {
  right: { glyph: '→', className: 'arrow' },
  out: { glyph: '↗', className: 'arrow arrow--out' },
  down: { glyph: '↓', className: 'arrow arrow--down' },
  up: { glyph: '↑', className: 'arrow arrow--up' },
}

export function Arrow({ direction }: { direction: ArrowDirection }) {
  const { glyph, className } = ARROWS[direction]
  return (
    <span aria-hidden="true" className={className}>
      {glyph}
    </span>
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'solid',
  size = 'md',
  arrow,
  className = '',
  ...rest
}: ButtonLinkProps) {
  const classes = [
    'btn',
    variant === 'ghost' && 'btn--ghost',
    size === 'sm' && 'btn--sm',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a href={href} className={classes} {...rest}>
      {children}
      {arrow && <Arrow direction={arrow} />}
    </a>
  )
}
