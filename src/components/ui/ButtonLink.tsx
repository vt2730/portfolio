import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'accent'
type Size = 'sm' | 'md' | 'lg'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-canvas hover:bg-accent hover:text-white',
  secondary:
    'border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-elevated',
  accent: 'bg-accent text-white hover:bg-ink hover:text-canvas',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`lift inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
