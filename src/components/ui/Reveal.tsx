import type { CSSProperties, ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 90ms. */
  index?: number
  /** `up` fades the element up; `lines` raises its MaskWords instead. */
  variant?: 'up' | 'lines'
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
  const style = { '--reveal-delay': `${index * 90}ms` } as CSSProperties

  return (
    <Tag id={id} data-reveal={variant} style={style} className={className}>
      {children}
    </Tag>
  )
}
