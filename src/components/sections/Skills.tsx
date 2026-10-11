import type { SkillGroup } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'

interface SkillsProps {
  groups: SkillGroup[]
}

export function Skills({ groups }: SkillsProps) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => (
        <Reveal
          key={group.category}
          index={index}
          className="card card-hover p-5"
        >
          <dt className="label flex items-center gap-3 text-faint">
            <span aria-hidden="true" className="font-mono text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            {group.category}
          </dt>
          <dd className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="chip">
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
