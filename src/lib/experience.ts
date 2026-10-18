import type { DateRange, Experience, YearMonth } from '../types/portfolio'

export function getCurrentRole(roles: Experience[]): Experience | undefined {
  return roles.find((role) => role.period.end === 'present')
}

export function getPreviousRoles(roles: Experience[]): Experience[] {
  return roles.filter((role) => role.period.end !== 'present')
}

/** Start month of the earliest role. */
export function getCareerStart(roles: Experience[]): YearMonth | undefined {
  return roles.map((role) => role.period.start).sort()[0]
}

function monthIndex(value: YearMonth): number {
  const [year, month] = value.split('-').map(Number)
  return year * 12 + month - 1
}

/** Whole years between `start` and `now`, e.g. `2021-08` → 5 in Oct 2026. */
export function yearsSince(start: YearMonth, now = new Date()): number {
  const months =
    now.getUTCFullYear() * 12 + now.getUTCMonth() - monthIndex(start)
  return Math.max(0, Math.floor(months / 12))
}

/** Whole years a role lasted, counting both end months: Aug 2021 – Nov 2025 → 4. */
export function yearsIn({ start, end }: DateRange, now = new Date()): number {
  if (end === 'present') return yearsSince(start, now)
  return Math.max(0, Math.floor((monthIndex(end) - monthIndex(start) + 1) / 12))
}
