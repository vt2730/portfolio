import {
  Fragment,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  getCareerStart,
  getCurrentRole,
  getPreviousRoles,
  yearsIn,
  yearsSince,
} from '../../lib/experience'
import { formatList, formatYearMonth, spellNumber } from '../../lib/format'
import type { Experience, Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { MaskWords } from '../ui/MaskWords'
import { HeroBlueprint } from './HeroBlueprint'
import { HeroTerrain } from './HeroTerrain'

interface HeroProps {
  profile: Profile
  experience: Experience[]
}

// The role line "generates" word by word after the name has drawn in.
const GENERATE_START = 1.1 // s
const WORD_IN = 0.5 // s, each word's fade

interface GeneratedWord {
  text: string
  delay: number
  /** Until the next word starts: how long the caret sits after this one. */
  hold: number
}

/** Typing rhythm: uneven gaps (deterministic, so prerender and hydration
 *  agree) and a pause after punctuation. */
function generate(sentence: string): GeneratedWord[] {
  const words = sentence.split(' ')
  const delays: number[] = []
  let time = GENERATE_START
  words.forEach((word, index) => {
    delays.push(time)
    time += 0.03 + ((index * 7 + 3) % 10) / 100 + (/[.,:]$/.test(word) ? 0.22 : 0)
  })
  return words.map((text, index) => ({
    text,
    delay: delays[index],
    hold: (delays[index + 1] ?? time) - delays[index],
  }))
}

function sentenceCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

const seconds = (value: number) => `${value.toFixed(2)}s`

export function Hero({ profile, experience }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const [terrain, setTerrain] = useState(false)
  const showTerrainNote = useCallback(() => setTerrain(true), [])
  const current = getCurrentRole(experience)
  const [previous] = getPreviousRoles(experience)
  const careerStart = getCareerStart(experience)
  const stack = current?.stack.slice(0, 4) ?? []

  const role = `${sentenceCase(profile.title)}${stack.length > 0 ? ` working with ${formatList(stack)}` : ''}.`
  const words = generate(role)
  const last = words[words.length - 1]
  const elapsed = Math.round((last.delay + WORD_IN - GENERATE_START) * 1000)
  // Notes and the footer row fade in as the last words land.
  const fade = (step: number) =>
    ({ '--fd': seconds(last.delay - 0.1 + step * 0.08) }) as CSSProperties

  const intro =
    profile.tagline ??
    [
      current && `Now at ${current.company}.`,
      previous &&
        `Before that, ${spellNumber(yearsIn(previous.period))} years at ${previous.company}`,
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/([^.])$/, '$1.')

  return (
    <section
      ref={heroRef}
      id="top"
      aria-labelledby="hero-heading"
      data-terrain={terrain ? '' : undefined}
      className="hero wrap"
    >
      <div className="hero__top note">
        <span>
          {profile.name} · {profile.title}
        </span>
        {current && (
          <span className="hidden md:inline">Currently · {current.company}</span>
        )}
        {careerStart && (
          <span suppressHydrationWarning>
            {yearsSince(careerStart)}+ years · since{' '}
            {formatYearMonth(careerStart)}
          </span>
        )}
      </div>

      <h1 id="hero-heading" className="hero__title">
        <span data-bp="h1.name" className="hero__human display">
          <MaskWords text={profile.name} />
        </span>
        <span className="sr-only">, </span>
        <span data-bp="h1.role" className="hero__machine h2">
          {/* Words are siblings so the caret rule can find the last one. */}
          {words.map((word, index) => (
            <Fragment key={`${word.text}-${index}`}>
              <span
                className="gen-word"
                style={
                  {
                    '--d': seconds(word.delay),
                    '--hold': seconds(word.hold),
                  } as CSSProperties
                }
              >
                {word.text}
              </span>
              {index < words.length - 1 && ' '}
            </Fragment>
          ))}
        </span>
      </h1>

      <div className="hero__notes" aria-hidden="true">
        <p className="note hero-fade" style={fade(0)}>
          <span className="note--accent">●</span> name · set by hand
        </p>
        <p className="note hero-fade" style={fade(1)}>
          <span className="note--accent">◆</span> role · generated from résumé
          data · {words.length} words · {elapsed} ms
        </p>
        {/* Shown once the terrain is live (data-terrain on the hero). */}
        <p className="note hero-fade hero__terrain" style={fade(2)}>
          <span className="note--accent">▲</span> terrain ·{' '}
          <span className="pointer-coarse:hidden">point</span>
          <span className="hidden pointer-coarse:inline">tap</span> anywhere to
          raise the ground
        </p>
      </div>

      <div className="hero__foot">
        <p data-bp="p.lead" className="hero__intro lead">
          <span className="hero-fade block" style={fade(2)}>
            {intro}
          </span>
        </p>
        <div data-bp="nav.cta">
          <div className="hero-fade flex flex-wrap gap-3" style={fade(3)}>
            <ButtonLink href="#contact" arrow="right">
              Get in touch
            </ButtonLink>
            <ButtonLink href="#projects" variant="ghost">
              See the work
            </ButtonLink>
          </div>
        </div>
      </div>

      <HeroTerrain heroRef={heroRef} onLive={showTerrainNote} />
      <HeroBlueprint heroRef={heroRef} />
    </section>
  )
}
