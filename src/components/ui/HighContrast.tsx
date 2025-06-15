import React from 'react'
import { cn } from '@/lib/utils'

interface HighContrastTextProps {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'dark' | 'colored'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Componente para texto con alto contraste
export function HighContrastText({ 
  children, 
  className, 
  variant = 'dark',
  size = 'md'
}: HighContrastTextProps) {
  const variantClasses = {
    light: 'text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]',
    dark: 'text-gray-900 drop-shadow-[1px_1px_2px_rgba(255,255,255,0.8)]',
    colored: 'text-gray-900 bg-white/90 px-2 py-1 rounded backdrop-blur-sm'
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <span className={cn(
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  )
}

// Componente para botones con alto contraste
export function HighContrastButton({ 
  children, 
  className, 
  onClick,
  variant = 'primary',
  ...props 
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  [key: string]: any
}) {
  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 shadow-lg',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100 border-2 border-gray-300 shadow-lg',
    outline: 'bg-white/90 text-gray-900 hover:bg-white border-2 border-gray-900 backdrop-blur-sm shadow-lg'
  }

  return (
    <button
      className={cn(
        'px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105',
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Componente para cards con fondo contrastante
export function HighContrastCard({ 
  children, 
  className,
  gradient = false
}: {
  children: React.ReactNode
  className?: string
  gradient?: boolean
}) {
  return (
    <div className={cn(
      'bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-xl',
      gradient && 'bg-gradient-to-br from-white via-gray-50 to-white',
      className
    )}>
      {children}
    </div>
  )
}

// Wrapper para secciones con fondos problemáticos
export function ContrastWrapper({ 
  children, 
  className 
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      'bg-gradient-to-b from-gray-900/5 via-transparent to-gray-900/5 backdrop-blur-[1px]',
      className
    )}>
      {children}
    </div>
  )
}