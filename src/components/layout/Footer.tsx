import { getCareerStart, yearsSince } from '../../lib/experience'
import { resumeFileName } from '../../lib/links'
import type { Experience, NavItem, Profile } from '../../types/portfolio'
import { Arrow } from '../ui/ButtonLink'
import { CountUp } from '../ui/CountUp'

interface FooterProps {
  profile: Profile
  items: NavItem[]
  experience: Experience[]
  /** Total GitHub contributions, for the spec sheet. */
  contributions: number
}

export function Footer({ profile, items, experience, contributions }: FooterProps) {
  const careerStart = getCareerStart(experience)
  const specs: { term: string; value: number; suffix?: string }[] = [
    { term: 'Roles', value: experience.length },
    { term: 'Contributions', value: contributions },
  ]
  if (careerStart) {
    specs.unshift({ term: 'Years', value: yearsSince(careerStart), suffix: '+' })
  }

  return (
    <footer className="wrap relative overflow-clip pt-[var(--section)] pb-5">
      <div className="grid-12 gap-y-10 pb-[clamp(48px,8vw,120px)]">
        <p className="h3 col-span-full max-w-[18ch] md:col-span-6">
          Open to front-end roles and interesting problems.{' '}
          <a
            href={`mailto:${profile.email}`}
            className="link link--inline text-accent-text"
          >
            Let's talk.
          </a>
        </p>

        <nav aria-label="Footer" className="col-span-2 flex flex-col gap-3.5">
          <p className="note">Site</p>
          <ul className="flex flex-col gap-1.5">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 flex flex-col gap-3.5">
          <p className="note">Elsewhere</p>
          <ul className="flex flex-col gap-1.5">
            {profile.links.map((link) => (
              <li key={link.kind}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group link"
                >
                  {link.label} <Arrow direction="out" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 flex flex-col gap-3.5">
          <p className="note">Contact</p>
          <ul className="flex flex-col gap-1.5">
            <li>
              <a href={`mailto:${profile.email}`} className="link">
                Email
              </a>
            </li>
            <li>
              <a
                href={profile.resumeUrl}
                download={resumeFileName(profile.name)}
                className="group link"
              >
                Résumé <Arrow direction="down" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative">
        <p aria-hidden="true" className="footer-mark">
          {profile.name}
        </p>

        {/* Spec sheet in the style of a drawing's title block. */}
        <div className="tb note mt-8 min-[90rem]:absolute min-[90rem]:right-0 min-[90rem]:bottom-0 min-[90rem]:mt-0">
          <dl className="tb__cells">
            {specs.map((spec) => (
              <div key={spec.term}>
                <dt>{spec.term}</dt>
                <dd className="tb__val" suppressHydrationWarning>
                  <CountUp value={spec.value} suffix={spec.suffix} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="tb__cap">
            <span suppressHydrationWarning>
              Spec sheet · rev. {new Date().getFullYear()}
            </span>
            <a
              href={profile.resumeUrl}
              download={resumeFileName(profile.name)}
              className="group note--accent"
            >
              Résumé <Arrow direction="down" />
            </a>
          </p>
        </div>
      </div>

      <div className="note mt-5 flex flex-col gap-4 border-t border-line pt-4 md:flex-row md:flex-wrap md:justify-between">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {profile.name} · Built with React &amp;
          TypeScript
        </p>
        <p className="hidden pointer-fine:block">
          Press <kbd>⌥G</kbd> for the grid · <kbd>⌘K</kbd> for everything else
        </p>
        <a href="#top" className="group link self-start">
          Back to top <Arrow direction="up" />
        </a>
      </div>
    </footer>
  )
}
