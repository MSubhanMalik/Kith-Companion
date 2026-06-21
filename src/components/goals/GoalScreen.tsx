import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      const mapped = (tasksData as Array<{ id: number; text: string; dayOfWeek: string; scheduledTime: string; status: string; description: string; output: string; estimatedMinutes: number }>).map(t => ({
        id: String(t.id),
        text: t.text,
        day: t.dayOfWeek || '',
        time: t.scheduledTime || '',
        done: t.status === 'DONE',
        description: t.description || '',
        output: t.output || '',
        estimatedMinutes: t.estimatedMinutes || 0,
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
        done: false, description: created.description || '', output: created.output || '', estimatedMinutes: 60,
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

        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goalColor }} />
            <h1 className="text-lg font-bold text-text-primary" style={{ letterSpacing: '-0.02em' }}>{goalLabel}</h1>
            <span className="text-xs text-text-muted ml-auto">{done}/{tasks.length}</span>
          </div>
          <div className="h-[2px] bg-border/30 rounded-full overflow-hidden ml-5">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: goalColor }}
              initial={{ width: 0 }} animate={{ width: `${tasks.length > 0 ? (done / tasks.length) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
        </div>

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
                <div className="flex gap-8">
                  <div className="flex-1 min-w-0">
                    {dayGroups.map((day, di) => (
                      <FadeIn key={day} delay={di * 0.05} y={6} className="mb-6">
                        <p className="text-xs font-semibold mb-3" style={{ color: day === 'Unassigned' ? 'var(--color-text-muted)' : goalColor }}>{day}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(tasksByDay[day] || []).map((task) => (
                            <div
                              key={task.id}
                              className={`rounded-xl px-3.5 py-3 cursor-pointer hover:scale-[1.02] transition-transform ${task.done ? 'opacity-30' : ''} ${selectedTask?.id === task.id ? 'ring-1 ring-olive/30' : ''}`}
                              style={{ backgroundColor: task.done ? 'var(--color-surface-hover)' : `${goalColor}06` }}
                              onClick={() => setSelectedTask(task)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                {task.estimatedMinutes > 0 && <span className="text-[0.5625rem] text-text-muted">{task.estimatedMinutes}min</span>}
                                {task.done && <span className="text-[0.375rem]" style={{ color: goalColor }}>✓</span>}
                              </div>
                              <p className={`text-[0.8125rem] font-medium leading-snug ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>{task.text}</p>
                              {task.description && <p className="text-[0.625rem] text-text-muted mt-0.5 line-clamp-2">{task.description}</p>}
                              {task.output && <p className="text-[0.625rem] mt-1.5" style={{ color: task.done ? 'var(--color-text-muted)' : goalColor }}>→ {task.output}</p>}
                            </div>
                          ))}
                        </div>
                      </FadeIn>
                    ))}
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

                    {tasks.map((task, i) => (
                      <FadeIn key={task.id} delay={i * 0.02} y={0}>
                        <div
                          className={`grid grid-cols-[3rem_1fr_1fr_8rem_2rem] gap-x-4 items-center py-3 border-b border-border/20 cursor-pointer transition-colors overflow-hidden ${selectedTask?.id === task.id ? 'bg-olive/[0.03]' : 'hover:bg-surface-hover'}`}
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
                      </FadeIn>
                    ))}

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
