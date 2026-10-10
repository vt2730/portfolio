import { useCallback, useRef, type ReactNode } from 'react'
import { usePointerMotion } from '../../hooks/usePointerMotion'

interface MagneticProps {
  children: ReactNode
  /** How far the content follows the cursor, as a share of the offset. */
  strength?: number
  className?: string
}

/**
 * Pulls its content gently toward the cursor while hovered. The wrapper has
 * a little extra padding so the pull starts just before the button itself.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = '',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const follow = useCallback(
    (x: number, y: number, rect: DOMRect) =>
      `translate(${x * rect.width * strength}px, ${y * rect.height * strength}px)`,
    [strength],
  )
  usePointerMotion(ref, follow)

  return (
    <div ref={ref} className={`magnetic -m-2 inline-flex p-2 ${className}`}>
      {children}
    </div>
  )
}
