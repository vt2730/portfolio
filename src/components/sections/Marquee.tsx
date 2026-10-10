import type { SkillGroup } from '../../types/portfolio'

interface MarqueeProps {
  groups: SkillGroup[]
}

/** Continuous ticker of the stack. Decorative — the Skills section is the accessible list. */
export function Marquee({ groups }: MarqueeProps) {
  const items = groups.flatMap((group) => group.items)
  const track = (
    <ul className="flex shrink-0 items-center gap-x-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-x-10">
          <span className="whitespace-nowrap">{item}</span>
          <span className="size-1.5 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line py-5 font-mono text-sm text-muted [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="marquee flex w-max">
        {track}
        {track}
      </div>
    </div>
  )
}
