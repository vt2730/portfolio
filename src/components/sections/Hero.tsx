import type { CSSProperties, ReactNode } from 'react'
import {
  getCareerStart,
  getCurrentRole,
  getPreviousRoles,
  yearsSince,
} from '../../lib/experience'
import { formatYearMonth } from '../../lib/format'
import { findLink, resumeFileName } from '../../lib/links'
import type { Experience, Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { Icon, type IconName } from '../ui/Icon'
import { SignalGrid } from '../ui/SignalGrid'

interface HeroProps {
  profile: Profile
  experience: Experience[]
}

interface MetaItem {
  term: string
  detail: string
}

function delay(ms: number): CSSProperties {
  return {
    '--rise-delay': `${ms}ms`,
    '--fade-delay': `${ms}ms`,
  } as CSSProperties
}

/** `[a, b, c]` → `a, b and c`, with each item emphasised. */
function joinEmphasised(items: string[]): ReactNode {
  return items.map((item, index) => (
    <span key={item}>
      {index > 0 && (index === items.length - 1 ? ' and ' : ', ')}
      <strong className="font-medium text-ink">{item}</strong>
    </span>
  ))
}

export function Hero({ profile, experience }: HeroProps) {
  const current = getCurrentRole(experience)
  const [previous] = getPreviousRoles(experience)
  const careerStart = getCareerStart(experience)
  const stack = current?.stack.slice(0, 4) ?? []
  const words = profile.name.split(' ')

  const socialLinks = (['github', 'linkedin'] as const)
    .map((kind) => findLink(profile.links, kind))
    .filter((link) => link !== undefined)

  // Every cell maps to a resume fact; years are derived from the role dates.
  const meta: MetaItem[] = [
    { term: 'Role', detail: profile.title },
    ...(careerStart
      ? [
          {
            term: 'Experience',
            detail: `${yearsSince(careerStart)}+ years · since ${formatYearMonth(careerStart)}`,
          },
        ]
      : []),
    ...(current ? [{ term: 'Currently', detail: current.company }] : []),
    ...(stack.length > 0 ? [{ term: 'Stack', detail: stack.join(' · ') }] : []),
  ]

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh flex-col justify-center pt-28 pb-12 md:pt-32"
    >
      <SignalGrid intro />

      <Container>
        {current && (
          <p
            className="label fade-in inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 py-1.5 pr-3.5 pl-3 text-muted"
            style={delay(0)}
          >
            <span className="relative flex size-2">
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden"
              />
              <span
                aria-hidden="true"
                className="relative size-2 rounded-full bg-accent"
              />
            </span>
            {profile.title} at {current.company}
          </p>
        )}

        <h1
          id="hero-heading"
          className="display mt-8 text-[clamp(3rem,8vw,6.5rem)]"
        >
          <span className="sr-only">{profile.name}</span>
          {/* Each word rises from a mask; the words stay on one line where
              they fit so the name reads as a wordmark. */}
          <span aria-hidden="true" className="flex flex-wrap gap-x-[0.25em]">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="mask-line">
                <span style={delay(100 + index * 90)}>{word}</span>
              </span>
            ))}
          </span>
        </h1>

        <p
          className="fade-in mt-6 max-w-2xl text-xl leading-snug text-muted text-pretty md:text-2xl"
          style={delay(350)}
        >
          {profile.tagline ?? (
            <>
              {profile.title}
              {stack.length > 0 && <> working with {joinEmphasised(stack)}</>}.
              {previous && (
                <>
                  {' '}
                  Previously at{' '}
                  <strong className="font-medium text-ink">
                    {previous.company}
                  </strong>
                  {previous.company.endsWith('.') ? '' : '.'}
                </>
              )}
            </>
          )}
        </p>

        <div
          className="fade-in mt-10 flex flex-wrap items-center gap-3"
          style={delay(450)}
        >
          <ButtonLink href="#projects" variant="accent">
            View projects
            <Icon name="arrow-down" className="nudge-down size-4" />
          </ButtonLink>
          <ButtonLink
            href={profile.resumeUrl}
            download={resumeFileName(profile.name)}
            variant="secondary"
          >
            <Icon name="download" className="nudge-down size-4" />
            Download résumé
          </ButtonLink>
          {socialLinks.length > 0 && (
            <ul className="flex gap-2 sm:ml-2">
              {socialLinks.map((link) => (
                <li key={link.kind}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
                  >
                    <Icon name={link.kind as IconName} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <dl
          className="fade-in rule-draw relative mt-16 grid grid-cols-2 gap-x-6 gap-y-6 pt-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line md:mt-24 md:grid-cols-4"
          style={delay(600)}
        >
          {meta.map((item) => (
            <div key={item.term}>
              <dt className="label text-faint">{item.term}</dt>
              <dd
                className="mt-2 text-sm leading-relaxed text-ink"
                suppressHydrationWarning
              >
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
