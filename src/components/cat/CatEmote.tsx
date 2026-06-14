import { motion, AnimatePresence } from 'framer-motion'

interface CatEmoteProps {
  visible: boolean
  emoji: string
  text?: string
}

export function CatEmote({ visible, emoji, text }: CatEmoteProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute -top-2 left-1/2"
          initial={{ opacity: 0, y: 8, scale: 0.3 }}
          animate={{
            opacity: 1,
            y: [0, -6, -3],
            scale: 1,
            transition: {
              y: { duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 500, damping: 15 },
            },
          }}
          exit={{ opacity: 0, y: -12, scale: 0.5, transition: { duration: 0.3 } }}
          style={{ transform: 'translateX(-50%)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: text ? '0.25rem 0.5rem' : '0.25rem',
              borderRadius: '2rem',
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{emoji}</span>
            {text && (
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 600,
                  color: '#6B5E4F',
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                {text}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
