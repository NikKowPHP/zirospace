'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'navbar' | 'modal'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  isActive?: boolean
  isFullWidth?: boolean
  href?: string
  target?: string
}

const buttonStyles = {
  base: 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    primary: 'bg-primary text-white hover:bg-[#0066FF]/90 active:bg-[#0066FF]/80',
    secondary: 'bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20 active:bg-[#0066FF]/30',
    outline: 'border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/5 active:bg-[#0066FF]/10',
    ghost: (isActive: boolean) =>
      isActive
        ? 'bg-[#0066FF] text-white'
        : 'text-gray-700 hover:text-gray-900 active:bg-gray-200',
    white: 'bg-white text-black hover:bg-white/90 active:bg-white/80',
    navbar: 'text-[16px] font-medium transition-colors text-gray-900',
    modal: 'bg-primary text-white hover:bg-[#0066FF]/90 active:bg-[#0066FF]/80',
  },
  sizes: {
    sm: 'py-[6px] px-[12px] text-[15px] rounded-full',
    md: 'h-[56px] px-8 text-[16px] rounded-full',
    lg: 'h-[64px] px-10 text-[18px] rounded-full',
    xl: 'h-[72px] px-12 text-[20px] rounded-full w-full',
    full: 'w-full px-4 py-8 rounded-lg ',
  
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isActive,
      isFullWidth,
      href,
      target,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      buttonStyles.base,
      isFullWidth && 'w-full',
      variant === 'ghost'
        ? buttonStyles.variants.ghost(!!isActive)
        : buttonStyles.variants[variant],
      buttonStyles.sizes[size],
      className
    )

    if (href) {
      return (
        <Link
          href={href}
          target={target}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {props.children}
        </Link>
      )
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

