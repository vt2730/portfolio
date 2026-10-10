import { useRef, type ReactNode } from 'react'
import { usePointerMotion } from '../../hooks/usePointerMotion'

interface TiltProps {
  children: ReactNode
  className?: string
}

const MAX_DEGREES = 4

const tilt = (x: number, y: number) =>
  `perspective(1200px) rotateX(${(-y * MAX_DEGREES).toFixed(2)}deg) rotateY(${(x * MAX_DEGREES).toFixed(2)}deg)`

/** Tilts its content a few degrees toward the cursor, like a card on a desk. */
export function Tilt({ children, className = '' }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  usePointerMotion(ref, tilt)

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  )
}
