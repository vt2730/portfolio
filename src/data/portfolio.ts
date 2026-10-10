import type { Portfolio } from '../types/portfolio'
import { github } from './github'

// Source of truth: the resume in /public. Achievement text is kept verbatim.
// `null` marks information the resume does not provide — do not fill it in
// without confirmation.

export const portfolio: Portfolio = {
  profile: {
    name: 'Vikash Tiwary',
    title: 'Front-End Developer',
    tagline: null,
    summary: null,
    location: null,
    email: 'vikash.me2797@gmail.com',
    // TODO: rename to /resume.pdf once confirmed (CLAUDE.md expects that path).
    resumeUrl: `${import.meta.env.BASE_URL}vikash_res.pdf`,
    links: [
      {
        kind: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/vikashtiwary2797/',
      },
      // TODO: confirm — inferred from the project repository links on the resume.
      {
        kind: 'github',
        label: 'GitHub',
        href: 'https://github.com/vt2730',
      },
      {
        kind: 'leetcode',
        label: 'LeetCode',
        href: 'https://leetcode.com/u/savitor/',
      },
      {
        kind: 'hackerrank',
        label: 'HackerRank',
        href: 'https://www.hackerrank.com/profile/vikashtiwary2730',
      },
    ],
  },

  navigation: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'github', label: 'GitHub' },
    { id: 'contact', label: 'Contact' },
  ],

  experience: [
    {
      id: 'hashbyt',
      company: 'Hashbyt',
      role: 'Front-End Developer',
      employmentType: 'Full Time',
      period: { start: '2025-12', end: 'present' },
      stack: [
        'React',
        'TypeScript',
        'GraphQL',
        'Angular',
        'TanStack Query',
        'TanStack Router',
        'React Flow',
      ],
      achievements: [
        'Built an AI workflow project using React, TypeScript, GraphQL, TanStack Query & Router, and React Flow for an optimized node-based interface.',
        'Ramped up on Angular within 1 month, contributing directly to the AngularJS-to-Angular migration.',
      ],
    },
    {
      id: 'underscore',
      company: 'Underscore Technology Pvt. Ltd.',
      role: 'Front-End Developer',
      employmentType: 'Full Time',
      period: { start: '2021-08', end: '2025-11' },
      stack: [
        'JavaScript',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'Express.js',
        'MongoDB',
      ],
      achievements: [
        'Migrated codebase from Create React App to Next.js 13 (Pages Router) with full SSR support.',
        'Built a custom "No Internet" fallback using Service Workers for optimized offline experience.',
        'Created an Nx-based scaffolding template with Jest, Cypress e2e and Storybook, reducing dev time significantly.',
        'Reduced bundle size by replacing Redux with TanStack Query, Zustand and nuqs.',
        'Built a fully configurable Admin Dashboard driven by server-side configuration (SDUI).',
        'Integrated Sentry for Error and Performance Logging, cutting feature dev time by 15%.',
        'Improved Core Web Vitals (LCP, CLS, INP) on the booking page, enhancing flow by 65%.',
      ],
    },
  ],

  highlightThemes: {
    performance: 'Performance',
    architecture: 'Architecture & migrations',
    'dx-quality': 'Developer experience & quality',
    'interactive-ui': 'Interactive interfaces',
  },

  highlights: [
    {
      id: 'core-web-vitals',
      theme: 'performance',
      title: 'Core Web Vitals on the booking page',
      description: 'Improved LCP, CLS and INP on the booking page.',
      // TODO: confirm what the 65% measures — the resume says "enhancing flow".
      metric: { value: '65%', label: 'enhancement to booking flow' },
      experienceId: 'underscore',
    },
    {
      id: 'bundle-size',
      theme: 'performance',
      title: 'Leaner state management',
      description:
        'Reduced bundle size by replacing Redux with TanStack Query, Zustand and nuqs.',
      experienceId: 'underscore',
    },
    {
      id: 'offline-fallback',
      theme: 'performance',
      title: 'Offline experience',
      description: 'Built a custom "No Internet" fallback using Service Workers.',
      experienceId: 'underscore',
    },
    {
      id: 'nextjs-migration',
      theme: 'architecture',
      title: 'Create React App → Next.js 13',
      description:
        'Migrated the codebase to Next.js 13 (Pages Router) with full SSR support.',
      experienceId: 'underscore',
    },
    {
      id: 'angular-migration',
      theme: 'architecture',
      title: 'AngularJS → Angular',
      description:
        'Ramped up on Angular within 1 month, contributing directly to the AngularJS-to-Angular migration.',
      experienceId: 'hashbyt',
    },
    {
      id: 'sdui-dashboard',
      theme: 'architecture',
      title: 'Server-driven Admin Dashboard',
      description:
        'Built a fully configurable Admin Dashboard driven by server-side configuration (SDUI).',
      experienceId: 'underscore',
    },
    {
      id: 'nx-scaffolding',
      theme: 'dx-quality',
      title: 'Nx scaffolding template',
      description:
        'Created an Nx-based scaffolding template with Jest, Cypress e2e and Storybook, reducing dev time significantly.',
      experienceId: 'underscore',
    },
    {
      id: 'sentry',
      theme: 'dx-quality',
      title: 'Error and performance monitoring',
      description: 'Integrated Sentry for error and performance logging.',
      metric: { value: '15%', label: 'cut in feature dev time' },
      experienceId: 'underscore',
    },
    {
      id: 'ai-workflow',
      theme: 'interactive-ui',
      title: 'Node-based AI workflow interface',
      description:
        'Built an AI workflow project using React, TypeScript, GraphQL, TanStack Query & Router, and React Flow for an optimized node-based interface.',
      experienceId: 'hashbyt',
    },
  ],

  projects: [
    {
      id: 'drawing-tool-board',
      name: 'Drawing Tool Board',
      stack: ['Next.js', 'TypeScript', 'Prisma', 'Neon DB'],
      features: [
        'Interactive drawing canvas with multiple tools and colors.',
        'Real-time commenting on whiteboards.',
      ],
      links: [
        {
          kind: 'source',
          label: 'GitHub',
          href: 'https://github.com/vt2730/TL-Draw',
        },
        {
          kind: 'live',
          label: 'Live',
          href: 'https://tl-draw-ten.vercel.app/',
        },
      ],
    },
    {
      id: 'tweet-clone',
      name: 'Tweet Clone',
      stack: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Socket.io'],
      features: [
        'Tweet creation, liking, and profile editing with image upload.',
        'Real-time follow & comment notifications via Socket.io.',
      ],
      links: [
        {
          kind: 'source',
          label: 'GitHub',
          href: 'https://github.com/vt2730/tweetClone',
        },
        {
          kind: 'live',
          label: 'Live',
          href: 'https://tweet-clone-nine.vercel.app',
        },
      ],
    },
  ],

  // Grouped from the resume's skills section and the technologies named in
  // its experience and project entries.
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
    },
    {
      category: 'Frameworks',
      items: ['React', 'Next.js', 'Angular', 'Node.js', 'Express.js'],
    },
    {
      category: 'Data & State',
      items: [
        'GraphQL',
        'TanStack Query',
        'TanStack Router',
        'Redux',
        'Zustand',
        'nuqs',
      ],
    },
    {
      category: 'UI',
      items: ['Tailwind CSS', 'Material UI', 'React Flow'],
    },
    {
      category: 'Databases',
      items: ['MongoDB', 'Prisma', 'Neon DB'],
    },
    {
      category: 'Testing & Quality',
      items: ['Jest', 'Cypress', 'Storybook', 'Sentry'],
    },
    {
      category: 'Build & Platform',
      items: ['Webpack', 'Nx', 'Service Workers', 'Socket.io'],
    },
    {
      category: 'Tools',
      items: ['Git', 'GitHub Desktop', 'VS Code', 'Postman'],
    },
  ],

  education: [
    {
      institution: 'Chandigarh University',
      qualification: 'B.Tech in Computer Science',
      period: '2016–2020',
      grade: 'CGPA 7.28',
    },
    {
      institution: 'Baldwin High School',
      qualification: 'PCM with Physical Education',
      period: 'May 2015',
      grade: '85.6%',
    },
  ],

  interests: ['Playing chess'],

  github,
}
