import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'luxury' | 'outline-luxury'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      default: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
      outline: 'border-2 border-gray-300 text-black hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-black hover:bg-gray-100 focus:ring-gray-500',
      luxury: 'bg-gradient-to-r from-champagne-400 to-champagne-500 text-white hover:from-champagne-500 hover:to-champagne-600 hover:shadow-luxury transform hover:scale-105 focus:ring-champagne-500',
      'outline-luxury': 'border-2 border-champagne-400 text-black hover:bg-champagne-400 hover:text-white hover:shadow-luxury focus:ring-champagne-500'
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'