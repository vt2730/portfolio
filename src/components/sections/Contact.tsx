import { resumeFileName } from '../../lib/links'
import type { Profile } from '../../types/portfolio'
import { CopyButton } from '../ui/CopyButton'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

interface ContactProps {
  profile: Profile
}

const tile =
  'group card card-hover flex items-center justify-between px-5 py-4 text-[15px] font-medium'

export function Contact({ profile }: ContactProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <Reveal className="lg:col-span-7">
        <p className="text-lg leading-relaxed text-muted">
          Email is the quickest way to reach me.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="display group mt-6 inline-block text-[clamp(1.5rem,4vw,3rem)] wrap-anywhere"
        >
          <span className="bg-linear-to-r from-accent to-accent bg-[length:0%_2px] bg-bottom-left bg-no-repeat pb-1.5 transition-[background-size] duration-400 ease-out-expo group-hover:bg-[length:100%_2px] motion-reduce:transition-none">
            {profile.email}
          </span>
        </a>
        <div className="mt-6">
          <CopyButton value={profile.email} label="Copy email" />
        </div>
      </Reveal>

      <Reveal index={2} className="lg:col-span-4 lg:col-start-9">
        <ul className="grid gap-2">
          {profile.links.map((link) => (
            <li key={link.kind}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={tile}
              >
                {link.label}
                <Icon
                  name="arrow-up-right"
                  className="nudge-out size-4 text-faint"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              download={resumeFileName(profile.name)}
              className={tile}
            >
              Résumé (PDF)
              <Icon name="download" className="nudge-down size-4 text-faint" />
            </a>
          </li>
        </ul>
      </Reveal>
    </div>
  )
}
