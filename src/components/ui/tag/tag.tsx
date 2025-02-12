import { cn } from '@/lib/utils/cn'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export function Tag({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-full transition-colors',

        // Variants
        {
          // Primary variant (blue outline)
          'border border-primary text-[#0066FF]': variant === 'primary',

          // Secondary variant (light blue bg)
          // 'bg-[#0066FF]/10 text-[#0066FF]': variant === 'secondary',
          'bg-primary text-primary': variant === 'secondary',

          // Outline variant (gray)
          'border border-gray-200 text-gray-600': variant === 'outline',

          'bg-[#171717] text-white ': variant === 'dark',
        },

        // Sizes
        {
          'px-3 py-1 text-sm': size === 'sm',
          'px-4 py-4 text-sm': size === 'md',
          'px-5 py-2.5 text-base': size === 'lg',
        },

        className
      )}
      {...props}
    />
  )
}
