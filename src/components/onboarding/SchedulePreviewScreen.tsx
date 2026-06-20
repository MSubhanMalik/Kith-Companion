import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const SCHEDULE: Record<string, Array<{ time: string; label: string; color: string }>> = {
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
  const [thinking, setThinking] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setThinking(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {thinking ? (
            <motion.div
              key="thinking"
              className="flex flex-col items-center justify-center pt-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Cat state="thinking" size={64} />
              <motion.p
                className="text-text-secondary mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Building your week...
              </motion.p>
              <motion.div
                className="flex gap-1 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-olive/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Cat state="happy" size={32} />
                <h1 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: '-0.02em' }}>
                  Here's your week.
                </h1>
              </div>
              <p className="text-sm text-text-secondary mb-8 ml-11">
                3 goals → 16 tasks → 5 days. Every task leads back to a goal. Adjust anything.
</p>

              <div className="grid grid-cols-5 gap-4 mb-8">
                {DAYS.map((day, di) => (
                  <div key={day}>
                    <p className="text-xs font-semibold text-text-secondary mb-3 text-center">{day}</p>
                    <div className="flex flex-col gap-1.5">
                      {SCHEDULE[day].map((block, bi) => (
                        <motion.div
                          key={bi}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: di * 0.06 + bi * 0.04 }}
                          className="rounded-lg px-2 py-2"
                          style={{ backgroundColor: block.color ? `${block.color}12` : 'var(--color-surface-hover)' }}
                        >
                          <p className="text-[0.5625rem] font-medium truncate" style={{ color: block.color || 'var(--color-text-secondary)' }}>
                            {block.label}
                          </p>
                          <p className="text-[0.5rem] text-text-muted">{block.time}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer">← adjust</button>
                <Button variant="primary" onClick={onLockIn} label="Lock it in" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
