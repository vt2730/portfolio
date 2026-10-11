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

const pill =
  'rounded-full border border-line bg-canvas/80 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl'

const navLink =
  'relative rounded-full px-3 py-1.5 text-sm text-muted transition-colors duration-200 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:bg-accent after:opacity-0 after:transition-opacity after:duration-200 hover:text-ink aria-current:text-ink aria-current:after:opacity-100'

/** "Vikash Tiwary" → bold first name, muted rest, like a wordmark. */
function Wordmark({ name }: { name: string }) {
  const [first, ...rest] = name.split(' ')
  return (
    <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
      {first}
      {rest.length > 0 && (
        <span className="font-normal text-muted"> {rest.join(' ')}.</span>
      )}
    </span>
  )
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

  // The wordmark sits in the middle of the desktop nav.
  const split = Math.ceil(items.length / 2)
  const leftItems = items.slice(0, split)
  const rightItems = items.slice(split)

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
      variant="accent"
      size="sm"
    >
      <Icon name="download" className="size-4" />
      Résumé
    </ButtonLink>
  )

  const renderItem = (item: NavItem) => (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        aria-current={activeId === item.id ? 'true' : undefined}
        className={navLink}
      >
        {item.label}
      </a>
    </li>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Reading progress — CSS scroll-driven, hidden where unsupported. */}
      <div
        aria-hidden="true"
        className="scroll-progress absolute inset-x-0 top-0 h-0.5 bg-accent"
      />

      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <div className="fade-in flex items-center justify-between gap-3 [--fade-delay:200ms] lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Mobile wordmark — on desktop it lives inside the nav pill. */}
          <a
            href="#top"
            className={`${pill} flex h-11 items-center px-4 lg:hidden`}
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark name={profile.name} />
          </a>

          <nav
            aria-label="Primary"
            className={`${pill} hidden h-11 items-center px-3 lg:col-start-2 lg:flex`}
          >
            <ul className="flex items-center gap-0.5">
              {leftItems.map(renderItem)}
              <li className="px-4">
                <a href="#top">
                  <Wordmark name={profile.name} />
                </a>
              </li>
              {rightItems.map(renderItem)}
            </ul>
          </nav>

          <div
            className={`${pill} flex h-11 items-center gap-1 pr-1 pl-1 lg:col-start-3 lg:justify-self-end lg:pr-1.5`}
          >
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
          className="mt-2 rounded-2xl border border-line bg-canvas/95 p-3 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.45)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Primary">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-lg text-muted transition-colors duration-150 hover:bg-surface hover:text-ink aria-current:text-ink"
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
          <div className="mt-2 border-t border-line px-3 pt-4 pb-1">
            {resumeLink}
          </div>
        </div>
      </div>
    </header>
  )
}
