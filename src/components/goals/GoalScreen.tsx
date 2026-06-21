import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { Button } from '../ui/Button'
import { exportGoalSchedule } from '../../lib/export'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'
import { goalService } from '../../services/GoalService'
import { scheduleService } from '../../services/ScheduleService'
import { Cat } from '../cat/Cat'

type ViewMode = 'plan' | 'tasks'

interface Task {
  id: string
  text: string
  day: string
  time: string
  done: boolean
  description: string
  output: string
  estimatedMinutes: number
  weekNumber: number | null
}

interface Note {
  id: number
  text: string
  createdAt: string
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface GoalScreenProps {
  goalId: number | null
  onBack: () => void
}

export function GoalScreen({ goalId, onBack }: GoalScreenProps) {
  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  const goal = goals.find(g => String(g.id) === String(goalId)) ?? goals[0]
  const goalLabel = goal ? getGoalDisplayName(goal) : 'Goal'
  const goalColor = goal ? getGoalColor(goal.colorId).bg : '#B08455'
  const numericGoalId = goal ? Number(goal.id) : 0

  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [breakingDown, setBreakingDown] = useState(false)
  const [rescheduling, setRescheduling] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('plan')
  const [newTask, setNewTask] = useState('')
  const [newDay, setNewDay] = useState('Mon')
  const [newDesc, setNewDesc] = useState('')
  const [newOutput, setNewOutput] = useState('')
  const [newNote, setNewNote] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showPanel, setShowPanel] = useState(true)

  useEffect(() => {
    if (numericGoalId) loadData()
  }, [numericGoalId])

  async function loadData() {
    setLoading(true)
    try {
      const [tasksData, notesData] = await Promise.all([
        goalService.listTasks(numericGoalId),
        goalService.listNotes(numericGoalId),
      ])
      const mapped = (tasksData as Array<{ id: number; text: string; dayOfWeek: string; scheduledTime: string; status: string; description: string; output: string; estimatedMinutes: number; weekNumber: number | null }>).map(t => ({
        id: String(t.id),
        text: t.text,
        day: t.dayOfWeek || '',
        time: t.scheduledTime || '',
        done: t.status === 'DONE',
        description: t.description || '',
        output: t.output || '',
        estimatedMinutes: t.estimatedMinutes || 0,
        weekNumber: t.weekNumber,
      }))
      setTasks(mapped)
      setNotes(notesData as Note[])
    } catch {}
    setLoading(false)
  }

  async function handleBreakdown() {
    setBreakingDown(true)
    try {
      await goalService.breakdownGoal(numericGoalId)
      await loadData()
    } catch {}
    setBreakingDown(false)
  }

  async function handleReschedule() {
    setRescheduling(true)
    try {
      const today = new Date()
      const day = today.getDay()
      const diff = today.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(today)
      monday.setDate(diff)
      await scheduleService.reschedule(monday.toISOString().split('T')[0])
    } catch {}
    setRescheduling(false)
  }

  async function toggleDone(id: string) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    try {
      await goalService.updateTask(numericGoalId, Number(id), { status: task.done ? 'PENDING' : 'DONE' })
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
      if (selectedTask?.id === id) setSelectedTask(prev => prev ? { ...prev, done: !prev.done } : null)
    } catch {}
  }

  async function removeTask(id: string) {
    try {
      await goalService.removeTask(numericGoalId, Number(id))
      setTasks(prev => prev.filter(t => t.id !== id))
      setSelectedTask(null)
    } catch {}
  }

  function updateSelected(field: keyof Task, value: string) {
    if (!selectedTask) return
    const updated = { ...selectedTask, [field]: value }
    setSelectedTask(updated)
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function saveSelectedTask() {
    if (!selectedTask) return
    try {
      await goalService.updateTask(numericGoalId, Number(selectedTask.id), {
        description: selectedTask.description,
        output: selectedTask.output,
        day_of_week: selectedTask.day,
        scheduled_time: selectedTask.time || undefined,
      })
    } catch {}
  }

  function handleReorderTasks(reordered: Task[]) {
    setTasks(reordered)
    const orderedIds = reordered.map(t => Number(t.id))
    goalService.reorderTasks(numericGoalId, orderedIds).catch(() => {})
  }

  async function addTask() {
    if (!newTask.trim()) return
    try {
      const created = await goalService.createTask(numericGoalId, {
        text: newTask.trim(),
        description: newDesc.trim() || undefined,
        output: newOutput.trim() || undefined,
        day_of_week: newDay,
      }) as { id: number; text: string; dayOfWeek: string; scheduledTime: string; description: string; output: string }
      setTasks(prev => [...prev, {
        id: String(created.id), text: created.text, day: created.dayOfWeek || '', time: created.scheduledTime || '',
        done: false, description: created.description || '', output: created.output || '', estimatedMinutes: 60, weekNumber: null,
      }])
      setNewTask(''); setNewDesc(''); setNewOutput('')
    } catch {}
  }

  async function addNote() {
    if (!newNote.trim()) return
    try {
      const created = await goalService.createNote(numericGoalId, newNote.trim()) as Note
      setNotes(prev => [created, ...prev])
      setNewNote('')
    } catch {}
  }

  const done = tasks.filter(t => t.done).length

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-6 pb-12 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
          <Cat state="thinking" size={48} />
        </div>
      </PageTransition>
    )
  }

  const tasksByDay: Record<string, Task[]> = {}
  for (const t of tasks) {
    const d = t.day || 'Unassigned'
    if (!tasksByDay[d]) tasksByDay[d] = []
    tasksByDay[d].push(t)
  }
  const dayGroups = [...DAYS.filter(d => tasksByDay[d]), ...(tasksByDay['Unassigned'] ? ['Unassigned'] : [])]

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <ScreenHeader message={`${done} of ${tasks.length} done`} />

        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" label="← back" onClick={onBack} />
          <div className="flex items-center gap-3">
            {tasks.length > 0 && (
              <div className="flex gap-1">
                {(['plan', 'tasks'] as const).map(v => (
                  <button key={v} onClick={() => { setViewMode(v); setSelectedTask(null) }}
                    className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors ${viewMode === v ? 'text-text-primary font-medium' : 'text-text-muted hover:text-text-muted'}`}
                  >{v}</button>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" label={showPanel ? 'Hide panel' : 'Show panel'} onClick={() => setShowPanel(!showPanel)} />
            <Button variant="ghost" size="sm" label="Export ↓" onClick={() => exportGoalSchedule(goalLabel, tasks, goalColor)} />
            <Button variant="primary" size="sm" label={rescheduling ? 'Rescheduling...' : 'Adjust times'} onClick={handleReschedule} disabled={rescheduling} />
          </div>
        </div>

        <GoalHeader goal={goal} goalColor={goalColor} goalLabel={goalLabel} done={done} total={tasks.length} />

        {tasks.length === 0 && (
          <FadeIn delay={0.1} className="flex flex-col items-center py-12">
            <Cat state="idle" size={40} />
            <p className="text-sm text-text-muted mt-4">No tasks yet. Let AI break down this goal.</p>
            <div className="mt-4">
              <Button variant="primary" size="sm" label={breakingDown ? 'Breaking down...' : 'Break down with AI'} onClick={handleBreakdown} disabled={breakingDown} />
            </div>
          </FadeIn>
        )}

        {tasks.length > 0 && (
          <AnimatePresence mode="wait">
            {viewMode === 'plan' ? (
              <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex gap-6">
                  <div className="flex-1 min-w-0">
                    <WeekPlanGrid tasks={tasks} goalColor={goalColor} selectedTask={selectedTask} onSelectTask={setSelectedTask} onReorderAll={handleReorderTasks} />
                  </div>

                  {showPanel && <SidePanel selectedTask={selectedTask} goalColor={goalColor} notes={notes} newNote={newNote} onNewNoteChange={setNewNote} onAddNote={addNote} onUpdate={updateSelected} onClose={() => { saveSelectedTask(); setSelectedTask(null) }} onRemove={() => selectedTask && removeTask(selectedTask.id)} onToggleDone={() => selectedTask && toggleDone(selectedTask.id)} />}
                </div>
              </motion.div>
            ) : (
              <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-[3rem_1fr_1fr_8rem_2rem] gap-x-4 mb-3 border-b border-border/40 pb-2">
                      <SectionLabel>Day</SectionLabel>
                      <SectionLabel>Task</SectionLabel>
                      <SectionLabel>Details</SectionLabel>
                      <SectionLabel>Output</SectionLabel>
                      <span />
                    </div>

                    <Reorder.Group axis="y" values={tasks} onReorder={handleReorderTasks}>
                      {tasks.map((task) => (
                        <Reorder.Item key={task.id} value={task} className="list-none">
                          <div
                            className={`grid grid-cols-[3rem_1fr_1fr_8rem_2rem] gap-x-4 items-center py-3 border-b border-border/20 cursor-grab active:cursor-grabbing transition-colors overflow-hidden ${selectedTask?.id === task.id ? 'bg-olive/[0.03]' : 'hover:bg-surface-hover'}`}
                            onClick={() => setSelectedTask(task)}>
                            <span className={`text-xs pt-0.5 ${task.done ? 'text-text-muted/50' : 'text-text-muted'}`}>{task.day || '—'}</span>
                            <span className={`text-sm ${task.done ? 'text-text-muted/50 line-through' : 'text-text-primary font-medium'}`}>{task.text}</span>
                            <span className={`text-xs truncate ${task.done ? 'text-text-muted/50' : 'text-text-muted'}`}>{task.description || '—'}</span>
                            <span className="text-xs truncate" style={{ color: task.done ? 'var(--color-text-muted)' : goalColor }}>{task.output || '—'}</span>
                            <div className="flex justify-center pt-0.5">
                              <motion.div className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                                style={task.done ? { backgroundColor: `${goalColor}18` } : { border: '1.5px solid var(--color-border)' }}
                                onClick={e => { e.stopPropagation(); toggleDone(task.id) }}
                                whileTap={{ scale: 1.4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                {task.done && <span className="text-[0.375rem]" style={{ color: goalColor }}>✓</span>}
                              </motion.div>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>

                    <div className="grid grid-cols-[3rem_1fr_1fr_8rem_2rem] gap-x-4 items-center py-3 border-b border-border/20">
                      <select value={newDay} onChange={e => setNewDay(e.target.value)} className="text-xs text-text-muted bg-transparent focus:outline-none cursor-pointer">
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Task name..."
                        className="text-sm text-text-primary bg-transparent focus:outline-none placeholder:text-text-muted/50" />
                      <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Details..."
                        className="text-xs text-text-muted bg-transparent focus:outline-none placeholder:text-text-muted/50" />
                      <input value={newOutput} onChange={e => setNewOutput(e.target.value)} placeholder="Output..."
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                        className="text-xs bg-transparent focus:outline-none placeholder:text-text-muted/50" style={{ color: goalColor }} />
                      <button onClick={addTask} className="text-xs text-olive hover:text-olive-hover cursor-pointer text-center">+</button>
                    </div>
                  </div>

                  {showPanel && <SidePanel selectedTask={selectedTask} goalColor={goalColor} notes={notes} newNote={newNote} onNewNoteChange={setNewNote} onAddNote={addNote} onUpdate={updateSelected} onClose={() => { saveSelectedTask(); setSelectedTask(null) }} onRemove={() => selectedTask && removeTask(selectedTask.id)} onToggleDone={() => selectedTask && toggleDone(selectedTask.id)} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  )
}

function GoalHeader({ goal, goalColor, goalLabel, done, total }: {
  goal: { id: string | number; label: string; currentStatus: string; successMetric: string; weeklyHours: number; targetDate: string } | undefined
  goalColor: string; goalLabel: string; done: number; total: number
}) {
  const updateGoal = useGoalsStore(s => s.updateGoal)
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(goal?.label || '')
  const [description, setDescription] = useState(goal?.currentStatus || '')
  const [hours, setHours] = useState(String(goal?.weeklyHours || 0))
  const [target, setTarget] = useState(goal?.targetDate || '')

  useEffect(() => {
    setLabel(goal?.label || '')
    setDescription(goal?.currentStatus || '')
    setHours(String(goal?.weeklyHours || 0))
    setTarget(goal?.targetDate || '')
    setEditing(false)
  }, [goal?.id])

  function save() {
    if (!goal) return
    updateGoal(String(goal.id), {
      label: label.trim() || goalLabel,
      currentStatus: description.trim(),
      weeklyHours: parseFloat(hours) || 0,
      targetDate: target || undefined,
    })
    setEditing(false)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goalColor }} />
        {editing ? (
          <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            className="text-lg font-bold text-text-primary bg-transparent border-b border-olive/40 pb-0.5 focus:outline-none flex-1" style={{ letterSpacing: '-0.02em' }} />
        ) : (
          <h1 className="text-lg font-bold text-text-primary cursor-pointer" style={{ letterSpacing: '-0.02em' }}
            onClick={() => setEditing(true)}>{goalLabel}</h1>
        )}
        <span className="text-xs text-text-muted ml-auto">{done}/{total}</span>
      </div>

      {editing ? (
        <FadeIn y={4} className="ml-5 mt-3 flex flex-col gap-3">
          <div>
            <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1">Description for AI</p>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="Describe what you want to achieve, context, constraints..."
              className="w-full text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive resize-none placeholder:text-text-muted/50" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1">Hours/week</p>
              <input type="number" min="0" max="40" step="1" value={hours} onChange={e => setHours(e.target.value)}
                className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive w-16" />
            </div>
            <div>
              <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1">Target date</p>
              <input type="date" value={target} onChange={e => setTarget(e.target.value)}
                className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive" />
            </div>
            <div className="ml-auto flex gap-2 pt-3">
              <Button variant="ghost" size="sm" label="Cancel" onClick={() => setEditing(false)} />
              <Button variant="primary" size="sm" label="Save" onClick={save} />
            </div>
          </div>
        </FadeIn>
      ) : (
        <>
          {description && <p className="text-xs text-text-muted ml-5 mb-2 line-clamp-2 cursor-pointer" onClick={() => setEditing(true)}>{description}</p>}
          <div className="h-[2px] bg-border/30 rounded-full overflow-hidden ml-5">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: goalColor }}
              initial={{ width: 0 }} animate={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
        </>
      )}
    </div>
  )
}

function formatTime12(t: string): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

function getWeekDates(): Array<{ day: string; date: number; fullDate: string }> {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

  return DAYS.map((day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { day, date: d.getDate(), fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
  })
}

function WeekPlanGrid({ tasks, goalColor, selectedTask, onSelectTask, onReorderAll }: {
  tasks: Task[]; goalColor: string; selectedTask: Task | null; onSelectTask: (t: Task) => void; onReorderAll: (tasks: Task[]) => void
}) {
  const weekDates = getWeekDates()
  const today = new Date()
  const todayDate = today.getDate().toString()

  const weekNumbers = [...new Set(tasks.map(t => t.weekNumber || 1))].sort((a, b) => a - b)
  const [activeWeek, setActiveWeek] = useState(weekNumbers[0] || 1)

  const weekTasks = tasks.filter(t => (t.weekNumber || 1) === activeWeek)
  const completedThisWeek = weekTasks.filter(t => t.done).length

  const tasksByDay: Record<string, Task[]> = {}
  for (const t of weekTasks) {
    const d = t.day || ''
    if (d) {
      if (!tasksByDay[d]) tasksByDay[d] = []
      tasksByDay[d].push(t)
    }
  }

  const unassigned = weekTasks.filter(t => !t.day)

  return (
    <div>
      {weekNumbers.length > 1 && (
        <div className="flex items-center gap-2 mb-6">
          {weekNumbers.map(wn => {
            const wTasks = tasks.filter(t => (t.weekNumber || 1) === wn)
            const wDone = wTasks.filter(t => t.done).length
            const allDone = wDone === wTasks.length && wTasks.length > 0
            return (
              <button
                key={wn}
                onClick={() => setActiveWeek(wn)}
                className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeWeek === wn ? 'font-semibold' : 'text-text-muted hover:text-text-secondary'} ${allDone ? 'opacity-40' : ''}`}
                style={activeWeek === wn ? { color: goalColor, backgroundColor: `${goalColor}10` } : {}}
              >
                Week {wn}
                <span className="text-[0.5rem] ml-1 opacity-60">{wDone}/{wTasks.length}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((col, di) => {
          const dayTasks = (tasksByDay[col.day] || []).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
          const isToday = col.date.toString() === todayDate

          function handleDayReorder(reordered: Task[]) {
            const otherTasks = tasks.filter(t => t.day !== col.day || (t.weekNumber || 1) !== activeWeek)
            onReorderAll([...otherTasks, ...reordered])
          }

          return (
            <div key={col.day}>
              <p className={`text-xs font-semibold mb-1 ${isToday ? 'text-olive' : 'text-text-muted'}`}>{col.day}</p>
              <p className={`text-[0.625rem] mb-4 ${isToday ? 'text-olive/50' : 'text-text-muted/50'}`}>{col.date}</p>
              {dayTasks.length === 0 ? (
                <p className="text-[0.625rem] text-text-muted/50">—</p>
              ) : (
                <Reorder.Group axis="y" values={dayTasks} onReorder={handleDayReorder} className="flex flex-col gap-4" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {dayTasks.map((task) => (
                    <Reorder.Item key={task.id} value={task} className="list-none">
                      <div
                        className={`cursor-grab active:cursor-grabbing transition-opacity ${task.done ? 'opacity-30' : ''} ${selectedTask?.id === task.id ? 'opacity-100' : 'hover:opacity-80'}`}
                        onClick={() => onSelectTask(task)}
                      >
                        <p className={`text-[0.6875rem] leading-snug ${task.done ? 'line-through' : ''}`} style={{ color: goalColor }}>
                          {task.text}
                        </p>
                        <p className="text-[0.5625rem] text-text-muted/50 mt-0.5">
                          {task.time ? formatTime12(task.time) : ''}{task.time && task.estimatedMinutes > 0 ? ' · ' : ''}{task.estimatedMinutes > 0 ? `${task.estimatedMinutes}min` : ''}
                        </p>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>
          )
        })}
      </div>

      {unassigned.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold text-text-muted mb-3">Unassigned</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(task => (
              <div key={task.id} className="rounded-lg px-3 py-2 cursor-pointer hover:opacity-80" style={{ backgroundColor: `${goalColor}08` }}
                onClick={() => onSelectTask(task)}>
                <p className="text-[0.6875rem]" style={{ color: goalColor }}>{task.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SidePanel({ selectedTask, goalColor, notes, newNote, onNewNoteChange, onAddNote, onUpdate, onClose, onRemove, onToggleDone }: {
  selectedTask: Task | null; goalColor: string; notes: Note[]; newNote: string
  onNewNoteChange: (v: string) => void; onAddNote: () => void
  onUpdate: (field: keyof Task, value: string) => void; onClose: () => void; onRemove: () => void; onToggleDone: () => void
}) {
  return (
    <div className="w-[15rem] shrink-0">
      <AnimatePresence mode="wait">
        {selectedTask ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }}>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" label="← notes" onClick={onClose} />
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer"
                style={selectedTask.done ? { backgroundColor: `${goalColor}18` } : { border: '1.5px solid var(--color-border)' }}
                onClick={onToggleDone}>
                {selectedTask.done && <span className="text-[0.3125rem]" style={{ color: goalColor }}>✓</span>}
              </div>
            </div>
            <p className={`text-sm font-semibold mb-4 ${selectedTask.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>{selectedTask.text}</p>
            <div className="mb-4">
              <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Description</p>
              <textarea value={selectedTask.description} onChange={e => onUpdate('description', e.target.value)} rows={3} placeholder="Add details..."
                className="w-full text-xs text-text-secondary leading-relaxed bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive resize-none placeholder:text-text-muted/50" />
            </div>
            <div className="mb-4">
              <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Output</p>
              <input value={selectedTask.output} onChange={e => onUpdate('output', e.target.value)} placeholder="What done means..."
                className="w-full text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50" />
            </div>
            <div className="mb-4">
              <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Time</p>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={selectedTask.time || ''}
                  onChange={e => onUpdate('time', e.target.value)}
                  className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive w-24"
                />
                <span className="text-[0.5625rem] text-text-muted">
                  {selectedTask.estimatedMinutes > 0 ? `${selectedTask.estimatedMinutes}min` : ''}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Day</p>
              <div className="flex flex-wrap gap-1">
                {DAYS.map(d => {
                  const today = new Date()
                  const dayIdx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(d)
                  const monday = new Date(today)
                  monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))
                  const date = new Date(monday)
                  date.setDate(monday.getDate() + dayIdx)
                  const dateStr = date.getDate().toString()

                  return (
                    <button key={d} onClick={() => onUpdate('day', d)}
                      className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors flex flex-col items-center ${selectedTask.day === d ? 'font-medium' : 'text-text-muted hover:text-text-secondary'}`}
                      style={selectedTask.day === d ? { color: goalColor } : {}}>
                      <span>{d}</span>
                      <span className="text-[0.5rem] opacity-50">{dateStr}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <Button variant="danger" size="sm" label="remove task" onClick={onRemove} />
          </motion.div>
        ) : (
          <motion.div key="notes" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }}>
            <SectionLabel className="mb-3">Notes</SectionLabel>
            <div className="flex gap-2 mb-4">
              <input value={newNote} onChange={e => onNewNoteChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onAddNote()}
                placeholder="Add a note..."
                className="flex-1 text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50" />
              <button onClick={onAddNote} className="text-xs text-olive hover:text-olive-hover cursor-pointer">+</button>
            </div>
            <div className="flex flex-col gap-3">
              {notes.map(note => (
                <div key={note.id}>
                  <p className="text-xs text-text-secondary leading-relaxed">{note.text}</p>
                  {note.createdAt && <p className="text-[0.5rem] text-text-muted/50 mt-0.5">{new Date(note.createdAt).toLocaleDateString()}</p>}
                </div>
              ))}
              {notes.length === 0 && <p className="text-xs text-text-muted/50">No notes yet.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
