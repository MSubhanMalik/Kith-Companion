import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const MOCK_BLOCKS = [
  { label: 'Work', time: '9:00 AM – 5:00 PM', days: 'Mon–Fri' },
  { label: 'Gym', time: '6:00 PM – 7:00 PM', days: 'Mon–Fri' },
  { label: 'Sleep', time: '11:00 PM – 7:00 AM', days: 'Every day' },
]

interface LifeBlocksScreenProps {
  onNext: () => void
  onBack: () => void
}

export function LifeBlocksScreen({ onNext, onBack }: LifeBlocksScreenProps) {
  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-[28rem] mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs text-text-muted tracking-widest uppercase mb-6">Step 2 of 3</p>

          <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
            What can't move?
          </h1>
          <p className="text-sm text-text-secondary mb-10">
            Your non-negotiables. I won't schedule over these.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {MOCK_BLOCKS.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
              className="flex items-center justify-between border-b border-border/40 pb-4"
            >
              <div>
                <span className="text-text-primary font-medium">{block.label}</span>
                <span className="text-xs text-text-muted ml-3">{block.days}</span>
              </div>
              <span className="text-sm text-text-secondary">{block.time}</span>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-text-muted hover:text-olive transition-colors cursor-pointer mt-2"
          >
            + add block
          </motion.button>
        </div>

        <motion.div
          className="flex items-center justify-between mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer">← back</button>
          <Button variant="primary" onClick={onNext} label="Build my schedule" />
        </motion.div>
      </div>
    </div>
  )
}
