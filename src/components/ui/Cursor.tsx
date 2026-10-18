import { useEffect, useRef, useState } from 'react'

// Mouse or trackpad only; touch and reduced motion keep the native cursor.
const SUPPORTED = '(pointer: fine) and (prefers-reduced-motion: no-preference)'
const INTERACTIVE = 'a[href], button, summary, [role="option"], [data-cursor]'

const pad = (value: number) => String(Math.max(0, Math.round(value))).padStart(4, '0')

/** What a click on `element` will do, shown beside the cursor. */
function describe(element: Element): string {
  const custom = element.getAttribute('data-cursor')
  if (custom) return custom
  if (element instanceof HTMLAnchorElement) {
    if (element.protocol === 'mailto:') return 'write'
    if (element.hasAttribute('download')) return 'save ↓'
    if (element.origin !== location.origin) return 'visit ↗'
    return 'open →'
  }
  return 'click'
}

/**
 * Drafting cursor: hairlines across the viewport cross at the pointer, where
 * a small accent square reads out its coordinates. Over anything clickable
 * it opens into a ring labelled with what the click does.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = matchMedia(SUPPORTED)
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return enabled ? <Crosshair /> : null
}

function Crosshair() {
  const rootRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLSpanElement>(null)
  const verticalRef = useRef<HTMLSpanElement>(null)
  const pointRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const horizontal = horizontalRef.current
    const vertical = verticalRef.current
    const point = pointRef.current
    const label = labelRef.current
    if (!root || !horizontal || !vertical || !point || !label) return

    const html = document.documentElement
    html.classList.add('has-cursor')

    // The lines follow tightly, the point with a little more lag.
    const target = { x: 0, y: 0 }
    const lines = { x: 0, y: 0 }
    const dot = { x: 0, y: 0 }
    let placed = false
    let hovered: Element | null = null
    let frame = 0
    let last = 0

    const render = () => {
      horizontal.style.transform = `translate3d(0, ${lines.y}px, 0)`
      vertical.style.transform = `translate3d(${lines.x}px, 0, 0)`
      point.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`
    }

    const tick = (now: number) => {
      frame = 0
      // Frame-rate independent easing, tuned at 60fps.
      const steps = Math.min((now - last) / 16.67, 4)
      last = now
      const ease = (amount: number) => 1 - (1 - amount) ** steps
      lines.x += (target.x - lines.x) * ease(0.45)
      lines.y += (target.y - lines.y) * ease(0.45)
      dot.x += (target.x - dot.x) * ease(0.28)
      dot.y += (target.y - dot.y) * ease(0.28)
      render()
      const moving =
        Math.abs(target.x - dot.x) > 0.1 || Math.abs(target.y - dot.y) > 0.1
      if (moving) frame = requestAnimationFrame(tick)
    }

    const showCoordinates = () => {
      label.textContent = `x ${pad(target.x)} · y ${pad(target.y)}`
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      target.x = event.clientX
      target.y = event.clientY
      if (!placed) {
        placed = true
        Object.assign(lines, target)
        Object.assign(dot, target)
        render()
      }
      root.classList.add('is-visible')
      if (!hovered) showCoordinates()
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const onPointerOver = (event: PointerEvent) => {
      const element =
        event.target instanceof Element
          ? event.target.closest(INTERACTIVE)
          : null
      if (element === hovered) return
      hovered = element
      root.classList.toggle('is-hover', element !== null)
      if (element) label.textContent = describe(element)
      else showCoordinates()
    }

    // Leaving the window: no related target to move into.
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) root.classList.remove('is-visible')
    }
    const onPointerDown = () => root.classList.add('is-down')
    const onPointerUp = () => root.classList.remove('is-down')

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden="true" className="cursor">
      <span ref={horizontalRef} className="cursor__h" />
      <span ref={verticalRef} className="cursor__v" />
      <span ref={pointRef} className="cursor__pt">
        <span className="cursor__ring" />
        <span ref={labelRef} className="cursor__label note" />
      </span>
    </div>
  )
}
