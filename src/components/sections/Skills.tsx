import type { SkillGroup } from '../../types/portfolio'
import { Reveal } from '../ui/Reveal'

interface SkillsProps {
  groups: SkillGroup[]
}

const pad = (value: number) => String(value).padStart(2, '0')

export function Skills({ groups }: SkillsProps) {
  return (
    <ul className="rows">
      {groups.map((group, index) => (
        <Reveal key={group.category} as="li" index={index % 4}>
          <div className="row grid-12 items-baseline gap-y-2 py-[clamp(1.1rem,2vw,1.6rem)]">
            <span aria-hidden="true" className="note col-span-1">
              {pad(index + 1)}
            </span>
            <h3 className="note note--ink col-span-3 md:col-[2/span_3]">
              {group.category}
            </h3>
            <ul className="row-title lead col-span-full flex flex-wrap gap-x-3 md:col-[5/span_7]">
              {group.items.map((item, itemIndex) => (
                <li key={item}>
                  {item}
                  {itemIndex < group.items.length - 1 && (
                    <span aria-hidden="true" className="ml-3 text-line-strong">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <span
              aria-hidden="true"
              className="note hidden justify-self-end md:block md:col-[12]"
            >
              {pad(group.items.length)}
            </span>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
