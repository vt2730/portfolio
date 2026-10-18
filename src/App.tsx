import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CommandPalette } from './components/layout/CommandPalette'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { Preloader } from './components/layout/Preloader'
import { Section } from './components/layout/Section'
import { SkipLink } from './components/layout/SkipLink'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { ExperienceTimeline } from './components/sections/ExperienceTimeline'
import { GitHubActivity } from './components/sections/GitHubActivity'
import { Hero } from './components/sections/Hero'
import { Highlights } from './components/sections/Highlights'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { Cursor } from './components/ui/Cursor'
import { portfolio } from './data/portfolio'
import { useHotkeys } from './hooks/useHotkeys'
import { useReveal } from './hooks/useReveal'
import { buildCommands } from './lib/commands'
import { formatYearMonth } from './lib/format'
import { getCareerStart } from './lib/experience'
import { syncChrome } from './lib/preferences'
import type { SectionId } from './types/portfolio'

const {
  profile,
  navigation,
  experience,
  highlightThemes,
  highlights,
  projects,
  skills,
  education,
  interests,
  github,
} = portfolio

const careerStart = getCareerStart(experience)
const contributions = github.years.reduce((sum, year) => sum + year.total, 0)
const themeCount = new Set(highlights.map((highlight) => highlight.theme)).size
const toolCount = new Set(skills.flatMap((group) => group.items)).size

interface SectionConfig {
  /** Mono annotation on the right of the section's rule. */
  note?: string
  content: ReactNode
}

// Section order and titles come from `portfolio.navigation`.
const sections: Record<SectionId, SectionConfig> = {
  about: {
    note: careerStart ? `Front-end since ${formatYearMonth(careerStart)}` : undefined,
    content: (
      <About
        profile={profile}
        experience={experience}
        education={education}
        interests={interests}
      />
    ),
  },
  experience: {
    note: `${experience.length} roles · full time`,
    content: <ExperienceTimeline roles={experience} />,
  },
  projects: {
    note: 'Built end to end · source on GitHub',
    content: <Projects projects={projects} />,
  },
  highlights: {
    note: `${highlights.length} highlights · ${themeCount} themes`,
    content: (
      <Highlights
        highlights={highlights}
        themes={highlightThemes}
        experience={experience}
      />
    ),
  },
  skills: {
    note: `${toolCount} tools · ${skills.length} groups`,
    content: <Skills groups={skills} />,
  },
  github: {
    note: 'Traced from my contribution graph',
    content: <GitHubActivity activity={github} profile={profile} />,
  },
  contact: {
    note: 'Email is quickest',
    content: <Contact profile={profile} />,
  },
}

export default function App() {
  useReveal()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const togglePalette = useCallback(() => setPaletteOpen((open) => !open), [])
  const commands = useMemo(() => buildCommands(profile, navigation), [])
  useHotkeys(togglePalette)

  // Match the favicon and theme-color to the stored theme and accent.
  useEffect(syncChrome, [])

  return (
    <>
      <Preloader name={profile.name} title={profile.title} />
      <SkipLink />
      <Navbar
        profile={profile}
        items={navigation}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <main id="main" tabIndex={-1}>
        <Hero profile={profile} experience={experience} />
        {navigation.map((item, index) => {
          const { note, content } = sections[item.id]
          return (
            <Section
              key={item.id}
              id={item.id}
              index={index + 1}
              title={item.label}
              note={note}
            >
              {content}
            </Section>
          )
        })}
      </main>
      <Footer
        profile={profile}
        items={navigation}
        experience={experience}
        contributions={contributions}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
      />
      <div aria-hidden="true" className="grid-overlay">
        <div className="grid-12">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
      <Cursor />
    </>
  )
}
