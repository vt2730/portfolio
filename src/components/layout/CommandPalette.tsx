import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

export interface Command {
  id: string
  label: string
  group: string
  /** Right-hand annotation, e.g. a section number or a site name. */
  hint?: string
  /** Extra words to match on. */
  keywords?: string
  /** Shown in place of the hint, briefly, before the palette closes. */
  feedback?: string
  run: () => void
}

// How long a command's feedback stays up before the palette closes.
const FEEDBACK_MS = 900

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  commands: Command[]
}

function matches(command: Command, query: string): boolean {
  const haystack =
    `${command.label} ${command.group} ${command.hint ?? ''} ${command.keywords ?? ''}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term))
}

/**
 * ⌘K palette: jump to a section, switch theme or accent, copy the email…
 * It doubles as the menu on narrow screens. A native modal <dialog> provides
 * the focus trap, Escape and focus return; the input drives a listbox.
 */
export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [confirmed, setConfirmed] = useState<Command | null>(null)

  const results = useMemo(
    () => commands.filter((command) => matches(command, query.trim())),
    [commands, query],
  )
  const groups = useMemo(() => {
    const byGroup = new Map<string, { command: Command; index: number }[]>()
    results.forEach((command, index) => {
      const list = byGroup.get(command.group) ?? []
      list.push({ command, index })
      byGroup.set(command.group, list)
    })
    return [...byGroup]
  }, [results])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      inputRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Keep the highlighted option in view while arrowing through the list.
  useEffect(() => {
    if (!open) return
    document
      .getElementById(`${listId}-${active}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, listId, open])

  // Close once a command's feedback has been seen.
  useEffect(() => {
    if (!confirmed) return
    const timeout = window.setTimeout(
      () => dialogRef.current?.close(),
      FEEDBACK_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [confirmed])

  const reset = () => {
    setQuery('')
    setActive(0)
    setConfirmed(null)
  }

  const run = (command: Command | undefined) => {
    if (!command) return
    if (command.feedback) {
      command.run()
      setConfirmed(command)
      return
    }
    // Closing first returns focus to the trigger; the command can then move
    // it (e.g. to the section it scrolls to).
    dialogRef.current?.close()
    command.run()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = results.length
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (count === 0) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((index) => (index + step + count) % count)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActive(event.key === 'Home' ? 0 : Math.max(0, count - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      run(results[active])
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      className="palette"
      onClose={() => {
        reset()
        onClose()
      }}
      // A click on the backdrop lands on the dialog itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <div className="palette__box">
        <div className="palette__search">
          <span aria-hidden="true" className="note">
            ⌘K
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              results.length > 0 ? `${listId}-${active}` : undefined
            }
            aria-label="Search sections and actions"
            placeholder="Jump to a section or run an action…"
            spellCheck={false}
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            className="note cursor-pointer hover:text-ink"
            onClick={() => dialogRef.current?.close()}
          >
            Esc
          </button>
        </div>

        <div id={listId} role="listbox" aria-label="Results" className="palette__list">
          {groups.map(([group, items]) => (
            <div key={group} role="group" aria-labelledby={`${listId}-${group}`}>
              <p id={`${listId}-${group}`} className="note palette__group">
                {group}
              </p>
              {items.map(({ command, index }) => (
                <div
                  key={command.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className="palette__option"
                  onPointerMove={() => setActive(index)}
                  onClick={() => run(command)}
                >
                  <span>{command.label}</span>
                  {confirmed === command ? (
                    <span className="note">{command.feedback} ✓</span>
                  ) : (
                    command.hint && <span className="note">{command.hint}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
          {results.length === 0 && (
            <p className="note palette__group">Nothing matches “{query}”.</p>
          )}
        </div>
        <p aria-live="polite" className="sr-only">
          {confirmed?.feedback}
        </p>
      </div>
    </dialog>
  )
}
