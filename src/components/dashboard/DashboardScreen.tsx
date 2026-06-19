import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

const GOALS = [
  { label: 'Freelancing', color: '#C4745C', hoursTarget: 16, hoursDone: 12, tasksTotal: 7, tasksDone: 4 },
  { label: 'Startup', color: '#7A9A6D', hoursTarget: 10, hoursDone: 6, tasksTotal: 5, tasksDone: 3 },
  { label: 'LinkedIn', color: '#B08455', hoursTarget: 6, hoursDone: 2, tasksTotal: 4, tasksDone: 1 },
]

const INSIGHTS = [
  'Freelancing is on pace. 3 days left, 3 tasks remaining.',
  'LinkedIn is behind — 1 of 4 tasks done with 2 days left.',
]

interface DashboardScreenProps {
  onGoalClick?: () => void
}

export function DashboardScreen({ onGoalClick }: DashboardScreenProps) {
  const totalDone = GOALS.reduce((s, g) => s + g.tasksDone, 0)
  const totalTasks = GOALS.reduce((s, g) => s + g.tasksTotal, 0)

  return (
    <PageTransition>
      <div className="pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={28} />
          <p className="text-sm text-text-muted">Week of Jun 16</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-12"
        >
          <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ letterSpacing: '-0.02em' }}>Progress</h1>

          <div className="flex gap-10 mt-6">
            <div>
              <span className="text-3xl font-bold text-text-primary">{totalDone}</span>
              <span className="text-sm text-text-muted">/{totalTasks}</span>
              <p className="text-xs text-text-muted mt-0.5">tasks done</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-text-primary">20</span>
              <span className="text-sm text-text-muted">/32</span>
              <p className="text-xs text-text-muted mt-0.5">hours completed</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8 mb-12">
          {GOALS.map((goal, i) => {
            const pct = goal.hoursTarget > 0 ? (goal.hoursDone / goal.hoursTarget) * 100 : 0
            return (
              <motion.div
                key={goal.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={onGoalClick}
                className={onGoalClick ? 'cursor-pointer' : ''}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
                    <span className="text-sm font-medium text-text-primary">{goal.label}</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {goal.hoursDone}h / {goal.hoursTarget}h · {goal.tasksDone}/{goal.tasksTotal} tasks
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, pct)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <Cat state="thinking" size={24} />
            <div className="flex flex-col gap-2">
              {INSIGHTS.map((text, i) => (
                <p key={i} className="text-sm text-text-secondary leading-relaxed">{text}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
