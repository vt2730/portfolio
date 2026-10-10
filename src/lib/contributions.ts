import type { ContributionYear } from '../types/portfolio'

/** Grid geometry in SVG units — GitHub's own proportions. */
export const CELL = 10
export const GAP = 3
export const STEP = CELL + GAP
/** Room reserved for the month row and the weekday column. */
export const LABEL_TOP = 18
export const LABEL_LEFT = 30
export const ROWS = 7

export type Level = 0 | 1 | 2 | 3 | 4
export const LEVELS: readonly Level[] = [0, 1, 2, 3, 4]

export interface MonthLabel {
  label: string
  x: number
}

export interface HeatmapLayout {
  width: number
  height: number
  columns: number
  months: MonthLabel[]
  /** One SVG path per intensity level, covering every day at that level. */
  paths: Record<Level, string>
}

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
})

const DAY_MS = 86_400_000

function dayOfYear(year: number, date: Date): number {
  return Math.round((date.getTime() - Date.UTC(year, 0, 1)) / DAY_MS)
}

/** Weekday (0 = Sunday) that January 1 falls on. */
function firstWeekday(year: number): number {
  return new Date(Date.UTC(year, 0, 1)).getUTCDay()
}

/**
 * Lays out a year as GitHub does: one column per week starting on Sunday,
 * left to right, with days after `capturedOn` left out.
 *
 * Each cell is drawn as a 7-unit square with a 3-unit round-joined stroke of
 * the same colour, giving a 10-unit rounded cell from a single path per
 * level instead of one element per day.
 */
export function layoutYear(
  { year, levels }: ContributionYear,
  capturedOn: string,
): HeatmapLayout {
  const offset = firstWeekday(year)
  const captured = new Date(`${capturedOn}T00:00:00Z`)
  const lastDay =
    captured.getUTCFullYear() === year
      ? dayOfYear(year, captured)
      : levels.length - 1
  const inset = GAP / 2
  const side = CELL - GAP

  const segments: Record<Level, string[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] }
  for (let day = 0; day <= Math.min(lastDay, levels.length - 1); day++) {
    const slot = offset + day
    const x = LABEL_LEFT + Math.floor(slot / ROWS) * STEP + inset
    const y = LABEL_TOP + (slot % ROWS) * STEP + inset
    const level = Number(levels[day]) as Level
    segments[level].push(`M${x} ${y}h${side}v${side}h-${side}z`)
  }

  const columns = Math.ceil((offset + levels.length) / ROWS)
  const months: MonthLabel[] = []
  for (let month = 0; month < 12; month++) {
    const first = new Date(Date.UTC(year, month, 1))
    if (first > captured) break
    const column = Math.floor((offset + dayOfYear(year, first)) / ROWS)
    months.push({
      label: monthFormatter.format(first),
      x: LABEL_LEFT + column * STEP,
    })
  }

  return {
    width: LABEL_LEFT + columns * STEP - GAP,
    height: LABEL_TOP + ROWS * STEP - GAP,
    columns,
    months,
    paths: {
      0: segments[0].join(''),
      1: segments[1].join(''),
      2: segments[2].join(''),
      3: segments[3].join(''),
      4: segments[4].join(''),
    },
  }
}
