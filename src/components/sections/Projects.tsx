import type { Project } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { StackList } from '../ui/StackList'
import { Tilt } from '../ui/Tilt'

interface ProjectsProps {
  projects: Project[]
}

// Typographic covers used until a project has a real screenshot.
const covers = [
  'from-[#ff7a59]/70 via-[#ff7a59]/20 to-transparent',
  'from-[#7c6fff]/70 via-[#7c6fff]/20 to-transparent',
  'from-[#2fb7a4]/70 via-[#2fb7a4]/20 to-transparent',
]

export function Projects({ projects }: ProjectsProps) {
  return (
    <ol className="grid gap-6">
      {projects.map((project, index) => {
        const number = String(index + 1).padStart(2, '0')
        const total = String(projects.length).padStart(2, '0')
        const primary = project.links.find((link) => link.kind === 'live')
        const others = project.links.filter((link) => link !== primary)

        return (
          <Reveal
            key={project.id}
            as="li"
            variant="scale"
            className="lift group overflow-hidden rounded-3xl border border-line bg-canvas"
          >
            <Tilt>
              <article
                aria-labelledby={`${project.id}-title`}
                className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              >
                <div
                  className={`relative min-h-56 overflow-hidden bg-linear-to-br ${covers[index % covers.length]}`}
                >
                  {project.image ? (
                    <img
                      src={project.image.src}
                      alt={project.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="display absolute right-4 bottom-2 text-[9rem] leading-none text-ink/10 transition-transform duration-700 ease-out-expo select-none group-hover:-translate-y-2 md:text-[12rem]"
                    >
                      {number}
                    </span>
                  )}
                  <p
                    aria-hidden="true"
                    className="absolute top-5 left-5 font-mono text-xs text-ink/70"
                  >
                    {number} / {total}
                  </p>
                </div>

                <div className="flex flex-col p-6 sm:p-8">
                  <h3
                    id={`${project.id}-title`}
                    className="display text-[clamp(1.75rem,3.5vw,2.5rem)]"
                  >
                    {project.name}
                  </h3>
                  <StackList
                    items={project.stack}
                    variant="chips"
                    label={`Technologies used in ${project.name}`}
                    className="mt-4"
                  />

                  <ul className="mt-6 space-y-2 text-[15px] leading-relaxed text-muted">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="relative pl-5 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2.5 before:bg-accent"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {project.links.length > 0 && (
                    <ul className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8 text-[15px]">
                      {primary && (
                        <li>
                          <a
                            href={primary.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas transition-colors duration-200 hover:bg-accent hover:text-white"
                          >
                            View project
                            <Icon name="arrow-up-right" className="size-4" />
                            <span className="sr-only">
                              {' '}
                              {project.name} (opens in a new tab)
                            </span>
                          </a>
                        </li>
                      )}
                      {others.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-muted underline decoration-line underline-offset-[5px] transition-colors duration-200 hover:text-ink hover:decoration-accent"
                          >
                            {link.label}
                            <Icon name="arrow-up-right" className="size-3.5" />
                            <span className="sr-only">
                              {' '}
                              for {project.name} (opens in a new tab)
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </Tilt>
          </Reveal>
        )
      })}
    </ol>
  )
}
