import { useEffect, useState } from 'react'
import { Icon } from './Icon'

interface CopyButtonProps {
  value: string
  label: string
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const copy = async () => {
    // The Clipboard API is unavailable on insecure origins.
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3.5 text-sm font-medium text-muted transition-colors duration-150 hover:border-ink/40 hover:text-ink"
    >
      <Icon name={copied ? 'check' : 'copy'} className="size-4" />
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  )
}
