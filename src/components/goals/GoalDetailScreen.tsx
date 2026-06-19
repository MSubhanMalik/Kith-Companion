import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

const GOAL = {
  label: 'Earn $10K/month from freelance clients',
  color: '#C4745C',
  target: 'Dec 31, 2026',
  weeklyHours: 16,
}

const TASKS = [
  { text: 'Research 25 target founders', status: 'done' as const, day: 'Mon' },
  { text: 'Send 5 DMs (batch 1)', status: 'done' as const, day: 'Mon' },
  { text: 'Send 5 DMs (batch 2)', status: 'done' as const, day: 'Tue' },
  { text: 'Send 5 DMs (batch 3)', status: 'current' as const, day: 'Wed' },
  { text: 'Send 5 DMs (batch 4)', status: 'upcoming' as const, day: 'Thu' },
  { text: 'Send 5 DMs (batch 5)', status: 'upcoming' as const, day: 'Fri' },
  { text: 'Follow up on replies + book calls', status: 'upcoming' as const, day: 'Fri' },
]

const PAST = [
  { text: 'Set up freelance portfolio site', week: 'Jun 9' },
  { text: 'Create cold outreach template', week: 'Jun 2' },
]

interface GoalDetailScreenProps {
  onBack: () => void
  onNotesClick?: () => void
}

export function GoalDetailScreen({ onBack, onNotesClick }: GoalDetailScreenProps) {
  const done = TASKS.filter(t => t.status === 'done').length

  return (
    <PageTransition>
      <div className="pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={28} />
          <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer">← back</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: GOAL.color }} />
            <h1 className="text-xl font-bold text-text-primary" style={{ letterSpacing: '-0.01em' }}>
              {GOAL.label}
            </h1>
          </div>
          <p className="text-xs text-text-muted mb-10 ml-7">
            By {GOAL.target} · {GOAL.weeklyHours}h/week
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[0.625rem] text-text-muted tracking-widest uppercase">This week's tasks</p>
            <p className="text-xs text-text-muted">{done}/{TASKS.length}</p>
          </div>

          <div className="flex flex-col gap-3">
            {TASKS.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="flex items-center gap-4"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
                  backgroundColor: task.status === 'done' ? `${GOAL.color}20` : task.status === 'current' ? `${GOAL.color}12` : 'transparent',
                  border: task.status === 'upcoming' ? '1.5px solid #D4CCC0' : 'none',
                }}>
                  {task.status === 'done' && <span className="text-[0.5rem]" style={{ color: GOAL.color }}>✓</span>}
                  {task.status === 'current' && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GOAL.color }} />}
                </div>
                <span className={`text-sm flex-1 ${task.status === 'done' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                  {task.text}
                </span>
                <span className="text-xs text-text-muted/50">{task.day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {PAST.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12">
            <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Previous weeks</p>
            <div className="flex flex-col gap-3">
              {PAST.map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-[0.5rem]" style={{ color: GOAL.color }}>✓</span>
                  <span className="text-sm text-text-muted flex-1">{m.text}</span>
                  <span className="text-xs text-text-muted/50">{m.week}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {onNotesClick && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12">
            <button
              onClick={onNotesClick}
              className="text-sm text-olive hover:text-olive-hover cursor-pointer"
            >
              Task board & notes →
            </button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
