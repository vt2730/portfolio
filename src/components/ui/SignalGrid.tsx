import { useEffect, useRef, type CSSProperties } from 'react'

/** A grid intersection: [column out from the centre line, row down from the top]. */
type Point = readonly [col: number, row: number]

interface Route {
  /** Milliseconds after the grid comes into view. */
  delay: number
  /** Intersections to pass through; neighbours share a row or a column. */
  points: Point[]
}

// A pulse runs each route at constant speed, turning at the corners, and every
// point it reaches lights up. The whole pass is over within five seconds, so
// it needs no pause control (WCAG 2.2.2); it replays when the grid scrolls
// back into view. Routes keep to the open space beside the hero copy.
const routes: Route[] = [
  { delay: 200, points: [[-3, 2], [3, 2], [3, 4], [9, 4], [9, 7], [7, 7]] },
  { delay: 900, points: [[-12, 5], [-10, 5], [-10, 2], [-5, 2]] },
  { delay: 1600, points: [[11, 11], [11, 9], [5, 9], [5, 5]] },
  { delay: 2400, points: [[-4, 16], [-4, 14], [6, 14]] },
]

const GRID = 56 // px between grid lines
const PULSE = 112 // px, length of a pulse's fading tail
const SPEED = 0.4 // px per ms
const FLASH = 800 // ms a point stays lit

/** One straight run of a route, drawn as a clipped track the pulse slides through. */
interface Hop {
  axis: 'x' | 'y'
  /** Top-left end of the track. */
  col: number
  row: number
  /** Length in grid cells. */
  span: number
  /** Travels right to left, or bottom to top. */
  reverse: boolean
  delay: number
  duration: number
}

interface Flash {
  point: Point
  delay: number
}

/** Splits routes into hops, timing each so it starts the moment the pulse's
 *  head reaches the corner, and lights each point as the head arrives. */
function layout(routes: Route[]) {
  const hops: Hop[] = []
  const flashes: Flash[] = []

  for (const { delay, points } of routes) {
    let time = delay
    flashes.push({ point: points[0], delay: time })

    for (let index = 1; index < points.length; index++) {
      const [fromCol, fromRow] = points[index - 1]
      const [toCol, toRow] = points[index]
      const axis = fromRow === toRow ? 'x' : 'y'
      const cells = axis === 'x' ? toCol - fromCol : toRow - fromRow
      const length = Math.abs(cells) * GRID

      hops.push({
        axis,
        col: Math.min(fromCol, toCol),
        row: Math.min(fromRow, toRow),
        span: Math.abs(cells),
        reverse: cells < 0,
        delay: time,
        // Until the tail has drained into the far end, too.
        duration: (length + PULSE) / SPEED,
      })
      time += length / SPEED
      flashes.push({ point: points[index], delay: time })
    }
  }

  return { hops, flashes }
}

const { hops, flashes } = layout(routes)

if (import.meta.env.DEV) {
  const end = Math.max(
    ...hops.map((hop) => hop.delay + hop.duration),
    ...flashes.map((flash) => flash.delay + FLASH),
  )
  if (end > 5000) {
    console.warn(`SignalGrid: routes run for ${end}ms; keep them under 5s.`)
  }
}

const gridStyle = {
  '--grid-size': `${GRID}px`,
  '--pulse-length': `${PULSE}px`,
  '--flash': `${FLASH}ms`,
} as CSSProperties

interface SignalGridProps {
  /** Power the grid on from its centre at page load. */
  intro?: boolean
}

/** Decorative blueprint grid with signals routed along its lines. */
export function SignalGrid({ intro = false }: SignalGridProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Re-adding `data-active` restarts the CSS animations (see index.css).
    const observer = new IntersectionObserver(
      ([entry]) =>
        element.toggleAttribute('data-active', Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-intro={intro ? '' : undefined}
      className="grid-bg signal-grid pointer-events-none absolute inset-0 -z-10"
      style={gridStyle}
    >
      {hops.map((hop) => (
        <span
          key={`${hop.axis}:${hop.col}:${hop.row}:${hop.delay}`}
          data-axis={hop.axis}
          data-reverse={hop.reverse ? '' : undefined}
          className="signal"
          style={
            {
              '--col': hop.col,
              '--row': hop.row,
              '--span': hop.span,
              '--delay': `${hop.delay}ms`,
              '--duration': `${hop.duration}ms`,
            } as CSSProperties
          }
        />
      ))}
      {flashes.map(({ point: [col, row], delay }) => (
        <span
          key={`${col}:${row}:${delay}`}
          className="signal-node"
          style={
            {
              '--col': col,
              '--row': row,
              '--delay': `${delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
