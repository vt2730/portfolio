import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'

interface FooterProps {
  name: string
}

export function Footer({ name }: FooterProps) {
  return (
    <footer>
      <Container className="flex items-center justify-between gap-4 py-8 font-mono text-xs text-faint">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {name}
        </p>
        <a
          href="#top"
          className="-my-2 inline-flex items-center gap-1.5 py-2 transition-colors duration-150 hover:text-ink"
        >
          Back to top
          <Icon name="arrow-up" className="size-3.5" />
        </a>
      </Container>
    </footer>
  )
}
