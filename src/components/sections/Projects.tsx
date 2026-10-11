import type { Project } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { StackGraph } from '../ui/StackGraph'

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  // minmax(0, …) lets the scrollable stack map shrink with the viewport.
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-4">
      {projects.map((project, index) => {
        const number = String(index + 1).padStart(2, '0')
        const primary = project.links.find((link) => link.kind === 'live')
        const others = project.links.filter((link) => link !== primary)

        return (
          <Reveal
            key={project.id}
            as="li"
            index={index}
            className="card card-hover p-6 sm:p-8"
          >
            <article
              aria-labelledby={`${project.id}-title`}
              className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12"
            >
              <div className="flex flex-col">
                <p
                  aria-hidden="true"
                  className="label flex items-center gap-3 text-faint"
                >
                  <span className="text-accent">{number}</span>
                  <span className="draw-x h-px flex-1 bg-line" />
                </p>
                <h3
                  id={`${project.id}-title`}
                  className="mt-5 text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
                >
                  {project.name}
                </h3>
                {project.links.length > 0 && (
                  <ul className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                    {primary && (
                      <li>
                        <ButtonLink
                          href={primary.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="primary"
                          size="sm"
                        >
                          View project
                          <Icon
                            name="arrow-up-right"
                            className="nudge-out size-4"
                          />
                          <span className="sr-only">
                            {' '}
                            {project.name} (opens in a new tab)
                          </span>
                        </ButtonLink>
                      </li>
                    )}
                    {others.map((link) => (
                      <li key={link.href}>
                        <ButtonLink
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="secondary"
                          size="sm"
                        >
                          {link.kind === 'source' && (
                            <Icon name="github" className="size-4" />
                          )}
                          {link.label}
                          <Icon
                            name="arrow-up-right"
                            className="nudge-out size-3.5"
                          />
                          <span className="sr-only">
                            {' '}
                            for {project.name} (opens in a new tab)
                          </span>
                        </ButtonLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-lg border border-line bg-canvas p-5 sm:p-6">
                {project.image ? (
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="mb-5 w-full rounded-md border border-line"
                  />
                ) : null}
                <p className="label text-faint">What it does</p>
                <ol className="mt-4 grid gap-4">
                  {project.features.map((feature, featureIndex) => (
                    <li
                      key={feature}
                      className="grid grid-cols-[2rem_1fr] text-[15px] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-1 font-mono text-xs text-accent"
                      >
                        {String(featureIndex + 1).padStart(2, '0')}
                      </span>
                      {feature}
                    </li>
                  ))}
                </ol>
              </div>

              <StackGraph
                items={project.stack}
                label={`Stack map for ${project.name}`}
                className="md:col-span-2"
              />
            </article>
          </Reveal>
        )
      })}
    </ol>
  )
}
