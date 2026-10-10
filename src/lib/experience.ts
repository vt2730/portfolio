import type { Experience } from '../types/portfolio'

export function getCurrentRole(roles: Experience[]): Experience | undefined {
  return roles.find((role) => role.period.end === 'present')
}

export function getPreviousRoles(roles: Experience[]): Experience[] {
  return roles.filter((role) => role.period.end !== 'present')
}
