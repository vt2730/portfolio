import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { portfolio } from './data/portfolio'
import { getCurrentRole } from './lib/experience'

// Build-time only: used by scripts/prerender.mjs to produce static HTML.

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export function structuredData(): string {
  const { profile, experience } = portfolio
  const current = getCurrentRole(experience)

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    ...(current && {
      worksFor: { '@type': 'Organization', name: current.company },
    }),
    sameAs: profile.links.map((link) => link.href),
  }

  // Escape `<` so the JSON can't close the surrounding <script> tag.
  return JSON.stringify(person).replace(/</g, '\\u003c')
}
