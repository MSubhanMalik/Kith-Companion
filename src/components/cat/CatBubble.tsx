import { motion, AnimatePresence } from 'framer-motion'

export type BubbleType = 'hook' | 'connection' | 'fetch' | 'direction'

interface CatBubbleProps {
  visible: boolean
  type: BubbleType
  label: string
  message: string
  primaryAction: string
  secondaryAction: string
  onPrimary: () => void
  onSecondary: () => void
}

const typeConfig: Record<BubbleType, { color: string; icon: string }> = {
  hook: { color: '#7C5CBF', icon: '✦' },
  connection: { color: '#2D8B5F', icon: '⟠' },
  fetch: { color: '#3B7DD8', icon: '⊕' },
  direction: { color: '#D4735E', icon: '◎' },
}

export function CatBubble({
  visible,
  type,
  label,
  message,
  primaryAction,
  secondaryAction,
  onPrimary,
  onSecondary,
}: CatBubbleProps) {
  const config = typeConfig[type]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute bottom-full right-0 mb-3"
          style={{ transformOrigin: 'bottom right', WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="w-64 rounded-2xl bg-white border border-border px-4 py-3.5 shadow-lg font-sans">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs" style={{ color: config.color }}>
                {config.icon}
              </span>
              <span className="text-[0.6875rem] font-semibold tracking-wide" style={{ color: config.color }}>
                {label}
              </span>
            </div>

            <p className="text-[0.8125rem] leading-snug text-text-primary mb-3">
              {message}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrimary}
                className="rounded-lg px-3 py-1.5 text-[0.6875rem] font-semibold text-white cursor-pointer"
                style={{ backgroundColor: config.color }}
              >
                {primaryAction}
              </button>
              <button
                onClick={onSecondary}
                className="rounded-lg px-3 py-1.5 text-[0.6875rem] font-semibold text-text-secondary border border-border cursor-pointer"
              >
                {secondaryAction}
              </button>
            </div>
          </div>

          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-border rotate-45 shadow-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
