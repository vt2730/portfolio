import type { CSSProperties } from 'react'
import { getCurrentRole, getPreviousRoles } from '../../lib/experience'
import { formatList } from '../../lib/format'
import { findLink, resumeFileName } from '../../lib/links'
import type { Experience, Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Magnetic } from '../ui/Magnetic'
import { TextLink } from '../ui/TextLink'
import { Typewriter } from '../ui/Typewriter'

interface HeroProps {
  profile: Profile
  experience: Experience[]
}

function withPeriod(text: string): string {
  return text.endsWith('.') ? text : `${text}.`
}

/**
 * Factual fallback until `profile.tagline` is provided. The eyebrow above
 * already shows the title and current company, so this line doesn't repeat it.
 */
function describeCareer(experience: Experience[]): string | null {
  const current = getCurrentRole(experience)
  const [previous] = getPreviousRoles(experience)

  const parts: string[] = []
  if (current) {
    parts.push(`Working with ${formatList(current.stack.slice(0, 4))}.`)
  }
  if (previous) parts.push(`Previously at ${withPeriod(previous.company)}`)
  return parts.length > 0 ? parts.join(' ') : null
}

function delay(ms: number): CSSProperties {
  return {
    '--rise-delay': `${ms}ms`,
    '--fade-delay': `${ms}ms`,
  } as CSSProperties
}

export function Hero({ profile, experience }: HeroProps) {
  const current = getCurrentRole(experience)
  const lead = profile.tagline ?? describeCareer(experience)
  const socialLinks = [
    findLink(profile.links, 'github'),
    findLink(profile.links, 'linkedin'),
  ].filter((link) => link !== undefined)
  const words = profile.name.split(' ')
  const eyebrow = current
    ? `${profile.title} / ${current.company}`
    : profile.title

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-32 pb-10 sm:pb-14"
    >
      {/* Colour wash behind the hero. */}
      <div
        aria-hidden="true"
        className="glow parallax-slow pointer-events-none absolute inset-0 -z-10"
      />

      <Container>
        <p className="flex items-center gap-2.5 font-mono text-xs tracking-wide text-muted uppercase sm:text-[13px]">
          <span className="fade-in relative flex size-2" style={delay(100)}>
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden"
            />
            <span
              aria-hidden="true"
              className="relative size-2 rounded-full bg-accent"
            />
          </span>
          {/* Typed out like a prompt; the caret shows for a beat first. */}
          <Typewriter
            text={eyebrow}
            label={
              current ? `${profile.title} at ${current.company}` : profile.title
            }
            delay={350}
          />
        </p>

        <h1
          id="hero-heading"
          className="display mt-8 text-[clamp(3.5rem,13vw,11rem)] uppercase"
        >
          <span className="sr-only">{profile.name}</span>
          {/* Each word rises from a mask and is wiped in left to right. The
              word stays one text node so the font's kerning is untouched. */}
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              aria-hidden="true"
              className="mask-line"
            >
              <span
                style={delay(index * 120)}
                className={`wipe ${index === words.length - 1 ? 'text-outline' : ''}`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-10 border-t border-line pt-8 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          {lead && (
            <p
              className="fade-in max-w-xl text-lg leading-relaxed text-muted text-pretty md:text-xl lg:col-span-6"
              style={delay(400)}
            >
              {lead}
            </p>
          )}

          <div
            className="fade-in flex flex-col gap-6 lg:col-span-6 lg:items-end"
            style={delay(500)}
          >
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <ButtonLink href="#contact" variant="accent">
                  Get in touch
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink
                  href={profile.resumeUrl}
                  download={resumeFileName(profile.name)}
                  variant="secondary"
                >
                  <Icon name="download" className="size-4" />
                  Download résumé
                </ButtonLink>
              </Magnetic>
            </div>
            {socialLinks.length > 0 && (
              <ul className="flex gap-6 text-[15px]">
                {socialLinks.map((link) => (
                  <li key={link.kind}>
                    <TextLink href={link.href} external>
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to the About section"
          className="fade-in absolute right-5 bottom-10 hidden size-24 place-items-center rounded-full text-faint transition-colors duration-200 hover:text-ink sm:right-8 lg:right-12 lg:grid"
          style={delay(1100)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="spin-slow absolute inset-0 size-full fill-current font-mono text-[10.5px] tracking-[0.3em] uppercase"
          >
            <defs>
              <path
                id="ring"
                d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0"
              />
            </defs>
            <text>
              <textPath href="#ring">scroll down · scroll down ·</textPath>
            </text>
          </svg>
          <Icon name="arrow-up" className="size-4 rotate-180" />
        </a>
      </Container>
    </section>
  )
}
