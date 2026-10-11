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
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.theme}>
          <Reveal
            as="h3"
            className="label flex items-center gap-3 text-muted"
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            {group.label}
          </Reveal>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((highlight, index) => (
              <Reveal
                key={highlight.id}
                as="li"
                index={index}
                className="card card-hover flex flex-col p-6"
              >
                {highlight.metric && (
                  <p className="mb-5">
                    <MetricValue value={highlight.metric.value} />
                    <span className="mt-1 block text-sm text-muted">
                      {highlight.metric.label}
                    </span>
                  </p>
                )}
                <h4 className="text-[17px] font-semibold tracking-tight">
                  {highlight.title}
                </h4>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {highlight.description}
                </p>
                <p className="mt-auto pt-6">
                  <span
                    aria-hidden="true"
                    className="relative mb-3 block h-px w-full bg-line before:absolute before:top-0 before:left-0 before:h-px before:w-6 before:bg-accent"
                  />
                  <span className="label text-faint">
                    {companyById.get(highlight.experienceId)}
                  </span>
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
    'block font-mono text-5xl font-medium tracking-tight text-ink tabular-nums'
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
