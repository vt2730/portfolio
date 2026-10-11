import {
  CELL,
  LABEL_LEFT,
  LABEL_TOP,
  LEVELS,
  STEP,
  layoutYear,
} from '../../lib/contributions'
import { formatDate } from '../../lib/format'
import { findLink } from '../../lib/links'
import type {
  ContributionMix,
  ContributionYear,
  GitHubActivity as GitHubActivityData,
  Profile,
} from '../../types/portfolio'
import { CountUp } from '../ui/CountUp'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

interface GitHubActivityProps {
  activity: GitHubActivityData
  profile: Profile
}

const WEEKDAYS = [
  { label: 'Mon', row: 1 },
  { label: 'Wed', row: 3 },
  { label: 'Fri', row: 5 },
]

const MIX: { key: keyof ContributionMix; label: string; tone: string }[] = [
  { key: 'commits', label: 'Commits', tone: 'bg-ink' },
  { key: 'pullRequests', label: 'Pull requests', tone: 'bg-ink/55' },
  { key: 'codeReview', label: 'Code review', tone: 'bg-ink/25' },
  { key: 'issues', label: 'Issues', tone: 'bg-ink/10' },
]

export function GitHubActivity({ activity, profile }: GitHubActivityProps) {
  const { years, capturedOn } = activity
  const total = years.reduce((sum, year) => sum + year.total, 0)
  const busiest = years.reduce((best, year) =>
    year.total > best.total ? year : best,
  )
  const first = Math.min(...years.map((year) => year.year))
  const githubLink = findLink(profile.links, 'github')

  return (
    <div className="grid gap-10">
      <Reveal className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-end">
        <p>
          <CountUp
            value={total}
            className="block font-mono text-[clamp(3rem,7vw,5rem)] font-medium tracking-tight text-ink tabular-nums"
          />
          <span className="mt-2 block text-[15px] text-muted">
            contributions on GitHub since {first}
          </span>
        </p>
        <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-xs sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
          <div>
            <dt className="label text-faint">Busiest year</dt>
            <dd className="mt-1.5 text-sm text-ink tabular-nums">
              {busiest.year} · <CountUp value={busiest.total} />
            </dd>
          </div>
          <div>
            <dt className="label text-faint">Snapshot</dt>
            <dd className="mt-1.5 text-sm text-ink">
              {formatDate(capturedOn)}
            </dd>
          </div>
        </dl>
      </Reveal>

      <ol className="grid gap-4">
        {years.map((year, index) => (
          <Reveal
            key={year.year}
            as="li"
            index={index}
            className="card p-5 sm:p-6"
          >
            <YearCard year={year} capturedOn={capturedOn} />
          </Reveal>
        ))}
      </ol>

      <Reveal className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p
          aria-hidden="true"
          className="flex items-center gap-1.5 font-mono text-xs text-faint"
        >
          Less
          {LEVELS.map((level) => (
            <span
              key={level}
              className={`heat-${level} mx-px inline-block size-2.5 rounded-[3px] bg-current`}
            />
          ))}
          More
        </p>
        {githubLink && (
          <a
            href={githubLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-[15px] font-medium text-muted underline decoration-line underline-offset-[5px] transition-colors duration-200 hover:text-ink hover:decoration-accent"
          >
            Follow along on GitHub
            <Icon name="arrow-up-right" className="nudge-out size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </Reveal>
    </div>
  )
}

interface YearCardProps {
  year: ContributionYear
  capturedOn: string
}

function YearCard({ year, capturedOn }: YearCardProps) {
  const layout = layoutYear(year, capturedOn)
  const headingId = `github-${year.year}`
  const mix = MIX.filter((entry) => year.mix[entry.key] > 0)

  return (
    <article aria-labelledby={headingId} className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="flex items-baseline gap-4">
          <h3 id={headingId} className="label text-faint">
            {year.year}
          </h3>
          <p className="font-mono text-[2rem] font-medium tracking-tight tabular-nums">
            <CountUp value={year.total} duration={1200} />
            <span className="sr-only"> contributions</span>
          </p>
        </div>

        <div className="w-full max-w-sm sm:w-80">
          <div
            aria-hidden="true"
            className="mix-bar flex h-1.5 gap-0.5 overflow-hidden rounded-full"
          >
            {mix.map((entry) => (
              <span
                key={entry.key}
                className={`${entry.tone} h-full`}
                style={{ width: `${year.mix[entry.key]}%` }}
              />
            ))}
          </div>
          <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            {mix.map((entry) => (
              <div key={entry.key} className="flex items-center gap-1.5">
                <dt className="flex items-center gap-1.5 text-faint">
                  <span
                    aria-hidden="true"
                    className={`${entry.tone} size-1.5 rounded-full`}
                  />
                  {entry.label}
                </dt>
                <dd className="text-ink tabular-nums">
                  {year.mix[entry.key]}%
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
        {/* `data-inview` sweeps the year in behind a scan line. */}
        <div data-inview="" className="heat-scan relative min-w-[36rem]">
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className="heatmap block h-auto w-full font-mono"
          >
            {layout.months.map((month) => (
              <text key={month.label} x={month.x} y={9}>
                {month.label}
              </text>
            ))}
            {WEEKDAYS.map((day) => (
              <text
                key={day.label}
                x={0}
                y={LABEL_TOP + day.row * STEP + CELL / 2 + 3.5}
                textLength={LABEL_LEFT - 8}
                lengthAdjust="spacingAndGlyphs"
              >
                {day.label}
              </text>
            ))}
            {LEVELS.map((level) =>
              layout.paths[level] ? (
                <path
                  key={level}
                  d={layout.paths[level]}
                  className={`heat-${level}`}
                />
              ) : null,
            )}
          </svg>
          <span aria-hidden="true" className="heat-scan-head" />
        </div>
      </div>
    </article>
  )
}
