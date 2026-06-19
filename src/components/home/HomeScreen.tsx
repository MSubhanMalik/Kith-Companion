import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

const DONE_TASKS = [
  { label: 'Send 5 cold DMs to agency founders', time: '5:30–7:00 PM', color: '#C4745C' },
  { label: 'Follow up on API client re: SOW', time: '7:00–7:30 PM', color: '#C4745C' },
]

const CURRENT = {
  label: 'Build Stripe checkout flow',
  goal: 'Startup',
  time: '9:30–11:30 PM',
  color: '#7A9A6D',
  endsIn: '47 min',
}

const UPCOMING = [
  { label: 'Write LinkedIn post: weekly recap', time: '11:30 PM–12:30 AM', color: '#B08455' },
]

export function HomeScreen() {
  return (
    <PageTransition>
      <div className="pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={28} />
          <p className="text-sm text-text-muted">Wednesday · Jun 18</p>
        </motion.div>

        {DONE_TASKS.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Done today</p>
            <div className="flex flex-col gap-3">
              {DONE_TASKS.map((task, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${task.color}20` }}>
                    <span className="text-[0.5rem]" style={{ color: task.color }}>✓</span>
                  </div>
                  <span className="text-sm text-text-muted line-through flex-1">{task.label}</span>
                  <span className="text-xs text-text-muted/50">{task.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Right now</p>
          <div
            className="rounded-2xl px-6 py-6"
            style={{ backgroundColor: `${CURRENT.color}08` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: CURRENT.color }} />
                <span className="text-xs font-medium" style={{ color: CURRENT.color }}>{CURRENT.goal}</span>
              </div>
              <span className="text-xs text-text-muted">{CURRENT.time}</span>
            </div>

            <h2 className="text-xl font-bold text-text-primary" style={{ letterSpacing: '-0.01em' }}>
              {CURRENT.label}
            </h2>

            <p className="text-xs text-text-muted mt-3">Ends in {CURRENT.endsIn}</p>
          </div>
        </motion.div>

        {UPCOMING.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Coming up</p>
            <div className="flex flex-col gap-3">
              {UPCOMING.map((task, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: task.color }} />
                  <span className="text-sm text-text-primary flex-1">{task.label}</span>
                  <span className="text-xs text-text-muted/50">{task.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
