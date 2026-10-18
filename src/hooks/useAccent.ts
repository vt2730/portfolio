import { useSyncExternalStore } from 'react'
import { getAccent, watchRoot, type Accent } from '../lib/preferences'

const subscribe = watchRoot('data-accent')

/** Current accent colour; `null` during prerender and hydration. */
export function useAccent(): Accent | null {
  return useSyncExternalStore<Accent | null>(subscribe, getAccent, () => null)
}
