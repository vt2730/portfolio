export type LinkKind =
  | 'email'
  | 'linkedin'
  | 'github'
  | 'leetcode'
  | 'hackerrank'
  | 'live'
  | 'source'
  | 'resume'

export interface ExternalLink {
  kind: LinkKind
  label: string
  href: string
}

export interface Profile {
  name: string
  /** Title exactly as it appears on the resume. */
  title: string
  /** Short positioning line for the hero. `null` until provided. */
  tagline: string | null
  /** About paragraphs. `null` until provided — the resume has no summary. */
  summary: string[] | null
  location: string | null
  email: string
  resumeUrl: string
  links: ExternalLink[]
}

type Month =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'

/** Month precision, formatted as `YYYY-MM`. */
export type YearMonth = `${number}-${Month}`

export interface DateRange {
  start: YearMonth
  end: YearMonth | 'present'
}

export type EmploymentType = 'Full Time'

export interface Experience {
  id: string
  company: string
  role: string
  employmentType: EmploymentType
  period: DateRange
  stack: string[]
  achievements: string[]
}

export type HighlightTheme =
  | 'performance'
  | 'architecture'
  | 'dx-quality'
  | 'interactive-ui'

export interface Metric {
  value: string
  label: string
}

export interface Highlight {
  id: string
  theme: HighlightTheme
  title: string
  description: string
  /** Only set when the metric is stated on the resume. */
  metric?: Metric
  /** Every highlight must trace back to a real role. */
  experienceId: Experience['id']
}

export interface ProjectImage {
  src: string
  alt: string
}

export interface Project {
  id: string
  name: string
  stack: string[]
  features: string[]
  links: ExternalLink[]
  image?: ProjectImage
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Education {
  institution: string
  qualification: string
  period: string
  grade?: string
}

/** Share of a year's contributions by type, as GitHub reports it. */
export interface ContributionMix {
  commits: number
  pullRequests: number
  codeReview: number
  issues: number
}

export interface ContributionYear {
  year: number
  /** Total contributions GitHub reported for the year. */
  total: number
  /**
   * One digit per day from January 1: GitHub's contribution intensity
   * (0 = none … 4 = most). See scripts/contributions/extract.mjs.
   */
  levels: string
  mix: ContributionMix
}

export interface GitHubActivity {
  /** ISO date the graphs were captured; later days are not shown. */
  capturedOn: `${number}-${Month}-${number}`
  years: ContributionYear[]
}

export type SectionId =
  | 'about'
  | 'experience'
  | 'highlights'
  | 'projects'
  | 'skills'
  | 'github'
  | 'contact'

export interface NavItem {
  id: SectionId
  label: string
}

export interface Portfolio {
  profile: Profile
  navigation: NavItem[]
  experience: Experience[]
  highlightThemes: Record<HighlightTheme, string>
  highlights: Highlight[]
  projects: Project[]
  skills: SkillGroup[]
  education: Education[]
  interests: string[]
  github: GitHubActivity
}
