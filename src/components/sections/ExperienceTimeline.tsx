import { formatPeriod } from '../../lib/format'
import type { Experience } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { StackGraph } from '../ui/StackGraph'

interface ExperienceTimelineProps {
  roles: Experience[]
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  // minmax(0, …) lets the scrollable stack map shrink with the viewport.
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-4">
      {roles.map((role, index) => {
        const isCurrent = role.period.end === 'present'

        return (
          <Reveal
            key={role.id}
            as="li"
            index={index}
            className="card card-hover p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label text-faint">
                {formatPeriod(role.period)}
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
                {role.employmentType}
              </p>
              {isCurrent ? (
                <span className="label inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-accent">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  Current
                </span>
              ) : (
                <span aria-hidden="true" className="font-mono text-xs text-faint">
                  {String(roles.length - index).padStart(2, '0')}
                </span>
              )}
            </div>

            <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              {role.company}
            </h3>
            <p className="mt-1 text-muted">{role.role}</p>

            <ul className="mt-6 grid gap-3 text-[15px] leading-relaxed text-muted sm:grid-cols-2 sm:gap-x-8">
              {role.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="relative pl-5 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2.5 before:bg-accent"
                >
                  {achievement}
                </li>
              ))}
            </ul>

            <StackGraph
              items={role.stack}
              label={`Stack map for ${role.company}`}
              className="mt-8"
            />
          </Reveal>
        )
      })}
    </ol>
  )
}
