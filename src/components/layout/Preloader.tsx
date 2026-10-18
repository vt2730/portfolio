import { Monogram } from '../ui/Monogram'

interface PreloaderProps {
  name: string
  title: string
}

/**
 * First-visit curtain: the monogram plots itself while a counter runs to
 * 100%, then the curtain lifts from the bottom up. Shown only under
 * `html.js:not([data-preloaded])` — index.html decides, once per tab and
 * never with reduced motion — and purely visual, so hidden from assistive
 * technology.
 */
export function Preloader({ name, title }: PreloaderProps) {
  return (
    <div aria-hidden="true" className="preloader">
      <div className="preloader__meta note">
        <span>Plotting · {name}</span>
        <span suppressHydrationWarning>rev. {new Date().getFullYear()}</span>
      </div>
      <Monogram plot />
      <div className="preloader__meta note">
        <span>{title}</span>
        <span className="preloader__count" />
      </div>
    </div>
  )
}
