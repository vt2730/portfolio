/**
 * How the tools on the resume relate to each other, used by <StackGraph /> to
 * draw a role's or project's stack as connected nodes.
 *
 * Edges describe generic, well-known relationships between the tools
 * themselves (TanStack Query fetches from GraphQL, Prisma talks to a
 * database). They are not claims about how a specific system was built.
 */

export type StackLayer =
  | 'language'
  | 'framework'
  | 'state'
  | 'ui'
  | 'api'
  | 'backend'
  | 'database'
  | 'platform'
  | 'quality'
  | 'tools'

/** Left-to-right column order in the diagram. */
export const layerOrder: StackLayer[] = [
  'language',
  'framework',
  'state',
  'ui',
  'api',
  'backend',
  'database',
  'platform',
  'quality',
  'tools',
]

export const layerLabels: Record<StackLayer, string> = {
  language: 'Language',
  framework: 'Framework',
  state: 'State',
  ui: 'UI',
  api: 'API',
  backend: 'Backend',
  database: 'Database',
  platform: 'Platform',
  quality: 'Quality',
  tools: 'Tools',
}

export const toolLayers: Record<string, StackLayer> = {
  JavaScript: 'language',
  TypeScript: 'language',
  HTML5: 'language',
  CSS3: 'language',
  React: 'framework',
  'Next.js': 'framework',
  Angular: 'framework',
  'TanStack Query': 'state',
  'TanStack Router': 'state',
  Redux: 'state',
  Zustand: 'state',
  nuqs: 'state',
  'React Flow': 'ui',
  'Tailwind CSS': 'ui',
  'Material UI': 'ui',
  GraphQL: 'api',
  'Socket.io': 'api',
  'Node.js': 'backend',
  'Express.js': 'backend',
  Prisma: 'backend',
  MongoDB: 'database',
  'Neon DB': 'database',
  Webpack: 'platform',
  Nx: 'platform',
  'Service Workers': 'platform',
  Jest: 'quality',
  Cypress: 'quality',
  Storybook: 'quality',
  Sentry: 'quality',
  Git: 'tools',
  'GitHub Desktop': 'tools',
  'VS Code': 'tools',
  Postman: 'tools',
}

/** Undirected pairs; the diagram orients them by column. */
export const toolEdges: [string, string][] = [
  ['JavaScript', 'React'],
  ['JavaScript', 'Node.js'],
  ['TypeScript', 'React'],
  ['TypeScript', 'Next.js'],
  ['TypeScript', 'Angular'],
  ['TypeScript', 'Node.js'],
  ['React', 'Next.js'],
  ['React', 'TanStack Query'],
  ['React', 'TanStack Router'],
  ['React', 'Redux'],
  ['React', 'Zustand'],
  ['React', 'React Flow'],
  ['React', 'Tailwind CSS'],
  ['React', 'Material UI'],
  ['Next.js', 'nuqs'],
  ['Next.js', 'Prisma'],
  ['Next.js', 'Socket.io'],
  ['Next.js', 'Service Workers'],
  ['TanStack Query', 'GraphQL'],
  ['Node.js', 'Express.js'],
  ['Node.js', 'Socket.io'],
  ['Express.js', 'MongoDB'],
  ['Prisma', 'MongoDB'],
  ['Prisma', 'Neon DB'],
  ['Webpack', 'React'],
  ['Nx', 'Jest'],
  ['Nx', 'Cypress'],
  ['Nx', 'Storybook'],
  ['Sentry', 'Next.js'],
]
