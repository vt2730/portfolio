import { Fragment, type CSSProperties } from 'react'

interface MaskWordsProps {
  text: string
  /** Index of the first word, to continue a stagger across elements. */
  offset?: number
}

/**
 * Wraps each word in a mask so it can rise into place — inside the hero, or
 * under `<Reveal variant="lines">`. The text itself stays plain for
 * assistive technology.
 */
export function MaskWords({ text, offset = 0 }: MaskWordsProps) {
  const words = text.split(' ')
  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span className="mask-word">
        <span style={{ '--i': offset + index } as CSSProperties}>{word}</span>
      </span>
      {index < words.length - 1 && ' '}
    </Fragment>
  ))
}
