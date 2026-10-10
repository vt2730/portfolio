import type { SkillGroup } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'

interface SkillsProps {
  groups: SkillGroup[]
}

export function Skills({ groups }: SkillsProps) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {groups.map((group, index) => (
        <Reveal
          key={group.category}
          index={index}
          className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-baseline md:gap-8"
        >
          <dt className="display text-[clamp(1.5rem,3.2vw,2.5rem)] text-ink">
            {group.category}
          </dt>
          <dd>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-canvas px-3.5 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}
