import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from './Cat'

interface CompletionPromptProps {
  visible: boolean
  task: string
  goal: string
  goalColor: string
  onYes: () => void
  onNo: () => void
}

export function CompletionPrompt({ visible, task, goal, goalColor, onYes, onNo }: CompletionPromptProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-page/80 backdrop-blur-sm" />

          <motion.div
            className="relative max-w-[22rem] w-full mx-6 text-center"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="mb-6">
              <Cat state="nudge" size={48} />
            </div>

            <p className="text-xs mb-3" style={{ color: goalColor }}>{goal}</p>

            <h2 className="text-xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
              Did you finish?
            </h2>

            <p className="text-sm text-text-secondary mb-8">{task}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onYes}
                className="px-8 py-2.5 rounded-xl text-sm font-medium text-olive bg-olive/8 hover:bg-olive/15 cursor-pointer transition-colors"
              >
                Yes, done
              </button>
              <button
                onClick={onNo}
                className="px-8 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
              >
                Not yet
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
