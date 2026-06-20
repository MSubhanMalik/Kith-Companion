import { useState, useMemo } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'

interface GoalsListScreenProps {
  onGoalClick: (id: string) => void
}

export function GoalsListScreen({ onGoalClick }: GoalsListScreenProps) {
  const goals = useGoalsStore(s => s.goals)
  const addGoalToStore = useGoalsStore(s => s.addGoal)
  const updateGoalInStore = useGoalsStore(s => s.updateGoal)
  const removeGoalFromStore = useGoalsStore(s => s.removeGoal)
  const reorderGoals = useGoalsStore(s => s.reorderGoals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  const publicGoals = useMemo(() => goals.filter(g => !g.isPrivate), [goals])
  const privateGoals = useMemo(() => goals.filter(g => g.isPrivate), [goals])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState('')
  const [privateExpanded, setPrivateExpanded] = useState(false)

  function updateGoal(id: string, label: string) {
    updateGoalInStore(id, { label })
  }

  function addGoal() {
    if (!newGoal.trim()) return
    addGoalToStore(newGoal.trim(), 0)
    setNewGoal('')
  }

  function removeGoal(id: string) {
    removeGoalFromStore(id)
    setEditingId(null)
  }

  function handleReorder(reordered: typeof publicGoals) {
    const allIds = [...reordered.map(g => g.id), ...privateGoals.map(g => g.id)]
    reorderGoals(allIds)
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">{goals.length} goals · drag to reprioritize</span>
        </motion.div>

        <div className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 text-[0.625rem] text-text-muted tracking-widest uppercase mb-2 px-1">
          <span>Goal</span>
          <span>Tasks</span>
          <span>Hours</span>
          <span className="text-right">Status</span>
        </div>

        <Reorder.Group axis="y" values={publicGoals} onReorder={handleReorder}>
          {publicGoals.map((goal) => {
            const color = getGoalColor(goal.colorId)
            return (
              <Reorder.Item key={goal.id} value={goal} className="list-none">
                <div
                  className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 items-center py-3 px-1 cursor-pointer rounded-lg hover:bg-surface-hover transition-colors"
                  onClick={() => onGoalClick(goal.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bg }} />
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
                        {getGoalDisplayName(goal)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-muted/50">0/0</span>
                  <span className="text-xs text-text-muted/50">0/{goal.weeklyHours}h</span>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-text-muted">{goal.currentStatus || 'new'}</span>
                    {editingId === goal.id && (
                      <button onClick={() => removeGoal(goal.id)} className="text-[0.625rem] text-text-muted/50 hover:text-direction cursor-pointer">✕</button>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>

        <div className="flex items-center gap-3 mt-4 px-1">
          <div className="w-2 h-2 rounded-full bg-border/40 shrink-0" />
          <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder="add a goal..."
            className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50" />
        </div>

        {privateGoals.length > 0 && (
          <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button
              onClick={() => setPrivateExpanded(!privateExpanded)}
              className="flex items-center gap-2 text-sm text-text-muted cursor-pointer hover:text-text-secondary transition-colors"
            >
              <span className="text-xs transition-transform" style={{ transform: privateExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
              <span>🔒</span>
              <span>Private goals · {privateGoals.length}</span>
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
                    {privateGoals.map((goal, i) => {
                      const color = getGoalColor(goal.colorId)
                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 items-center py-3 px-1 cursor-pointer rounded-lg hover:bg-surface-hover transition-colors"
                          onClick={() => onGoalClick(goal.id)}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bg }} />
                            <span className="text-sm font-medium text-text-primary truncate">{goal.nickname}</span>
                            <span className="text-[0.5rem] text-olive">🔒</span>
                          </div>
                          <span className="text-xs text-text-muted/50">0/0</span>
                          <span className="text-xs text-text-muted/50">0/{goal.weeklyHours}h</span>
                          <span className="text-xs text-right text-text-muted">{goal.currentStatus || 'new'}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
