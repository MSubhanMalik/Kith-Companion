import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

interface Goal {
  id: string
  label: string
  color: string
  done: number
  total: number
  hours: string
  status: string
  private: boolean
  nickname: string
}

const INITIAL: Goal[] = [
  { id: '1', label: 'Earn $10K/month from freelancing', color: '#C4745C', done: 4, total: 7, hours: '12/16h', status: 'on track', private: false, nickname: '' },
  { id: '2', label: 'Launch startup MVP', color: '#7A9A6D', done: 2, total: 5, hours: '6/10h', status: 'behind', private: false, nickname: '' },
  { id: '3', label: 'Train intern — web dev', color: '#B08455', done: 2, total: 6, hours: '4/6h', status: 'on track', private: false, nickname: '' },
]

const PRIVATE_GOALS: Goal[] = [
  { id: 'p1', label: 'Talk to girls with confidence', color: '#9B7BA8', done: 1, total: 4, hours: '2/4h', status: 'on track', private: true, nickname: 'Social' },
  { id: 'p2', label: 'Fix relationship with dad', color: '#5E9E94', done: 0, total: 2, hours: '0/2h', status: 'new', private: true, nickname: 'Family' },
]

interface GoalsListScreenProps {
  onGoalClick: (id: string) => void
}

export function GoalsListScreen({ onGoalClick }: GoalsListScreenProps) {
  const [goals, setGoals] = useState(INITIAL)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState('')
  const [privateExpanded, setPrivateExpanded] = useState(false)

  function updateGoal(id: string, label: string) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, label } : g))
  }

  function addGoal() {
    if (!newGoal.trim()) return
    const COLORS = ['#C4745C', '#7A9A6D', '#B08455', '#7889A0', '#9B7BA8', '#5E9E94']
    setGoals(prev => [...prev, {
      id: Date.now().toString(),
      label: newGoal.trim(),
      color: COLORS[prev.length % COLORS.length],
      done: 0, total: 0, hours: '0/0h', status: 'new',
      private: false, nickname: '',
    }])
    setNewGoal('')
  }

  function removeGoal(id: string) {
    setGoals(prev => prev.filter(g => g.id !== id))
    setEditingId(null)
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">{goals.length + PRIVATE_GOALS.length} goals · drag to reprioritize</span>
        </motion.div>

        <div className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 text-[0.625rem] text-text-muted tracking-widest uppercase mb-2 px-1">
          <span>Goal</span>
          <span>Tasks</span>
          <span>Hours</span>
          <span className="text-right">Status</span>
        </div>

        <Reorder.Group axis="y" values={goals} onReorder={setGoals}>
          {goals.map((goal) => (
            <Reorder.Item key={goal.id} value={goal} className="list-none">
              <div
                className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 items-center py-3 px-1 cursor-pointer rounded-lg hover:bg-surface-hover transition-colors"
                onClick={() => onGoalClick(goal.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: goal.color }} />
                  {editingId === goal.id ? (
                    <input autoFocus value={goal.label}
                      onChange={e => updateGoal(goal.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 text-sm font-medium text-text-primary bg-transparent border-b border-olive/40 pb-0.5 focus:outline-none" />
                  ) : (
                    <span className="text-sm font-medium text-text-primary truncate"
                      onDoubleClick={(e) => { e.stopPropagation(); setEditingId(goal.id) }}>
                      {goal.label}
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-muted/50">{goal.done}/{goal.total}</span>
                <span className="text-xs text-text-muted/50">{goal.hours}</span>
                <div className="flex items-center justify-end gap-2">
                  <span className={`text-xs ${goal.status === 'behind' ? 'text-direction' : 'text-text-muted'}`}>{goal.status}</span>
                  {editingId === goal.id && (
                    <button onClick={() => removeGoal(goal.id)} className="text-[0.625rem] text-text-muted/50 hover:text-direction cursor-pointer">✕</button>
                  )}
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex items-center gap-3 mt-4 px-1">
          <div className="w-2 h-2 rounded-full bg-border/40 shrink-0" />
          <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder="add a goal..."
            className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50" />
        </div>

        <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <button
            onClick={() => setPrivateExpanded(!privateExpanded)}
            className="flex items-center gap-2 text-sm text-text-muted cursor-pointer hover:text-text-secondary transition-colors"
          >
            <span className="text-xs transition-transform" style={{ transform: privateExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
            <span>🔒</span>
            <span>Private goals · {PRIVATE_GOALS.length}</span>
          </button>

          <AnimatePresence>
            {privateExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3">
                  {PRIVATE_GOALS.map((goal, i) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 items-center py-3 px-1 cursor-pointer rounded-lg hover:bg-surface-hover transition-colors"
                      onClick={() => onGoalClick(goal.id)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: goal.color }} />
                        <span className="text-sm font-medium text-text-primary truncate">{goal.nickname}</span>
                        <span className="text-[0.5rem] text-olive">🔒</span>
                      </div>
                      <span className="text-xs text-text-muted/50">{goal.done}/{goal.total}</span>
                      <span className="text-xs text-text-muted/50">{goal.hours}</span>
                      <span className={`text-xs text-right ${goal.status === 'behind' ? 'text-direction' : 'text-text-muted'}`}>{goal.status}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  )
}
