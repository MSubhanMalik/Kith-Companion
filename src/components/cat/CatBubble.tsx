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
          <div
            style={{
              width: '16rem',
              borderRadius: '1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E0D8CC',
              padding: '0.875rem 1rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              <span style={{ color: config.color, fontSize: '0.75rem' }}>
                {config.icon}
              </span>
              <span style={{ color: config.color, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.02em' }}>
                {label}
              </span>
            </div>

            <p style={{
              fontSize: '0.8125rem',
              lineHeight: 1.45,
              color: '#2C2417',
              marginBottom: '0.75rem',
              fontWeight: 400,
            }}>
              {message}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={onPrimary}
                style={{
                  backgroundColor: config.color,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: 'pointer',
                }}
              >
                {primaryAction}
              </button>
              <button
                onClick={onSecondary}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6B5E4F',
                  border: '1px solid #E0D8CC',
                  borderRadius: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: 'pointer',
                }}
              >
                {secondaryAction}
              </button>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '-0.375rem',
              right: '1.5rem',
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E0D8CC',
              borderBottom: '1px solid #E0D8CC',
              transform: 'rotate(45deg)',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.05)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
