import { resumeFileName } from '../../lib/links'
import type { Profile } from '../../types/portfolio'
import { CopyButton } from '../ui/CopyButton'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { Typewriter } from '../ui/Typewriter'

interface ContactProps {
  profile: Profile
}

export function Contact({ profile }: ContactProps) {
  return (
    <div>
      <Reveal>
        <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          Email is the quickest way to reach me.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="display group mt-8 inline-block text-[clamp(1.5rem,4.5vw,3.5rem)] wrap-anywhere"
        >
          <span className="bg-linear-to-r from-accent to-accent bg-[length:0%_2px] bg-bottom-left bg-no-repeat pb-2 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_2px]">
            <Typewriter text={profile.email} speed={50} delay={400} onView />
          </span>
        </a>
        <div className="mt-6">
          <CopyButton value={profile.email} label="Copy email" />
        </div>
      </Reveal>

      <Reveal index={2}>
        <ul className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {profile.links.map((link) => (
            <li key={link.kind}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="lift flex items-center justify-between rounded-2xl border border-line px-5 py-4 text-[15px] font-medium transition-colors hover:border-accent"
              >
                {link.label}
                <Icon name="arrow-up-right" className="size-4 text-faint" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              download={resumeFileName(profile.name)}
              className="lift flex items-center justify-between rounded-2xl border border-line px-5 py-4 text-[15px] font-medium transition-colors hover:border-accent"
            >
              Résumé (PDF)
              <Icon name="download" className="size-4 text-faint" />
            </a>
          </li>
        </ul>
      </Reveal>
    </div>
  )
}
