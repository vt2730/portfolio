interface StackListProps {
  items: string[]
  label?: string
  className?: string
  /** `chips` renders bordered pills; `plain` renders inline mono text. */
  variant?: 'chips' | 'plain'
}

export function StackList({
  items,
  label = 'Technologies',
  className = '',
  variant = 'plain',
}: StackListProps) {
  const item =
    variant === 'chips'
      ? 'rounded-full border border-line px-3 py-1 text-xs text-muted'
      : 'text-xs text-faint'

  return (
    <ul
      aria-label={label}
      className={`flex flex-wrap font-mono ${
        variant === 'chips' ? 'gap-2' : 'gap-x-3 gap-y-1.5'
      } ${className}`}
    >
      {items.map((entry) => (
        <li key={entry} className={item}>
          {entry}
        </li>
      ))}
    </ul>
  )
}
