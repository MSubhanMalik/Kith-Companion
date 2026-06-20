import { motion } from 'framer-motion'

interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variantClasses = {
  primary: 'bg-olive text-white hover:bg-olive-hover',
  secondary: 'bg-transparent text-text-primary border border-border hover:bg-surface-hover hover:border-border-hover',
  ghost: 'bg-transparent text-text-muted hover:text-text-secondary hover:bg-surface-hover',
  danger: 'bg-transparent text-direction hover:text-direction/80',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-xs rounded-lg',
  md: 'px-8 py-3.5 text-sm rounded-xl',
  lg: 'px-10 py-4 text-base rounded-xl',
}

export function Button({ label, onClick, variant = 'primary', size = 'md', fullWidth = false }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
      className={`font-semibold cursor-pointer transition-colors duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {label}
    </motion.button>
  )
}
