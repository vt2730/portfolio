import { formatPeriod } from '../../lib/format'
import type { Experience } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'
import { StackList } from '../ui/StackList'

interface ExperienceTimelineProps {
  roles: Experience[]
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <ol className="grid gap-6">
      {roles.map((role, index) => {
        const isCurrent = role.period.end === 'present'

        return (
          <Reveal
            key={role.id}
            as="li"
            variant="scale"
            className="lift rounded-3xl border border-line bg-elevated/60 p-6 sm:p-8 md:p-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs text-faint">
                {formatPeriod(role.period)}
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
                {role.employmentType}
              </p>
              {isCurrent ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-accent uppercase">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  Current
                </span>
              ) : (
                <span aria-hidden="true" className="font-mono text-xs text-faint">
                  {String(roles.length - index).padStart(2, '0')}
                </span>
              )}
            </div>

            <h3 className="display mt-6 text-[clamp(1.75rem,4vw,2.75rem)]">
              {role.company}
            </h3>
            <p className="mt-2 text-lg text-muted">{role.role}</p>

            <ul className="mt-8 grid gap-3 text-[15px] leading-relaxed text-muted sm:grid-cols-2 sm:gap-x-8">
              {role.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="relative pl-5 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2.5 before:bg-accent"
                >
                  {achievement}
                </li>
              ))}
            </ul>

            <StackList
              items={role.stack}
              variant="chips"
              label={`Technologies used at ${role.company}`}
              className="mt-8"
            />
          </Reveal>
        )
      })}
    </ol>
  )
}
