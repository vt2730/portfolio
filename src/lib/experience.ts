import type { Experience, YearMonth } from '../types/portfolio'

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

/** Whole years between `start` and `now`, e.g. `2021-08` → 5 in Oct 2026. */
export function yearsSince(start: YearMonth, now = new Date()): number {
  const [year, month] = start.split('-').map(Number)
  const months =
    (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - month)
  return Math.max(0, Math.floor(months / 12))
}
