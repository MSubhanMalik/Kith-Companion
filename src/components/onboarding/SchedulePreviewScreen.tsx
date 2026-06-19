import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const SCHEDULE = {
  Mon: [
    { time: '9–5', label: 'Work', color: '' },
    { time: '5:30–7', label: 'Send 5 cold DMs', color: '#C4745C' },
    { time: '7–8', label: 'Gym', color: '' },
    { time: '9–11', label: 'Build auth endpoints', color: '#7A9A6D' },
    { time: '11–12', label: 'Write LinkedIn post', color: '#B08455' },
  ],
  Tue: [
    { time: '9–5', label: 'Work', color: '' },
    { time: '5:30–7', label: 'Follow up 3 leads', color: '#C4745C' },
    { time: '7–8', label: 'Gym', color: '' },
    { time: '9–11', label: 'Build session mgmt', color: '#7A9A6D' },
  ],
  Wed: [
    { time: '9–5', label: 'Work', color: '' },
    { time: '5:30–7', label: 'Send 5 cold DMs', color: '#C4745C' },
    { time: '7–8', label: 'Gym', color: '' },
    { time: '9–11', label: 'Stripe checkout', color: '#7A9A6D' },
    { time: '11–12', label: 'Write LinkedIn post', color: '#B08455' },
  ],
  Thu: [
    { time: '9–5', label: 'Work', color: '' },
    { time: '5:30–7', label: 'Discovery call prep', color: '#C4745C' },
    { time: '7–8', label: 'Gym', color: '' },
    { time: '9–11', label: 'Test payment flow', color: '#7A9A6D' },
  ],
  Fri: [
    { time: '9–5', label: 'Work', color: '' },
    { time: '5:30–7', label: 'Send SOW + follow ups', color: '#C4745C' },
    { time: '7–8', label: 'Gym', color: '' },
    { time: '11–12', label: 'Weekly wins recap', color: '#B08455' },
  ],
}

interface SchedulePreviewScreenProps {
  onLockIn: () => void
  onBack: () => void
}

export function SchedulePreviewScreen({ onLockIn, onBack }: SchedulePreviewScreenProps) {
  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs text-text-muted tracking-widest uppercase mb-6">Step 3 of 3</p>

          <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
            Here's your week.
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            I built this from your goals. Adjust anything, then lock it in.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="grid grid-cols-5 gap-4">
            {DAYS.map((day, di) => (
              <div key={day}>
                <p className="text-xs font-semibold text-text-secondary mb-3 text-center">{day}</p>
                <div className="flex flex-col gap-1.5">
                  {SCHEDULE[day as keyof typeof SCHEDULE].map((block, bi) => (
                    <motion.div
                      key={bi}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + di * 0.04 + bi * 0.03 }}
                      className="rounded-lg px-2 py-2"
                      style={{
                        backgroundColor: block.color ? `${block.color}12` : '#E8E2D8',
                      }}
                    >
                      <p className="text-[0.5625rem] font-medium truncate" style={{ color: block.color || '#6B5E4F' }}>
                        {block.label}
                      </p>
                      <p className="text-[0.5rem] text-text-muted">{block.time}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Cat state="happy" size={32} />
          <p className="text-sm text-text-secondary">Looks good. Lock it in when you're ready.</p>
        </motion.div>

        <motion.div
          className="flex items-center justify-between mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer">← adjust</button>
          <Button variant="primary" onClick={onLockIn} label="Lock it in" />
        </motion.div>
      </div>
    </div>
  )
}
