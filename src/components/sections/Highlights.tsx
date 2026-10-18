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
  // Grouped by theme, in the order the themes are listed.
  const ordered = (Object.keys(themes) as HighlightTheme[]).flatMap((theme) =>
    highlights.filter((highlight) => highlight.theme === theme),
  )

  return (
    <ul className="rows">
      {ordered.map((highlight, index) => (
        <Reveal key={highlight.id} as="li" index={index % 3}>
          <article
            aria-labelledby={`${highlight.id}-title`}
            className="row grid-12 items-baseline gap-y-3 py-[clamp(1.4rem,2.4vw,2rem)]"
          >
            <p className="note col-span-full md:col-span-2">
              {themes[highlight.theme]}
            </p>

            <div className="col-span-full md:col-[3/span_7]">
              <h3 id={`${highlight.id}-title`} className="row-title h3">
                {highlight.title}
              </h3>
              <p className="mt-3 max-w-[58ch] text-muted">
                {highlight.description}
              </p>
            </div>

            <div className="col-span-full flex flex-wrap items-baseline gap-x-3 gap-y-1 md:col-[10/-1] md:flex-col md:items-end md:text-right">
              {highlight.metric && (
                <p className="text-accent-text">
                  <MetricValue value={highlight.metric.value} />
                  <span className="note mt-1 block text-accent-text">
                    {highlight.metric.label}
                  </span>
                </p>
              )}
              <p className="note">{companyById.get(highlight.experienceId)}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
  )
}

function MetricValue({ value }: { value: string }) {
  const className = 'h3 block tabular-nums'
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
