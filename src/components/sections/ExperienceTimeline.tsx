import { formatPeriod } from '../../lib/format'
import type { Experience } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'

interface ExperienceTimelineProps {
  roles: Experience[]
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <ol className="rows">
      {roles.map((role, index) => {
        const isCurrent = role.period.end === 'present'

        return (
          <Reveal key={role.id} as="li" index={index}>
            <article
              aria-labelledby={`${role.id}-company`}
              className="grid-12 items-baseline gap-y-5 py-[clamp(1.75rem,3.5vw,3.25rem)]"
            >
              <span aria-hidden="true" className="note col-span-full md:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </span>

              <header className="col-span-full md:col-[2/span_6] md:pr-6">
                <h3 id={`${role.id}-company`} className="h2">
                  {role.company}
                </h3>
                <p className="note mt-5">
                  {isCurrent && <span className="note--accent">● Now · </span>}
                  {role.role}
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, </span>
                  {formatPeriod(role.period)}
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, </span>
                  {role.employmentType}
                </p>
              </header>

              <div className="col-span-full md:col-[8/-1]">
                <ul className="grid gap-3">
                  {role.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-ink/80">
                      <span aria-hidden="true" className="text-accent-text">
                        —
                      </span>
                      {achievement}
                    </li>
                  ))}
                </ul>
                <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
                  {role.stack.map((tool) => (
                    <li key={tool} className="note">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        )
      })}
    </ol>
  )
}
