import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface ModalProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ visible, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!visible) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-page/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-[26rem] mx-6 bg-page rounded-2xl border border-border/40 px-8 py-7 shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
