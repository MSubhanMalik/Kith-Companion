import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageData {
  kind: 'bubble' | 'emote'
  type?: string
  label?: string
  message?: string
  primaryAction?: string
  secondaryAction?: string
  emoji?: string
  emoteText?: string
}

declare global {
  interface Window {
    messageAPI?: {
      onShowMessage: (cb: (data: MessageData) => void) => void
      onHide: (cb: () => void) => void
      sendAction: (action: string) => void
    }
  }
}

const typeColors: Record<string, string> = {
  hook: '#7C5CBF',
  connection: '#2D8B5F',
  fetch: '#3B7DD8',
  direction: '#D4735E',
}

const typeIcons: Record<string, string> = {
  hook: '✦',
  connection: '⟠',
  fetch: '⊕',
  direction: '◎',
}

export function MessageWindow() {
  const [data, setData] = useState<MessageData | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.messageAPI?.onShowMessage((msg) => {
      setData(msg)
      setVisible(true)
    })
    window.messageAPI?.onHide(() => {
      setVisible(false)
    })
  }, [])

  const handleAction = (action: string) => {
    window.messageAPI?.sendAction(action)
  }

  return (
    <div className="w-screen h-screen flex items-end justify-end p-2">
      <AnimatePresence>
        {visible && data?.kind === 'bubble' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div
              style={{
                width: '15.5rem',
                borderRadius: '1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0D8CC',
                padding: '0.875rem 1rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                <span style={{ color: typeColors[data.type ?? ''] ?? '#666', fontSize: '0.75rem' }}>
                  {typeIcons[data.type ?? ''] ?? '•'}
                </span>
                <span style={{ color: typeColors[data.type ?? ''] ?? '#666', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.02em' }}>
                  {data.label}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', lineHeight: 1.45, color: '#2C2417', marginBottom: '0.75rem', fontWeight: 400 }}>
                {data.message}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleAction('primary')}
                  style={{
                    backgroundColor: typeColors[data.type ?? ''] ?? '#666',
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
                  {data.primaryAction}
                </button>
                <button
                  onClick={() => handleAction('secondary')}
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
                  {data.secondaryAction}
                </button>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '0.125rem',
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

        {visible && data?.kind === 'emote' && (
          <motion.div
            className="flex items-end justify-end"
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
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: data.emoteText ? '0.25rem 0.5rem' : '0.25rem',
                borderRadius: '2rem',
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{data.emoji}</span>
              {data.emoteText && (
                <span style={{ fontSize: '0.5625rem', fontWeight: 600, color: '#6B5E4F', fontFamily: '"DM Sans", sans-serif' }}>
                  {data.emoteText}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
