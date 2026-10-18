import {
  getCareerStart,
  getCurrentRole,
  getPreviousRoles,
  yearsSince,
} from '../../lib/experience'
import { formatList, formatPeriod } from '../../lib/format'
import type { Education, Experience, Profile } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'

interface AboutProps {
  profile: Profile
  experience: Experience[]
  education: Education[]
  interests: string[]
}

interface Stop {
  key: string
  when: string
  title: string
  detail: string
  current: boolean
}

/**
 * Factual statement built from the resume until `profile.summary` exists.
 * Every clause maps to a data point: title, current role and stack, prior role.
 */
function describe(profile: Profile, experience: Experience[]): string[] {
  const current = getCurrentRole(experience)
  const [previous] = getPreviousRoles(experience)
  const sentences: string[] = []

  if (current) {
    sentences.push(
      `${profile.title} at ${current.company}, working with ${formatList(current.stack.slice(0, 4))}.`,
    )
  }
  if (previous) {
    sentences.push(
      `Before that, ${formatPeriod(previous.period).replace(' – ', ' to ')} at ${previous.company}, shipping with ${formatList(previous.stack.slice(0, 3))}.`,
    )
  }
  return sentences
}

/** The three outlined lines, e.g. "5+ years / of front-end / with React." */
function manifesto(profile: Profile, experience: Experience[]): string[] {
  const start = getCareerStart(experience)
  // A tool used in every role, in the current role's order.
  const [constant] = experience[0]?.stack.filter((tool) =>
    experience.every((role) => role.stack.includes(tool)),
  ) ?? []
  if (!start) return [profile.title]
  return [
    `${yearsSince(start)}+ years`,
    'of front-end',
    constant ? `with ${constant}.` : 'and counting.',
  ]
}

// Annotations beside each line, as on a design spec.
const DIMENSIONS = ['↤ 12 col ↦', 'font-size: var(--step-4)', 'ls −0.05em']

export function About({ profile, experience, education, interests }: AboutProps) {
  const paragraphs = profile.summary ?? describe(profile, experience)
  const lines = manifesto(profile, experience)

  // Oldest first: school and university, then each role.
  const stops: Stop[] = [
    ...education.toReversed().map((entry) => ({
      key: entry.institution,
      when: entry.period,
      title: entry.institution,
      detail: [entry.qualification, entry.grade].filter(Boolean).join(' · '),
      current: false,
    })),
    ...experience.toReversed().map((role) => ({
      key: role.id,
      when: formatPeriod(role.period),
      title: role.company,
      detail: role.role,
      current: role.period.end === 'present',
    })),
  ]

  return (
    <>
      <div>
        {lines.map((line, index) => (
          <div key={line} className="wf-row">
            <p className="wf-line h1" suppressHydrationWarning={index === 0}>
              <span aria-hidden="true" className="outline-text">
                {line}
              </span>
              <span className="wf-solid">{line}</span>
            </p>
            <span aria-hidden="true" className="wf-dim note">
              {DIMENSIONS[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="grid-12 mt-[clamp(48px,7vw,112px)]">
        <Reveal className="col-span-full space-y-5 md:col-[7/-1]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="lead">
              {paragraph}
            </p>
          ))}
          {interests.length > 0 && (
            <p className="note pt-3">Outside work · {interests.join(', ')}</p>
          )}
        </Reveal>
      </div>

      <div className="mt-[clamp(64px,9vw,140px)]">
        <p className="note mb-[clamp(2rem,4vw,3.5rem)]">
          Path · {stops[0]?.when.slice(-4)} → now
        </p>
        <div aria-hidden="true" className="path-line" />
        <ol className="grid-12 gap-y-10 md:gap-y-0">
          {stops.map((stop, index) => (
            <Reveal
              key={stop.key}
              as="li"
              index={index}
              className="stop col-span-full md:col-span-3"
            >
              <span aria-hidden="true" className="stop__dot" />
              <span className="note block">
                {stop.current && <span className="note--accent">Now · </span>}
                {stop.when}
              </span>
              <h3 className="mt-2.5 mb-2 text-[length:var(--step-1)] tracking-[-0.02em]">
                {stop.title}
              </h3>
              <p className="max-w-[30ch] text-muted">{stop.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </>
  )
}
