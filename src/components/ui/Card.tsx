import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type AccentColor = 'hook' | 'connection' | 'fetch' | 'direction' | 'none'

interface CardProps {
  children: ReactNode
  accent?: AccentColor
  delay?: number
  onClick?: () => void
}

const accentColors = {
  hook: '#7C5CBF',
  connection: '#2D8B5F',
  fetch: '#3B7DD8',
  direction: '#D4735E',
  none: 'transparent',
}

export function Card({ children, accent = 'none', delay = 0, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      className={`border border-border bg-surface px-4 py-3.5 rounded-lg hover:bg-surface-hover transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''}`}
      style={accent !== 'none' ? { borderLeftWidth: '3px', borderLeftColor: accentColors[accent] } : undefined}
    >
      {children}
    </motion.div>
  )
}
