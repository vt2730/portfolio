import { MONOGRAM } from '../../lib/monogram'

interface MonogramProps {
  /** Draws the strokes in on mount (see `.is-plotting` in index.css). */
  plot?: boolean
  className?: string
}

export function Monogram({ plot = false, className = '' }: MonogramProps) {
  const { viewBox, paths, dot } = MONOGRAM
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className={`monogram ${plot ? 'is-plotting' : ''} ${className}`}
    >
      {paths.map((d) => (
        <path key={d} d={d} pathLength={1} />
      ))}
      <circle cx={dot.cx} cy={dot.cy} r={dot.r} />
    </svg>
  )
}
