import type {
  Experience,
  Highlight,
  HighlightTheme,
} from '../../types/portfolio'
import { CountUp } from '../ui/CountUp'
import { Reveal } from '../ui/Reveal'

/** Splits "65%" into a number to count and the text after it. */
function parseMetric(value: string): { amount: number; suffix: string } | null {
  const match = /^(\d+)(\D*)$/.exec(value)
  return match ? { amount: Number(match[1]), suffix: match[2] } : null
}

interface HighlightsProps {
  highlights: Highlight[]
  themes: Record<HighlightTheme, string>
  experience: Experience[]
}

export function Highlights({
  highlights,
  themes,
  experience,
}: HighlightsProps) {
  const companyById = new Map(experience.map((role) => [role.id, role.company]))
  const groups = (Object.keys(themes) as HighlightTheme[])
    .map((theme) => ({
      theme,
      label: themes[theme],
      items: highlights.filter((highlight) => highlight.theme === theme),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="space-y-14">
      {groups.map((group) => (
        <div key={group.theme}>
          <Reveal
            as="h3"
            className="flex items-center gap-3 font-mono text-xs tracking-wide text-muted uppercase"
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            {group.label}
          </Reveal>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {group.items.map((highlight, index) => (
              <Reveal
                key={highlight.id}
                as="li"
                index={index}
                className={`lift flex flex-col rounded-3xl border border-line p-6 ${
                  highlight.metric ? 'inverted' : 'bg-elevated/60'
                }`}
              >
                {highlight.metric && (
                  <p className="mb-6 flex items-baseline gap-2">
                    <MetricValue value={highlight.metric.value} />
                    <span className="text-sm text-muted">
                      {highlight.metric.label}
                    </span>
                  </p>
                )}
                <h4 className="text-lg font-semibold tracking-tight">
                  {highlight.title}
                </h4>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {highlight.description}
                </p>
                <p className="mt-auto pt-5 font-mono text-xs text-faint">
                  {companyById.get(highlight.experienceId)}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function MetricValue({ value }: { value: string }) {
  const className =
    'display text-[clamp(3rem,6vw,4.5rem)] text-accent tabular-nums'
  const parsed = parseMetric(value)
  return parsed ? (
    <CountUp
      value={parsed.amount}
      suffix={parsed.suffix}
      format={String}
      duration={1200}
      className={className}
    />
  ) : (
    <span className={className}>{value}</span>
  )
}
