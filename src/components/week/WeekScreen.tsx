import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
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

const LEGEND = [
  { label: 'Freelancing', color: '#C4745C' },
  { label: 'Startup', color: '#7A9A6D' },
  { label: 'LinkedIn', color: '#B08455' },
]

export function WeekScreen() {
  return (
    <PageTransition>
      <div className="pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={28} />
          <p className="text-sm text-text-muted">Jun 16 – 20, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-8" style={{ letterSpacing: '-0.02em' }}>This week</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-5 gap-5">
            {DAYS.map((day, di) => (
              <div key={day}>
                <p className={`text-xs font-semibold mb-4 text-center ${day === 'Wed' ? 'text-olive' : 'text-text-muted'}`}>
                  {day}
                </p>
                <div className="flex flex-col gap-1.5">
                  {SCHEDULE[day].map((block, bi) => (
                    <motion.div
                      key={bi}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + di * 0.03 + bi * 0.02 }}
                      className="rounded-lg px-2.5 py-2.5"
                      style={{ backgroundColor: block.color ? `${block.color}10` : '#E8E2D8' }}
                    >
                      <p className="text-[0.625rem] font-medium truncate" style={{ color: block.color || '#9C8F80' }}>
                        {block.label}
                      </p>
                      <p className="text-[0.5rem] text-text-muted/50 mt-0.5">{block.time}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex gap-6 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-xs text-text-muted">{l.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  )
}
