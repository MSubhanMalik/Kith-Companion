import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'

const TASKS = [
  { label: 'Send 5 cold DMs to agency founders', time: '5:30–7:00 PM', color: '#C4745C', done: true },
  { label: 'Follow up on API client re: SOW', time: '7:00–7:30 PM', color: '#C4745C', done: true },
  { label: 'Build Stripe checkout flow', time: '9:30–11:30 PM', color: '#7A9A6D', done: false },
  { label: 'Write LinkedIn post: weekly recap', time: '11:30 PM–12:30 AM', color: '#B08455', done: true },
]

const TOMORROW = [
  { label: 'Send 5 cold DMs (batch 4)', time: '5:30–7:00 PM', color: '#C4745C' },
  { label: 'Fix Stripe refund edge case', time: '9:30–11:30 PM', color: '#7A9A6D' },
  { label: 'Write LinkedIn post', time: '11:30 PM–12:30 AM', color: '#B08455' },
]

export function EndOfDayScreen() {
  const done = TASKS.filter(t => t.done).length

  return (
    <PageTransition>
      <div className="pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="thinking" size={28} />
          <p className="text-sm text-text-muted">Day's over. Let's close it out.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-12"
        >
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Today's tasks</p>
          <div className="flex flex-col gap-4">
            {TASKS.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-4"
              >
                <button
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center cursor-pointer"
                  style={task.done ? { backgroundColor: `${task.color}20` } : { border: '1.5px solid #D4CCC0' }}
                >
                  {task.done && <span className="text-[0.5rem]" style={{ color: task.color }}>✓</span>}
                </button>
                <span className={`text-sm flex-1 ${task.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                  {task.label}
                </span>
                <span className="text-xs text-text-muted/50 shrink-0">{task.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Summary</p>
          <div className="flex gap-12">
            <div>
              <span className="text-3xl font-bold text-text-primary">{done}</span>
              <span className="text-sm text-text-muted">/{TASKS.length}</span>
              <p className="text-xs text-text-muted mt-0.5">completed</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-text-primary">1</span>
              <p className="text-xs text-text-muted mt-0.5">missed</p>
            </div>
          </div>

          <motion.div
            className="flex items-start gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Cat state="nudge" size={24} />
            <p className="text-sm text-text-secondary leading-relaxed">
              Stripe checkout didn't get done. I've moved it to tomorrow's 9:30 PM slot and pushed the LinkedIn post to Friday.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Tomorrow — Thursday</p>
          <div className="flex flex-col gap-3">
            {TOMORROW.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="flex items-center gap-4"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: task.color }} />
                <span className="text-sm text-text-primary flex-1">{task.label}</span>
                <span className="text-xs text-text-muted/50">{task.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-end"
        >
          <Button variant="primary" label="Close the day" />
        </motion.div>
      </div>
    </PageTransition>
  )
}
