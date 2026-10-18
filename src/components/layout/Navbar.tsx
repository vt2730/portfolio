import { useMemo } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { resumeFileName } from '../../lib/links'
import type { NavItem, Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Monogram } from '../ui/Monogram'
import { AccentToggle, ThemeToggle } from '../ui/ThemeToggle'

interface NavbarProps {
  profile: Profile
  items: NavItem[]
  /** Opens the command palette, which is also the menu on narrow screens. */
  onOpenPalette: () => void
}

export function Navbar({ profile, items, onOpenPalette }: NavbarProps) {
  // `top` (the hero) is observed so no item stays highlighted above About.
  const sectionIds = useMemo(
    () => ['top', ...items.map((item) => item.id)],
    [items],
  )
  const activeId = useActiveSection(sectionIds)

  return (
    <header className="site-header wrap">
      <a href="#top" className="brand" aria-label={`${profile.name}, back to top`}>
        <Monogram plot />
        <span className="note note--ink whitespace-nowrap">
          {profile.name}
          <span className="brand__role text-muted"> / {profile.title}</span>
        </span>
      </a>

      <nav aria-label="Primary" className="nav">
        <ul>
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? 'true' : undefined}
                className="nav-link"
              >
                <span aria-hidden="true" className="note">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="nav-roll">
                  <span data-label={item.label}>{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="tools">
        <ThemeToggle />
        <AccentToggle />
        <button
          type="button"
          className="tool tool--text tool--kbd note note--ink"
          aria-label="Open command palette (⌘K)"
          onClick={onOpenPalette}
        >
          ⌘K
        </button>
        <button
          type="button"
          className="tool tool--text tool--menu note note--ink"
          aria-haspopup="dialog"
          onClick={onOpenPalette}
        >
          Menu
        </button>
        <ButtonLink
          href={profile.resumeUrl}
          download={resumeFileName(profile.name)}
          size="sm"
          arrow="down"
          className="header-cta ml-1"
        >
          Résumé
        </ButtonLink>
      </div>

      <div aria-hidden="true" className="hd-rule">
        <span className="hd-rule__fill">
          <span className="hd-rule__tag note" />
        </span>
      </div>
    </header>
  )
}
