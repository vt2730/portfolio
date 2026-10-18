import { useEffect } from 'react'
import { toggleGrid } from '../lib/preferences'

/**
 * ⌘K / Ctrl+K toggles the command palette; ⌥G toggles the layout grid.
 * `onTogglePalette` should be stable (e.g. from useCallback).
 */
export function useHotkeys(onTogglePalette: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault()
        onTogglePalette()
        return
      }

      if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === 'KeyG') {
        // ⌥G types a character on macOS; leave text fields alone.
        const target = event.target
        if (
          target instanceof HTMLElement &&
          target.closest('input, textarea, [contenteditable="true"]')
        ) {
          return
        }
        event.preventDefault()
        toggleGrid()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onTogglePalette])
}
