# Portfolio Project

## Purpose

This repository contains my personal developer portfolio.

The portfolio should present me as an experienced frontend engineer and should be suitable for recruiters, hiring managers, engineering managers, and other developers.

## Source of Truth

`public/resume.pdf` is the primary source of truth for my professional information.

Never invent:

* Companies
* Job titles
* Years of experience
* Technologies
* Projects
* Responsibilities
* Achievements
* Metrics
* Education
* Certifications

When information is not available in the resume, use a placeholder or ask for the information instead of making it up.

## Technical Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Modern CSS
* ESLint
* Prettier

Use lightweight dependencies and avoid adding libraries unless they provide meaningful value.

## Architecture

Prefer:

* Reusable React components
* Data-driven portfolio sections
* Strong TypeScript typing
* Small, focused components
* Semantic HTML
* Accessible interactions
* Responsive layouts
* Minimal duplication

Professional portfolio content should live separately from presentation components.

For example:

`src/data/portfolio.ts`

should contain structured content while components should focus primarily on rendering that content.

## Portfolio Sections

The initial website should support:

1. Hero
2. About
3. Skills / Technologies
4. Experience
5. Selected Projects
6. Engineering Highlights
7. Contact
8. Resume download

The final structure can change if the resume suggests a better presentation.

## Design Direction

Create a premium, modern developer portfolio.

The design should feel:

* Minimal
* Technical
* Sophisticated
* Professional
* Fast
* Responsive

Avoid generic "AI-generated portfolio" aesthetics.

Avoid excessive:

* Gradients
* Glassmorphism
* Huge animations
* Floating UI elements
* Unnecessary 3D effects
* Decorative components that reduce readability

Visual hierarchy and typography should do most of the work.

## Performance

Performance is a first-class requirement.

Prefer:

* Minimal JavaScript
* Optimized images
* Lazy loading where appropriate
* No unnecessary dependencies
* Avoiding excessive animation
* Efficient component rendering
* Good Core Web Vitals
* Accessible semantic markup

## Accessibility

The website must:

* Work with keyboard navigation
* Have visible focus states
* Use semantic HTML
* Have appropriate heading hierarchy
* Have accessible buttons and links
* Provide meaningful image alt text
* Maintain sufficient contrast

## SEO

Include:

* Proper page title
* Meta description
* Open Graph metadata where appropriate
* Semantic HTML
* Appropriate heading structure
* `robots.txt`
* Sitemap when appropriate

## Development Rules

Before making significant changes:

1. Inspect the existing project structure.
2. Understand the current implementation.
3. Reuse existing components where appropriate.
4. Do not introduce unnecessary abstractions.
5. Keep changes incremental.
6. Run type-checking/linting/build after meaningful changes.

Do not rewrite large parts of the application unnecessarily.

## Important Workflow

When implementing the portfolio:

1. Analyze the resume.
2. Extract professional information.
3. Create structured portfolio data.
4. Identify gaps or ambiguous information.
5. Propose the information architecture.
6. Implement the visual design.
7. Implement responsive behavior.
8. Validate accessibility.
9. Validate performance.
10. Run the production build.

Do not invent resume information to make the portfolio appear more impressive.
