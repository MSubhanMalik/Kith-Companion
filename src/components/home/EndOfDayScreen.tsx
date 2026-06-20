import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'

const TASKS = [
  { label: 'Send 5 cold DMs', done: true, color: '#C4745C' },
  { label: 'Follow up API client', done: true, color: '#C4745C' },
  { label: 'Build Stripe checkout', done: false, color: '#7A9A6D' },
  { label: 'Write LinkedIn recap', done: true, color: '#B08455' },
]

const TOMORROW = [
  { label: 'Send 5 cold DMs (batch 4)', color: '#C4745C', time: '5:30 PM' },
  { label: 'Fix Stripe refund edge case', color: '#7A9A6D', time: '9 PM' },
]

export function EndOfDayScreen() {
  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="thinking" size={26} />
          <span className="text-sm text-text-muted">Freelancing: 2/2 done. Startup: missed 1 — moved to tomorrow. LinkedIn: done.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="text-xs text-text-muted/40 mb-4">today</p>
          <div className="flex flex-col gap-3">
            {TASKS.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 + i * 0.04 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center cursor-pointer"
                  style={task.done ? { backgroundColor: `${task.color}18` } : { border: '1.5px solid #D4CCC0' }}
                >
                  {task.done && <span className="text-[0.375rem]" style={{ color: task.color }}>✓</span>}
                </div>
                <span className={`text-sm ${task.done ? 'text-text-muted/40 line-through' : 'text-text-primary'}`}>
                  {task.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-xs text-text-muted/40 mb-4">tomorrow</p>
          <div className="flex flex-col gap-3">
            {TOMORROW.map((task, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4">
                <span className="text-sm" style={{ color: task.color }}>{task.label}</span>
                <span className="text-[0.625rem] text-text-muted/30">{task.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Button variant="primary" label="Close the day" />
        </motion.div>
      </div>
    </PageTransition>
  )
}
