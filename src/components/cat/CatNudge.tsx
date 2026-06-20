import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from './Cat'
import type { CatState } from './types'

interface CatNudgeProps {
  visible: boolean
  message: string
  catState?: CatState
  action?: string
  onAction?: () => void
  onDismiss?: () => void
}

export function CatNudge({ visible, message, catState = 'alert', action, onAction, onDismiss }: CatNudgeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="max-w-[18rem] bg-page rounded-2xl px-4 py-3 shadow-lg border border-border/40">
            <p className="text-sm text-text-primary leading-snug">{message}</p>
            {(action || onDismiss) && (
              <div className="flex items-center gap-3 mt-2.5">
                {action && onAction && (
                  <button
                    onClick={onAction}
                    className="text-xs font-medium text-olive hover:text-olive-hover cursor-pointer"
                  >
                    {action}
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="text-xs text-text-muted/40 hover:text-text-muted cursor-pointer"
                  >
                    dismiss
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="shrink-0 mb-1">
            <Cat state={catState} size={36} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
