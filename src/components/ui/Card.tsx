import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  delay?: number
  onClick?: () => void
  className?: string
}

export function Card({ children, delay = 0, onClick, className = '' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer hover:bg-surface-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
