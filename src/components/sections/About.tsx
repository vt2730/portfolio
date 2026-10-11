import type { ReactNode } from 'react'
import { getCurrentRole, getPreviousRoles } from '../../lib/experience'
import { formatList, formatPeriod, formatYearMonth } from '../../lib/format'
import type { Education, Experience, Profile } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'

interface AboutProps {
  profile: Profile
  experience: Experience[]
  education: Education[]
  interests: string[]
}

interface Fact {
  term: string
  detail: ReactNode
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

export function About({ profile, experience, education, interests }: AboutProps) {
  const current = getCurrentRole(experience)
  const previous = getPreviousRoles(experience)
  const paragraphs = profile.summary ?? describe(profile, experience)

  const candidates: (Fact | false | null | undefined | '')[] = [
    current && {
      term: 'Currently',
      detail: (
        <>
          {current.role}, {current.company}
          <Meta>Since {formatYearMonth(current.period.start)}</Meta>
        </>
      ),
    },
    previous.length > 0 && {
      term: 'Previously',
      detail: previous.map((role) => (
        <span key={role.id} className="block">
          {role.role}, {role.company}
          <Meta>{formatPeriod(role.period)}</Meta>
        </span>
      )),
    },
    profile.location && { term: 'Based in', detail: profile.location },
    education.length > 0 && {
      term: 'Education',
      detail: education.map((entry) => (
        <span key={entry.institution} className="block [&+&]:mt-3">
          {entry.qualification}, {entry.institution}
          <Meta>
            {entry.period}
            {entry.grade && ` · ${entry.grade}`}
          </Meta>
        </span>
      )),
    },
    interests.length > 0 && {
      term: 'Outside work',
      detail: interests.join(', '),
    },
  ]
  const facts = candidates.filter((fact): fact is Fact => Boolean(fact))

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <Reveal className="space-y-5 lg:col-span-7">
        {paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={
              index === 0
                ? 'text-[clamp(1.375rem,2.4vw,1.875rem)] leading-snug font-medium tracking-tight text-ink text-pretty'
                : 'text-lg leading-relaxed text-muted text-pretty'
            }
          >
            {paragraph}
          </p>
        ))}
      </Reveal>

      <dl className="grid gap-3 lg:col-span-5 lg:col-start-8">
        {facts.map((fact, index) => (
          <Reveal
            key={fact.term}
            index={index + 1}
            className="card grid gap-3 p-5 sm:grid-cols-[7rem_1fr] sm:gap-6"
          >
            <dt className="label pt-0.5 text-faint">{fact.term}</dt>
            <dd className="text-[15px] leading-relaxed">{fact.detail}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  )
}

function Meta({ children }: { children: ReactNode }) {
  return <span className="block text-sm text-faint">{children}</span>
}
