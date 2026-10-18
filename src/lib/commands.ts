import type { Command } from '../components/layout/CommandPalette'
import { toggleTheme } from '../hooks/useTheme'
import type { NavItem, Profile } from '../types/portfolio'
import { resumeFileName } from './links'
import { cycleAccent, toggleGrid } from './preferences'

const reducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scrolls to a section and moves focus there, like following its link. */
function goTo(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  history.replaceState(null, '', `#${id}`)
  target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

function download(href: string, fileName: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = fileName
  link.click()
}

/** Everything the ⌘K palette can do, built from the portfolio data. */
export function buildCommands(profile: Profile, navigation: NavItem[]): Command[] {
  return [
    { id: 'go-top', label: 'Top', group: 'Go to', hint: '00', run: () => goTo('top') },
    ...navigation.map((item, index) => ({
      id: `go-${item.id}`,
      label: item.label,
      group: 'Go to',
      hint: String(index + 1).padStart(2, '0'),
      run: () => goTo(item.id),
    })),
    {
      id: 'theme',
      label: 'Toggle light / dark theme',
      group: 'Actions',
      keywords: 'mode colour color',
      run: () => toggleTheme({ x: innerWidth / 2, y: innerHeight / 2 }),
    },
    {
      id: 'accent',
      label: 'Change accent colour',
      group: 'Actions',
      hint: 'blue · orange · lime',
      keywords: 'color theme',
      run: cycleAccent,
    },
    {
      id: 'grid',
      label: 'Toggle the layout grid',
      group: 'Actions',
      hint: '⌥G',
      keywords: 'columns overlay',
      run: toggleGrid,
    },
    {
      id: 'copy-email',
      label: 'Copy email address',
      group: 'Actions',
      hint: profile.email,
      feedback: 'Copied',
      keywords: 'contact clipboard',
      run: () => {
        void navigator.clipboard?.writeText(profile.email)
      },
    },
    {
      id: 'email',
      label: 'Send an email',
      group: 'Actions',
      hint: 'mailto',
      keywords: 'contact',
      run: () => {
        location.href = `mailto:${profile.email}`
      },
    },
    {
      id: 'resume',
      label: 'Download résumé',
      group: 'Actions',
      hint: 'PDF',
      keywords: 'cv resume',
      run: () => download(profile.resumeUrl, resumeFileName(profile.name)),
    },
    ...profile.links.map((link) => ({
      id: `link-${link.kind}`,
      label: link.label,
      group: 'Elsewhere',
      hint: new URL(link.href).hostname.replace(/^www\./, ''),
      run: () => {
        window.open(link.href, '_blank', 'noopener,noreferrer')
      },
    })),
  ]
}
