import type { ReactNode } from 'react'
import type { SectionId } from '../../types/portfolio'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export type SectionTone = 'canvas' | 'grid'

interface SectionProps {
  id: SectionId
  index: number
  title: string
  /** Short line beside the title. */
  lead?: string
  /** `grid` draws the faint blueprint grid behind the section. */
  tone?: SectionTone
  children: ReactNode
}

export function Section({
  id,
  index,
  title,
  lead,
  tone = 'canvas',
  children,
}: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative isolate border-t border-line py-20 md:py-28"
    >
      {tone === 'grid' && (
        <div
          aria-hidden="true"
          className="grid-bg pointer-events-none absolute inset-0 -z-10"
        />
      )}

      <Container>
        <Reveal as="header" className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p
              aria-hidden="true"
              className="label flex items-center gap-3 text-accent"
            >
              <span className="h-px w-8 bg-accent" />
              {String(index).padStart(2, '0')}
            </p>
            <h2
              id={headingId}
              className="display mt-5 text-[clamp(2rem,4.5vw,3.25rem)]"
            >
              {title}
            </h2>
          </div>
          {lead && (
            <p className="text-base leading-relaxed text-muted lg:col-span-4 lg:col-start-9 lg:self-end lg:text-[17px]">
              {lead}
            </p>
          )}
        </Reveal>
        <div className="mt-12 min-w-0 md:mt-16">{children}</div>
      </Container>
    </section>
  )
}
