import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const MOCK_GOALS = [
  { label: 'Earn $10K/month from freelance clients', date: '2026-12-31', color: '#C4745C' },
  { label: 'Launch startup MVP with 100 paying users', date: '2027-03-15', color: '#7A9A6D' },
  { label: 'Build LinkedIn audience to 10K followers', date: '2027-06-01', color: '#B08455' },
]

interface GoalsScreenProps {
  onNext: () => void
  onBack: () => void
}

export function GoalsScreen({ onNext, onBack }: GoalsScreenProps) {
  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-[28rem] mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs text-text-muted tracking-widest uppercase mb-6">Step 1 of 3</p>

          <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
            What are you building toward?
          </h1>
          <p className="text-sm text-text-secondary mb-10">
            Your big goals. Rank matters — #1 gets the best time slots.
          </p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {MOCK_GOALS.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 pt-3">
                  <span className="text-lg font-bold text-text-muted/40">{i + 1}</span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
                </div>
                <div className="flex-1">
                  <input
                    defaultValue={goal.label}
                    className="w-full text-text-primary font-medium bg-transparent border-b border-border/60 pb-2 focus:outline-none focus:border-olive transition-colors placeholder:text-text-muted/40"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[0.625rem] text-text-muted">By</span>
                    <input
                      type="date"
                      defaultValue={goal.date}
                      className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1 focus:outline-none focus:border-olive"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-text-muted hover:text-olive transition-colors cursor-pointer mt-2"
          >
            + add goal
          </motion.button>
        </div>

        <motion.div
          className="flex items-center justify-between mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer">← back</button>
          <Button variant="primary" onClick={onNext} label="Next" />
        </motion.div>
      </div>
    </div>
  )
}
