import { useEffect, useRef, useState, type RefObject } from 'react'
import { mountTerrain } from '../../lib/terrain'

interface HeroTerrainProps {
  heroRef: RefObject<HTMLElement | null>
  /** Called once the terrain is moving and reacting. Should be stable. */
  onLive: () => void
}

/**
 * Contour-map background behind the hero (lib/terrain.ts), drawn from the
 * moment the page hydrates — under the preloader on a first visit. It drifts
 * and follows the pointer; touch screens get a wandering hill that jumps to
 * each tap; with reduced motion it is one still frame.
 */
export function HeroTerrain({ heroRef, onLive }: HeroTerrainProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const host = heroRef.current
    const layer = layerRef.current
    if (!host || !layer) return

    // A fresh canvas per mount: a context released on unmount can't be
    // reused, and React mounts effects twice in development.
    const canvas = document.createElement('canvas')
    layer.append(canvas)
    const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches
    const wander = !matchMedia('(hover: hover) and (pointer: fine)').matches
    const cleanup = mountTerrain(host, canvas, { motion, wander })
    if (!cleanup) {
      canvas.remove()
      return
    }
    setDrawing(true)
    if (motion) onLive()

    return () => {
      cleanup()
      canvas.remove()
    }
  }, [heroRef, onLive])

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`hero-gl ${drawing ? 'is-on' : ''}`}
    />
  )
}
