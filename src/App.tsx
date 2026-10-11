import type { ReactNode } from 'react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { Section, type SectionTone } from './components/layout/Section'
import { SkipLink } from './components/layout/SkipLink'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { ExperienceTimeline } from './components/sections/ExperienceTimeline'
import { GitHubActivity } from './components/sections/GitHubActivity'
import { Hero } from './components/sections/Hero'
import { Highlights } from './components/sections/Highlights'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { portfolio } from './data/portfolio'
import { useReveal } from './hooks/useReveal'
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

interface SectionConfig {
  lead?: string
  tone?: SectionTone
  content: ReactNode
}

// Section order and titles come from `portfolio.navigation`.
const sections: Record<SectionId, SectionConfig> = {
  about: {
    lead: 'A quick read on where I am and where I have been.',
    content: (
      <About
        profile={profile}
        experience={experience}
        education={education}
        interests={interests}
      />
    ),
  },
  skills: {
    lead: 'The tools I reach for, grouped by what they are for.',
    content: <Skills groups={skills} />,
  },
  experience: {
    lead: 'Roles, what I shipped, and the stack behind each one.',
    content: <ExperienceTimeline roles={experience} />,
  },
  projects: {
    lead: 'Side projects built end to end, from schema to UI.',
    content: <Projects projects={projects} />,
  },
  highlights: {
    lead: 'The work I am most proud of, grouped by theme.',
    content: (
      <Highlights
        highlights={highlights}
        themes={highlightThemes}
        experience={experience}
      />
    ),
  },
  github: {
    lead: 'Four years of commits, pull requests and reviews, traced from my contribution graph.',
    content: <GitHubActivity activity={github} profile={profile} />,
  },
  contact: {
    lead: 'Open to conversations about front-end roles and interesting problems.',
    tone: 'grid',
    content: <Contact profile={profile} />,
  },
}

export default function App() {
  useReveal()

  return (
    <>
      <SkipLink />
      <Navbar profile={profile} items={navigation} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero profile={profile} experience={experience} />
        {navigation.map((item, index) => {
          const { lead, tone, content } = sections[item.id]
          return (
            <Section
              key={item.id}
              id={item.id}
              index={index + 1}
              title={item.label}
              lead={lead}
              tone={tone}
            >
              {content}
            </Section>
          )
        })}
      </main>
      <Footer name={profile.name} />
    </>
  )
}
