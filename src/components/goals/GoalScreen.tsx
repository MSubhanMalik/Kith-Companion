import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { Button } from '../ui/Button'
import { exportGoalSchedule } from '../../lib/export'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'

type ViewMode = 'tasks' | 'plan'

interface Task {
  id: string
  text: string
  day: string
  time: string
  done: boolean
  description: string
  output: string
}

interface PlanDay {
  id: string
  day: string
  topic: string
  detail: string
  output: string
  done: boolean
}

interface PlanWeek {
  week: number
  days: PlanDay[]
}

const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Teach HTML fundamentals', day: 'Mon', time: '2:00 PM', done: true, description: 'Cover semantic HTML, forms, tables. Use MDN as reference.', output: 'Intern builds a basic portfolio page' },
  { id: '2', text: 'Cover Git basics', day: 'Wed', time: '2:00 PM', done: true, description: 'Init, add, commit, push, pull, branches. Use GitHub.', output: 'Intern pushes first repo' },
  { id: '3', text: 'Teach CSS layout + flexbox', day: 'Fri', time: '2:00 PM', done: false, description: 'Box model, flexbox, responsive', output: 'Responsive layout' },
  { id: '4', text: 'Intro to React components', day: 'Mon', time: '2:00 PM', done: false, description: 'JSX, props, component composition.', output: 'Simple card-based UI' },
  { id: '5', text: 'React state management', day: 'Wed', time: '2:00 PM', done: false, description: 'useState, useEffect, lifting state.', output: 'Working todo app' },
  { id: '6', text: 'API design patterns', day: 'Fri', time: '2:00 PM', done: false, description: 'REST, endpoints, status codes.', output: 'API spec document' },
]

const INITIAL_PLAN: PlanWeek[] = [
  { week: 1, days: [
    { id: 'w1d1', day: 'Mon', topic: 'Intro + Overview', detail: 'Architecture, Git', output: 'Setup env', done: true },
    { id: 'w1d2', day: 'Tue', topic: 'JavaScript Basics', detail: 'Variables, arrays, functions', output: 'Exercises', done: true },
    { id: 'w1d3', day: 'Wed', topic: 'Async + DOM', detail: 'Promises, DOM basics', output: 'DOM manipulation', done: true },
    { id: 'w1d4', day: 'Thu', topic: 'DOM Deep Dive', detail: 'Events, listeners', output: 'Interactive page', done: true },
    { id: 'w1d5', day: 'Fri', topic: 'HTTP + Server', detail: 'API, request/response', output: 'Node CRUD', done: true },
    { id: 'w1d6', day: 'Sat', topic: 'API Practice', detail: 'Fetch + Postman', output: 'Connect to API', done: true },
  ]},
  { week: 2, days: [
    { id: 'w2d1', day: 'Mon', topic: 'React Basics', detail: 'Components, JSX', output: 'Simple UI', done: false },
    { id: 'w2d2', day: 'Tue', topic: 'State + Hooks', detail: 'useState, useEffect', output: 'Counter app', done: false },
    { id: 'w2d3', day: 'Wed', topic: 'Forms + Events', detail: 'Form handling', output: 'Input system', done: false },
    { id: 'w2d4', day: 'Thu', topic: 'API Integration', detail: 'Fetch in React', output: 'Connect backend', done: false },
    { id: 'w2d5', day: 'Fri', topic: 'Routing', detail: 'Pages navigation', output: 'Multi-page app', done: false },
    { id: 'w2d6', day: 'Sat', topic: 'Mini Project', detail: 'Dashboard UI', output: 'Student dashboard', done: false },
  ]},
  { week: 3, days: [
    { id: 'w3d1', day: 'Mon', topic: 'PostgreSQL', detail: 'Tables, relations', output: 'DB design', done: false },
    { id: 'w3d2', day: 'Tue', topic: 'Schema Design', detail: 'Entities', output: 'User tables', done: false },
    { id: 'w3d3', day: 'Wed', topic: 'Backend Structure', detail: 'Routes/controllers', output: 'Restructure API', done: false },
    { id: 'w3d4', day: 'Thu', topic: 'CRUD with DB', detail: 'SQL queries', output: 'Full CRUD', done: false },
    { id: 'w3d5', day: 'Fri', topic: 'Authentication', detail: 'JWT', output: 'Login system', done: false },
    { id: 'w3d6', day: 'Sat', topic: 'Full Integration', detail: 'React + Node + DB', output: 'Full stack', done: false },
  ]},
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface GoalScreenProps {
  onBack: () => void
}

export function GoalScreen({ onBack }: GoalScreenProps) {
  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  const goal = goals[2] ?? goals[0]
  const goalLabel = goal ? getGoalDisplayName(goal) : 'Goal'
  const goalColor = goal ? getGoalColor(goal.colorId).bg : '#B08455'

  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [plan, setPlan] = useState(INITIAL_PLAN)
  const [viewMode, setViewMode] = useState<ViewMode>('plan')
  const [newTask, setNewTask] = useState('')
  const [newDay, setNewDay] = useState('Mon')
  const [newDesc, setNewDesc] = useState('')
  const [newOutput, setNewOutput] = useState('')
  const [notes, setNotes] = useState('Intern learns best with live coding. Avoid slides.\nSession time: 2 PM daily.\nUse the company project as examples.')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showPanel, setShowPanel] = useState(true)
  const done = tasks.filter(t => t.done).length

  function toggleDone(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
    if (selectedTask?.id === id) setSelectedTask(prev => prev ? { ...prev, done: !prev.done } : null)
  }

  function removeTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTask(null)
  }

  function updateSelected(field: keyof Task, value: string) {
    if (!selectedTask) return
    const updated = { ...selectedTask, [field]: value }
    setSelectedTask(updated)
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  function addTask() {
    if (!newTask.trim()) return
    setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask.trim(), day: newDay, time: '2:00 PM', done: false, description: newDesc.trim(), output: newOutput.trim() }])
    setNewTask('')
    setNewDesc('')
    setNewOutput('')
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">{done} of {tasks.length} done</span>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-xs text-text-muted hover:text-text-muted cursor-pointer">← back</button>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(['plan', 'tasks'] as const).map(v => (
                <button key={v} onClick={() => { setViewMode(v); setSelectedTask(null) }}
                  className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors ${viewMode === v ? 'text-text-primary font-medium' : 'text-text-muted hover:text-text-muted'}`}
                >{v}</button>
              ))}
            </div>
            <button onClick={() => setShowPanel(!showPanel)} className={`text-[0.625rem] cursor-pointer transition-colors ${showPanel ? 'text-text-muted hover:text-olive' : 'text-olive'}`}>
              {showPanel ? 'Hide panel' : 'Show panel'}
            </button>
            <button onClick={() => exportGoalSchedule(goalLabel)} className="text-[0.625rem] text-text-muted hover:text-olive cursor-pointer transition-colors">Export ↓</button>
            <Button variant="primary" size="sm" label="Adjust times" onClick={() => {}} />
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

        <AnimatePresence mode="wait">
          {viewMode === 'plan' ? (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-8">
                <div className="flex-1 min-w-0">
                  {plan.map((week, wi) => {
                    const weekDone = week.days.every(d => d.done)
                    function reorderWeek(newDays: PlanDay[]) {
                      setPlan(prev => prev.map((w, i) => i === wi ? { ...w, days: newDays } : w))
                    }
                    return (
                      <motion.div key={wi} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.05 }} className="mb-8">
                        <p className={`text-xs font-semibold mb-3 ${weekDone ? 'text-text-muted/50' : ''}`} style={!weekDone ? { color: goalColor } : {}}>
                          Week {week.week} {weekDone && '· done'}
                        </p>
                        <Reorder.Group axis="x" values={week.days} onReorder={reorderWeek} className="grid grid-cols-3 gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {week.days.map((day) => (
                            <Reorder.Item key={day.id} value={day} className="list-none">
                              <div
                                className={`rounded-xl px-3.5 py-3 cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform ${day.done ? 'opacity-30' : ''} ${selectedTask?.id === day.id ? 'ring-1 ring-olive/30' : ''}`}
                                style={{ backgroundColor: day.done ? 'var(--color-surface-hover)' : `${goalColor}06` }}
                                onClick={() => setSelectedTask({ id: day.id, text: day.topic, day: day.day, time: '2:00 PM', done: day.done, description: day.detail, output: day.output })}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[0.625rem] text-text-muted">{day.day}</span>
                                  {day.done && <span className="text-[0.375rem]" style={{ color: goalColor }}>✓</span>}
                                </div>
                                <p className={`text-[0.8125rem] font-medium leading-snug ${day.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>{day.topic}</p>
                                <p className="text-[0.625rem] text-text-muted mt-0.5">{day.detail}</p>
                                <p className="text-[0.625rem] mt-1.5" style={{ color: day.done ? 'var(--color-text-muted)' : goalColor }}>→ {day.output}</p>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </motion.div>
                    )
                  })}
                </div>

                {showPanel && <div className="w-[15rem] shrink-0">
                  <AnimatePresence mode="wait">
                    {selectedTask ? (
                      <TaskDetailPanel key="detail" task={selectedTask} goalColor={goalColor} onUpdate={updateSelected} onClose={() => setSelectedTask(null)} onRemove={() => removeTask(selectedTask.id)} onToggleDone={() => toggleDone(selectedTask.id)} />
                    ) : (
                      <NotesPanel key="notes" notes={notes} onNotesChange={setNotes} />
                    )}
                  </AnimatePresence>
                </div>}
              </div>
            </motion.div>
          ) : (
            <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-6">
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-[2.5rem_3rem_1fr_1fr_8rem_2rem] gap-x-4 text-[0.625rem] text-text-muted tracking-widest uppercase mb-3 border-b border-border/40 pb-2">
                    <span>Wk</span>
                    <span>Day</span>
                    <span>Task</span>
                    <span>Details</span>
                    <span>Output</span>
                    <span />
                  </div>

                  {tasks.map((task, i) => {
                    const weekNum = Math.floor(i / 3) + 1
                    const showWeek = i % 3 === 0
                    return (
                    <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`grid grid-cols-[2.5rem_3rem_1fr_1fr_8rem_2rem] gap-x-4 items-center py-3 border-b border-border/20 cursor-pointer transition-colors overflow-hidden ${selectedTask?.id === task.id ? 'bg-olive/[0.03]' : 'hover:bg-surface-hover'}`}
                      onClick={() => setSelectedTask(task)}>
                      <span className="text-xs pt-0.5 font-semibold" style={{ color: showWeek ? goalColor : 'transparent' }}>{showWeek ? weekNum : ''}</span>
                      <span className={`text-xs pt-0.5 ${task.done ? 'text-text-muted/50' : 'text-text-muted'}`}>{task.day}</span>
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
                    </motion.div>
                    )
                  })}

                  <div className="grid grid-cols-[2.5rem_3rem_1fr_1fr_8rem_2rem] gap-x-4 items-center py-3 border-b border-border/20">
                    <span />
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

                {showPanel && <div className="w-[14rem] shrink-0">
                  <AnimatePresence mode="wait">
                    {selectedTask ? (
                      <TaskDetailPanel key="detail" task={selectedTask} goalColor={goalColor} onUpdate={updateSelected} onClose={() => setSelectedTask(null)} onRemove={() => removeTask(selectedTask.id)} onToggleDone={() => toggleDone(selectedTask.id)} />
                    ) : (
                      <NotesPanel key="notes" notes={notes} onNotesChange={setNotes} />
                    )}
                  </AnimatePresence>
                </div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

function TaskDetailPanel({ task, goalColor, onUpdate, onClose, onRemove, onToggleDone }: {
  task: Task
  goalColor: string
  onUpdate: (field: keyof Task, value: string) => void
  onClose: () => void
  onRemove: () => void
  onToggleDone: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="text-[0.625rem] text-text-muted hover:text-text-secondary cursor-pointer">← notes</button>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer"
            style={task.done ? { backgroundColor: `${goalColor}18` } : { border: '1.5px solid var(--color-border)' }}
            onClick={onToggleDone}>
            {task.done && <span className="text-[0.3125rem]" style={{ color: goalColor }}>✓</span>}
          </div>
        </div>
      </div>

      <p className={`text-sm font-semibold mb-4 ${task.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>{task.text}</p>

      <div className="mb-4">
        <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Description</p>
        <textarea value={task.description} onChange={e => onUpdate('description', e.target.value)} rows={3} placeholder="Add details..."
          className="w-full text-xs text-text-secondary leading-relaxed bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive resize-none placeholder:text-text-muted/50" />
      </div>

      <div className="mb-4">
        <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Output</p>
        <input value={task.output} onChange={e => onUpdate('output', e.target.value)} placeholder="What done means..."
          className="w-full text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50" />
      </div>

      <div className="mb-4">
        <p className="text-[0.5625rem] text-text-muted tracking-widest uppercase mb-1.5">Schedule</p>
        <div className="flex flex-wrap gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <button key={d} onClick={() => onUpdate('day', d)}
              className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors ${task.day === d ? 'font-medium' : 'text-text-muted hover:text-text-secondary'}`}
              style={task.day === d ? { color: goalColor } : {}}>{d}</button>
          ))}
        </div>
      </div>

      <button onClick={onRemove} className="text-[0.625rem] text-text-muted/50 hover:text-direction cursor-pointer">remove task</button>
    </motion.div>
  )
}

function NotesPanel({ notes, onNotesChange }: { notes: string; onNotesChange: (v: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }}>
      <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-3">Notes</p>
      <textarea value={notes} onChange={e => onNotesChange(e.target.value)} rows={12}
        className="w-full text-xs text-text-secondary leading-relaxed bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive resize-none placeholder:text-text-muted/50"
        placeholder="Add notes..." />
    </motion.div>
  )
}
