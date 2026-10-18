import { useEffect, useState } from 'react'

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
    <button type="button" onClick={copy} className="btn btn--ghost">
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
      <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>
    </button>
  )
}
