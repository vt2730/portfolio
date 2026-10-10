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

/** Splits text into word spans so each can brighten as it scrolls into view. */
function ScrubText({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`}>{word} </span>
      ))}
    </>
  )
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
    <div className="grid gap-14">
      <div className="scrub-words max-w-3xl space-y-6 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] font-medium tracking-tight text-pretty">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="scrub-words">
            <ScrubText text={paragraph} />
          </p>
        ))}
      </div>

      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {facts.map((fact, index) => (
          <Reveal
            key={fact.term}
            index={index}
            className="rounded-3xl border border-line bg-elevated/60 p-6"
          >
            <dt className="font-mono text-xs text-faint">{fact.term}</dt>
            <dd className="mt-3 text-[15px] leading-relaxed">{fact.detail}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  )
}

function Meta({ children }: { children: ReactNode }) {
  return <span className="block text-sm text-faint">{children}</span>
}
