import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

const GOALS = [
  { id: '1', label: 'Earn $10K/month from freelance clients', color: '#C4745C', done: 4, total: 7 },
  { id: '2', label: 'Launch startup MVP with 100 users', color: '#7A9A6D', done: 3, total: 5 },
  { id: '3', label: 'Build LinkedIn audience to 10K', color: '#B08455', done: 1, total: 4 },
]

interface GoalsListScreenProps {
  onGoalClick: (id: string) => void
}

export function GoalsListScreen({ onGoalClick }: GoalsListScreenProps) {
  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">LinkedIn is at 25%. Freelancing is on track. Startup needs 4 more hours.</span>
        </motion.div>

        <div className="flex flex-col gap-10">
          {GOALS.map((goal, i) => {
            const pct = goal.total > 0 ? (goal.done / goal.total) * 100 : 0
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                onClick={() => onGoalClick(goal.id)}
                className="cursor-pointer group"
              >
                <p className="text-lg font-semibold text-text-primary group-hover:text-olive transition-colors leading-snug" style={{ letterSpacing: '-0.01em' }}>
                  {goal.label}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-px bg-border/25 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: goal.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                    />
                  </div>
                  <span className="text-xs text-text-muted/50">{goal.done}/{goal.total}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
