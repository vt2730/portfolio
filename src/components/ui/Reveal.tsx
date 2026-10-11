import type { CSSProperties, ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 60ms. */
  index?: number
  as?: ElementType
  className?: string
  id?: string
}

/** Wrapper that fades into view — see useReveal() and index.css. */
export function Reveal({
  children,
  index = 0,
  as: Tag = 'div',
  className,
  id,
}: RevealProps) {
  const style = { '--reveal-delay': `${index * 60}ms` } as CSSProperties

  return (
    <Tag id={id} data-reveal="" style={style} className={className}>
      {children}
    </Tag>
  )
}
