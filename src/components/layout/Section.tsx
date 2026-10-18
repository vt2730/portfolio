import type { ReactNode } from 'react'
import type { SectionId } from '../../types/portfolio'

interface SectionProps {
  id: SectionId
  index: number
  title: string
  /** Mono annotation on the right of the section's rule. */
  note?: string
  children: ReactNode
}

export function Section({ id, index, title, note, children }: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section id={id} aria-labelledby={headingId} className="section wrap">
      <header className="section-head">
        <h2 id={headingId} className="note note--ink">
          <span aria-hidden="true">[{String(index).padStart(2, '0')}] </span>
          {title}
        </h2>
        {note && <p className="note">{note}</p>}
      </header>
      {children}
    </section>
  )
}
