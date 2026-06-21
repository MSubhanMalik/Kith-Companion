import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { Button } from '../ui/Button'
import { useGoalsStore } from '../../stores/goals'
import { useScheduleStore } from '../../stores/schedule'
import { getGoalColor } from '../../lib/colors'
import { DAY_LABELS } from '../../types'
import { goalService } from '../../services/GoalService'

interface GoalsListScreenProps {
  onGoalClick: (id: number) => void
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
  const [taskCounts, setTaskCounts] = useState<Record<string, { done: number; total: number }>>({})

  useEffect(() => {
    async function loadCounts() {
      const counts: Record<string, { done: number; total: number }> = {}
      await Promise.all(goals.map(async (g) => {
        try {
          const tasks = await goalService.listTasks(Number(g.id)) as Array<{ status: string }>
          counts[g.id] = { done: tasks.filter(t => t.status === 'DONE').length, total: tasks.length }
        } catch {}
      }))
      setTaskCounts(counts)
    }
    if (goals.length > 0) loadCounts()
  }, [goals])

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
        <ScreenHeader catState="idle" message={`${goals.length} goals · drag to reprioritize`} />

        <div className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 mb-2 px-1">
          <SectionLabel>Goal</SectionLabel>
          <SectionLabel>Tasks</SectionLabel>
          <SectionLabel>Hours</SectionLabel>
          <SectionLabel className="text-right">Status</SectionLabel>
        </div>

        <Reorder.Group axis="y" values={publicGoals} onReorder={handleReorder}>
          {publicGoals.map((goal) => {
            const color = getGoalColor(goal.colorId)
            return (
              <Reorder.Item key={goal.id} value={goal} className="list-none">
                <div
                  className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 items-center py-3 px-1 cursor-pointer rounded-lg hover:bg-surface-hover transition-colors"
                  onClick={() => onGoalClick(Number(goal.id))}
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
                  <span className="text-xs text-text-muted/50">{taskCounts[goal.id]?.done ?? 0}/{taskCounts[goal.id]?.total ?? 0}</span>
                  <span className="text-xs text-text-muted/50">{goal.weeklyHours}h</span>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-text-muted truncate max-w-[5rem]">{(goal.currentStatus && goal.currentStatus.length > 20) ? 'active' : (goal.currentStatus || 'new')}</span>
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
          <FadeIn delay={0.2} y={0} className="mt-10">
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
                        <FadeIn
                          key={goal.id}
                          delay={i * 0.05}
                          y={4}
                        >
                          <div
                            className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-3 items-center py-3 px-1 cursor-pointer rounded-lg hover:bg-surface-hover transition-colors"
                            onClick={() => onGoalClick(Number(goal.id))}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bg }} />
                              <span className="text-sm font-medium text-text-primary truncate">{goal.nickname}</span>
                              <span className="text-[0.5rem] text-olive">🔒</span>
                            </div>
                            <span className="text-xs text-text-muted/50">{taskCounts[goal.id]?.done ?? 0}/{taskCounts[goal.id]?.total ?? 0}</span>
                            <span className="text-xs text-text-muted/50">{goal.weeklyHours}h</span>
                            <span className="text-xs text-right text-text-muted truncate max-w-[5rem]">{(goal.currentStatus && goal.currentStatus.length > 20) ? 'active' : (goal.currentStatus || 'new')}</span>
                          </div>
                        </FadeIn>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        )}

        <LifeBlocksSection />
      </div>
    </PageTransition>
  )
}

function LifeBlocksSection() {
  const lifeBlocks = useScheduleStore(s => s.lifeBlocks)
  const addLifeBlock = useScheduleStore(s => s.addLifeBlock)
  const removeLifeBlock = useScheduleStore(s => s.removeLifeBlock)
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newStart, setNewStart] = useState('09:00')
  const [newEnd, setNewEnd] = useState('17:00')

  function handleAdd() {
    if (!newLabel.trim()) return
    addLifeBlock({
      label: newLabel.trim(),
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      time: { start: newStart, end: newEnd },
    })
    setNewLabel('')
    setNewStart('09:00')
    setNewEnd('17:00')
    setAdding(false)
  }

  return (
    <FadeIn delay={0.25} y={0} className="mt-12">
      <SectionLabel className="mb-4">Non-negotiables</SectionLabel>
      {lifeBlocks.map((b) => {
        const dayLabels = b.days.map(d => DAY_LABELS[d as keyof typeof DAY_LABELS] || d)
        const dayRange = dayLabels.length === 7 ? 'Every day' : dayLabels.join(', ')
        const start = formatHour(b.time.start)
        const end = formatHour(b.time.end)
        return (
          <div key={b.id} className="flex items-center justify-between py-2.5 group">
            <span className="text-sm text-text-primary">{b.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">{start}–{end} · {dayRange}</span>
              <button onClick={() => removeLifeBlock(b.id)} className="text-[0.625rem] text-text-muted/0 group-hover:text-text-muted/50 hover:!text-direction cursor-pointer transition-colors">✕</button>
            </div>
          </div>
        )
      })}
      {adding ? (
        <div className="flex items-center gap-2 mt-2">
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50" />
          <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)}
            className="text-xs text-text-muted bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive w-20" />
          <span className="text-xs text-text-muted">–</span>
          <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)}
            className="text-xs text-text-muted bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive w-20" />
          <button onClick={handleAdd} className="text-xs text-olive hover:text-olive-hover cursor-pointer">add</button>
          <button onClick={() => setAdding(false)} className="text-xs text-text-muted hover:text-text-muted cursor-pointer">cancel</button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" label="+ add block" onClick={() => setAdding(true)} />
      )}
    </FadeIn>
  )
}

function formatHour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}
