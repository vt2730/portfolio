import type { Project } from '../../types/portfolio'
import { ButtonLink } from '../ui/ButtonLink'
import { Reveal } from '../ui/Reveal'
import { StackGraph } from '../ui/StackGraph'

interface ProjectsProps {
  projects: Project[]
}

const pad = (value: number) => String(value).padStart(2, '0')

export function Projects({ projects }: ProjectsProps) {
  return (
    <>
      <Reveal as="p" className="lead mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[40ch]">
        Side projects built end to end, from schema to UI. Each one is mapped
        by the stack it runs on.
      </Reveal>

      <ol className="grid gap-[clamp(4rem,9vw,8rem)]">
        {projects.map((project, index) => {
          const live = project.links.find((link) => link.kind === 'live')
          const others = project.links.filter((link) => link !== live)

          return (
            <Reveal key={project.id} as="li">
              <article
                aria-labelledby={`${project.id}-title`}
                className="grid-12 gap-y-8"
              >
                <div className="col-span-full flex flex-col lg:col-span-4">
                  <p aria-hidden="true" className="ws-count hidden lg:block">
                    {pad(index + 1)}
                    <span className="outline-text">/{pad(projects.length)}</span>
                  </p>

                  <div className="lg:mt-auto lg:pt-16">
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <span className="note">
                        {pad(index + 1)} / Side project
                      </span>
                      <span className="note text-right">
                        {project.stack.join(' · ')}
                      </span>
                    </div>
                    <h3
                      id={`${project.id}-title`}
                      className="h3 mt-4"
                    >
                      {project.name}
                    </h3>
                    <ul className="mt-4 max-w-[42ch] space-y-1 text-muted">
                      {project.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>

                    {project.links.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-3">
                        {live && (
                          <li>
                            <ButtonLink
                              href={live.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              arrow="out"
                            >
                              View project
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
                              variant="ghost"
                              arrow="out"
                            >
                              {link.kind === 'source' ? 'Source' : link.label}
                              <span className="sr-only">
                                {' '}
                                for {project.name} on {link.label} (opens in a
                                new tab)
                              </span>
                            </ButtonLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="ws-art col-span-full flex min-h-80 flex-col justify-between gap-6 p-4 sm:p-6 lg:col-[5/-1] lg:aspect-[8/5]">
                  <div aria-hidden="true" className="flex justify-between gap-4">
                    <span className="note note--accent">
                      fig. {pad(index + 1)} · stack map
                    </span>
                    <span className="note">
                      {project.stack.length} tools
                    </span>
                  </div>
                  <StackGraph
                    items={project.stack}
                    label={`Stack map for ${project.name}`}
                  />
                </div>
              </article>
            </Reveal>
          )
        })}
      </ol>
    </>
  )
}
