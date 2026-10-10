import type { ExternalLink, LinkKind } from '../types/portfolio'

export function findLink(
  links: ExternalLink[],
  kind: LinkKind,
): ExternalLink | undefined {
  return links.find((link) => link.kind === kind)
}

export function resumeFileName(name: string): string {
  return `${name.trim().replace(/\s+/g, '-')}-Resume.pdf`
}
