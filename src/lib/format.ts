import type { DateRange, YearMonth } from '../types/portfolio'

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const numberFormatter = new Intl.NumberFormat('en')

const listFormatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
})

function toDate(value: YearMonth): Date {
  const [year, month] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1))
}

/** `2025-12` → `Dec 2025` */
export function formatYearMonth(value: YearMonth): string {
  return monthFormatter.format(toDate(value))
}

/** `{ start: '2021-08', end: '2025-11' }` → `Aug 2021 – Nov 2025` */
export function formatPeriod({ start, end }: DateRange): string {
  const endLabel = end === 'present' ? 'Present' : formatYearMonth(end)
  return `${formatYearMonth(start)} – ${endLabel}`
}

/** `['a', 'b', 'c']` → `a, b, and c` */
export function formatList(items: string[]): string {
  return listFormatter.format(items)
}

/** `2025-11-28` → `28 Nov 2025` */
export function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}

/** `5356` → `5,356` */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

const SMALL_NUMBERS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
]

/** `4` → `four`; numbers above ten stay as digits. */
export function spellNumber(value: number): string {
  return SMALL_NUMBERS[value] ?? String(value)
}
