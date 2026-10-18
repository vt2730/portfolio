import {
  CELL,
  LABEL_LEFT,
  LABEL_TOP,
  LEVELS,
  STEP,
  layoutYear,
} from '../../lib/contributions'
import { formatDate, formatNumber } from '../../lib/format'
import { findLink } from '../../lib/links'
import type {
  ContributionMix,
  ContributionYear,
  GitHubActivity as GitHubActivityData,
  Profile,
} from '../../types/portfolio'
import { Arrow } from '../ui/ButtonLink'
import { CountUp } from '../ui/CountUp'
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
    <div>
      {/* Summary as a drawing's title block. */}
      <Reveal className="tb note">
        <dl className="tb__cells">
          <div>
            <dt>Contributions</dt>
            <dd className="tb__val">
              <CountUp value={total} />
            </dd>
          </div>
          <div>
            <dt>Busiest year · {formatNumber(busiest.total)}</dt>
            <dd className="tb__val">{busiest.year}</dd>
          </div>
          <div>
            <dt>Since</dt>
            <dd className="tb__val">{first}</dd>
          </div>
        </dl>
        <p className="tb__cap">
          <span>Snapshot · {formatDate(capturedOn)}</span>
          {githubLink && (
            <a
              href={githubLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group note--accent"
            >
              GitHub <Arrow direction="out" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </p>
      </Reveal>

      <ol className="rows mt-[clamp(3rem,6vw,5rem)]">
        {years.map((year, index) => (
          <Reveal key={year.year} as="li" index={index % 2}>
            <YearRow year={year} capturedOn={capturedOn} />
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p aria-hidden="true" className="note flex items-center gap-1.5">
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
            className="group link font-medium"
          >
            Follow along on GitHub <Arrow direction="out" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </Reveal>
    </div>
  )
}

interface YearRowProps {
  year: ContributionYear
  capturedOn: string
}

function YearRow({ year, capturedOn }: YearRowProps) {
  const layout = layoutYear(year, capturedOn)
  const headingId = `github-${year.year}`
  const mix = MIX.filter((entry) => year.mix[entry.key] > 0)

  return (
    <article
      aria-labelledby={headingId}
      className="grid-12 gap-y-6 py-[clamp(1.5rem,3vw,2.5rem)]"
    >
      <header className="col-span-full lg:col-span-3">
        <h3 id={headingId} className="note">
          {year.year}
        </h3>
        <p className="h3 mt-2 tabular-nums">
          <CountUp value={year.total} duration={1200} />
          <span className="sr-only"> contributions</span>
        </p>

        <div className="mt-5 max-w-sm">
          <div
            aria-hidden="true"
            className="mix-bar flex h-1 gap-0.5 overflow-hidden"
          >
            {mix.map((entry) => (
              <span
                key={entry.key}
                className={`${entry.tone} h-full`}
                style={{ width: `${year.mix[entry.key]}%` }}
              />
            ))}
          </div>
          <dl className="note mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
            {mix.map((entry) => (
              <div key={entry.key} className="flex items-center gap-1.5">
                <dt className="flex items-center gap-1.5">
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

      <div className="col-span-full -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:col-[4/-1] lg:mx-0 lg:px-0">
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
