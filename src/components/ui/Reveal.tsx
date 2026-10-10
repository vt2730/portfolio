import type { CSSProperties, ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 80ms. */
  index?: number
  /** `scale` adds a slight zoom to the entrance. */
  variant?: 'up' | 'scale'
  as?: ElementType
  className?: string
  id?: string
}

/** Wrapper that animates into view — see useReveal() and index.css. */
export function Reveal({
  children,
  index = 0,
  variant = 'up',
  as: Tag = 'div',
  className,
  id,
}: RevealProps) {
  const style = { '--reveal-delay': `${index * 80}ms` } as CSSProperties

  return (
    <Tag
      id={id}
      data-reveal={variant === 'scale' ? 'scale' : ''}
      style={style}
      className={className}
    >
      {children}
    </Tag>
  )
}
