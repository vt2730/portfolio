import type { ReactNode } from 'react'
import type { SectionId } from '../../types/portfolio'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export type SectionTone = 'canvas' | 'panel' | 'inverted'

interface SectionProps {
  id: SectionId
  index: number
  title: string
  /** Short line under the title. */
  lead?: string
  tone?: SectionTone
  children: ReactNode
}

const tones: Record<SectionTone, string> = {
  canvas: '',
  panel: 'panel',
  inverted: 'panel inverted',
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
  const framed = tone !== 'canvas'

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={framed ? 'px-2 py-3 sm:px-3' : 'py-16 md:py-24'}
    >
      <div className={`${tones[tone]} ${framed ? 'py-16 md:py-24' : ''}`}>
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal as="header" className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p
                aria-hidden="true"
                className="flex items-center gap-3 font-mono text-xs text-faint"
              >
                <span className="h-px w-6 bg-accent" />
                {String(index).padStart(2, '0')}
              </p>
              <h2
                id={headingId}
                className="display mt-4 text-[clamp(2.25rem,5vw,3.75rem)]"
              >
                {title}
              </h2>
              {lead && (
                <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
                  {lead}
                </p>
              )}
            </div>
          </Reveal>
          <div className="min-w-0 lg:col-span-8">{children}</div>
        </Container>
      </div>
    </section>
  )
}
