import { resumeFileName } from '../../lib/links'
import type { Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { CopyButton } from '../ui/CopyButton'
import { MaskWords } from '../ui/MaskWords'
import { Reveal } from '../ui/Reveal'

interface ContactProps {
  profile: Profile
}

export function Contact({ profile }: ContactProps) {
  return (
    <>
      <Reveal variant="lines" as="p" className="display max-w-[11ch]">
        <MaskWords text="Let's talk." />
      </Reveal>

      <Reveal className="mt-[clamp(2rem,4vw,3.5rem)] grid-12 gap-y-8">
        <p className="lead col-span-full text-muted md:col-span-6">
          Open to conversations about front-end roles and interesting
          problems. Email is the quickest way to reach me:{' '}
          <a
            href={`mailto:${profile.email}`}
            className="link link--inline text-ink wrap-anywhere"
          >
            {profile.email}
          </a>
        </p>
      </Reveal>

      <Reveal className="mt-[clamp(2rem,4vw,3.5rem)] flex flex-wrap gap-3">
        <ButtonLink href={`mailto:${profile.email}`} arrow="out">
          Email me
        </ButtonLink>
        <CopyButton value={profile.email} label="Copy email" />
        <ButtonLink
          href={profile.resumeUrl}
          download={resumeFileName(profile.name)}
          variant="ghost"
          arrow="down"
        >
          Download résumé
        </ButtonLink>
      </Reveal>
    </>
  )
}
