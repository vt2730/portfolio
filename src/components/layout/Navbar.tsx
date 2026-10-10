import { useEffect, useMemo, useRef, useState } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { resumeFileName } from '../../lib/links'
import type { NavItem, Profile } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Icon } from '../ui/Icon'
import { ThemeToggle } from '../ui/ThemeToggle'

interface NavbarProps {
  profile: Profile
  items: NavItem[]
}

const DESKTOP_QUERY = '(min-width: 1024px)'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function Navbar({ profile, items }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  // `top` (the hero) is observed so no item stays highlighted above About.
  const sectionIds = useMemo(
    () => ['top', ...items.map((item) => item.id)],
    [items],
  )
  const activeId = useActiveSection(sectionIds)

  // Close the mobile menu on Escape or when the layout switches to desktop.
  useEffect(() => {
    if (!menuOpen) return
    const query = matchMedia(DESKTOP_QUERY)
    const close = () => setMenuOpen(false)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      menuButtonRef.current?.focus()
    }
    const onQueryChange = (event: MediaQueryListEvent) => {
      if (event.matches) close()
    }
    document.addEventListener('keydown', onKeyDown)
    query.addEventListener('change', onQueryChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      query.removeEventListener('change', onQueryChange)
    }
  }, [menuOpen])

  const resumeLink = (
    <ButtonLink
      href={profile.resumeUrl}
      download={resumeFileName(profile.name)}
      variant="primary"
      size="sm"
    >
      <Icon name="download" className="size-4" />
      Résumé
    </ButtonLink>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Reading progress — CSS scroll-driven, hidden where unsupported. */}
      <div
        aria-hidden="true"
        className="scroll-progress absolute inset-x-0 top-0 h-0.5 bg-accent"
      />

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="fade-in flex items-center justify-between gap-3 rounded-full border border-line bg-canvas/75 py-2 pr-2 pl-4 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl [--fade-delay:200ms] supports-backdrop-filter:bg-canvas/60">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center rounded-full bg-accent font-mono text-[11px] font-semibold text-white"
            >
              {initials(profile.name)}
            </span>
            <span className="hidden sm:inline">{profile.name}</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:bg-surface hover:text-ink aria-current:bg-surface aria-current:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="hidden lg:block">{resumeLink}</div>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="size-5" />
              <span className="sr-only">
                {menuOpen ? 'Close menu' : 'Open menu'}
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className="mt-2 rounded-3xl border border-line bg-canvas/90 p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Primary">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-3 py-3 text-lg text-muted transition-colors duration-150 hover:bg-surface hover:text-ink aria-current:text-ink"
                  >
                    {item.label}
                    {activeId === item.id && (
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-accent"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 border-t border-line px-3 pt-4">{resumeLink}</div>
        </div>
      </div>
    </header>
  )
}
