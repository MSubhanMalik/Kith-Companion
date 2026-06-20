import { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { TaskModal } from '../goals/TaskModal'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'

interface Task {
  id: string
  time: string
  task: string
  goal: string
  output: string
  color: string
  status: 'done' | 'active' | 'upcoming'
}

const INITIAL_TASKS: Task[] = [
  { id: '1', time: '5:30 PM', task: 'Send 5 cold DMs to agency founders', goal: 'Freelancing', output: '5 personalized DMs sent', color: '#C4745C', status: 'done' },
  { id: '2', time: '7:00 PM', task: 'Follow up on API client re: SOW', goal: 'Freelancing', output: 'Follow-up email with next steps', color: '#C4745C', status: 'done' },
  { id: '3', time: '8:00 PM', task: 'Gym', goal: '', output: '', color: '', status: 'done' },
  { id: '4', time: '9:30 PM', task: 'Build Stripe checkout flow', goal: 'Startup', output: 'Test payment works on staging', color: '#7A9A6D', status: 'active' },
  { id: '5', time: '11:30 PM', task: 'Write LinkedIn post: weekly recap', goal: 'LinkedIn', output: 'Post drafted and scheduled', color: '#B08455', status: 'upcoming' },
]

export function HomeScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState('')

  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  const goalsSummary = goals.filter(g => !g.isPrivate).map(g => {
    const color = getGoalColor(g.colorId)
    return {
      label: getGoalDisplayName(g),
      color: color.bg,
      done: 0,
      total: 0,
    }
  })

  const doneCount = tasks.filter(t => t.status === 'done').length

  function toggleDone(id: string) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      if (t.status === 'done') return { ...t, status: 'upcoming' as const }
      return { ...t, status: 'done' as const }
    }))
  }

  function addTask() {
    if (!newTask.trim()) return
    const id = Date.now().toString()
    setTasks(prev => [...prev, { id, time: '—', task: newTask.trim(), goal: '', output: '', color: '#9C8F80', status: 'upcoming' as const }])
    setNewTask('')
  }

  function removeTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTask(null)
  }

  if (tasks.length === 0) {
    return (
      <PageTransition>
        <div className="pt-6 pb-12 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
          <Cat state="idle" size={48} />
          <p className="text-text-secondary mt-6 text-center">No tasks today.<br />Add a goal to get started.</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <ScreenHeader
          catState="idle"
          message={`Wednesday · ${doneCount} of ${tasks.length} done`}
          right={
            doneCount >= tasks.length - 1
              ? <a href="#app/review" className="text-xs text-olive font-medium hover:text-olive-hover cursor-pointer">Close the day →</a>
              : <a href="#app/review" className="text-[0.625rem] text-text-muted hover:text-olive cursor-pointer">review</a>
          }
        />

        <div className="grid grid-cols-[4rem_1fr_5.5rem_4rem] gap-x-3 mb-2 px-1">
          <SectionLabel>Time</SectionLabel>
          <SectionLabel>Task</SectionLabel>
          <SectionLabel>Goal</SectionLabel>
          <SectionLabel className="text-right">Status</SectionLabel>
        </div>

        <Reorder.Group axis="y" values={tasks} onReorder={setTasks}>
          {tasks.map((row) => {
            const isActive = row.status === 'active'
            const isDone = row.status === 'done'

            return (
              <Reorder.Item key={row.id} value={row} className="list-none">
                <div className={`grid grid-cols-[4rem_1fr_5.5rem_4rem] gap-x-3 items-start py-2.5 px-1 rounded-lg cursor-grab active:cursor-grabbing ${isActive ? 'bg-[#00000003]' : ''}`}>
                  <span className={`text-xs tabular-nums pt-0.5 ${isDone ? 'text-text-muted/50' : isActive ? 'text-text-primary' : 'text-text-muted/50'}`}>
                    {row.time}
                  </span>

                  <div>
                    <p
                      className={`text-sm leading-snug cursor-pointer ${isDone ? 'text-text-muted line-through' : isActive ? 'text-text-primary font-medium' : 'text-text-secondary'} hover:text-olive transition-colors`}
                      onClick={() => setSelectedTask(row)}
                    >
                      {row.task}
                    </p>
                    {isActive && row.output && (
                      <p className="text-[0.6875rem] text-text-muted/50 mt-0.5">→ {row.output}</p>
                    )}
                  </div>

                  <span className="text-xs pt-0.5" style={{ color: isDone ? `${row.color}40` : row.color || 'transparent' }}>
                    {row.goal}
                  </span>

                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <motion.div
                      className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer shrink-0"
                      style={isDone ? { backgroundColor: `${row.color || '#9C8F80'}18` } : { border: '1.5px solid var(--color-border)' }}
                      onClick={() => toggleDone(row.id)}
                      whileTap={{ scale: 1.4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {isDone && <span className="text-[0.375rem]" style={{ color: row.color || '#9C8F80' }}>✓</span>}
                    </motion.div>
                  </div>
                </div>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>

        <div className="flex items-center gap-3 mt-4 px-1">
          <span className="text-xs text-text-muted/50 w-[4rem]">+</span>
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="add a task..."
            className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-1.5 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
          />
        </div>

        <FadeIn delay={0.2} y={6} className="mt-10 grid grid-cols-3 gap-4">
          {goalsSummary.map((g, i) => {
            const pct = g.total > 0 ? (g.done / g.total) * 100 : 0
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: g.color }}>{g.label}</span>
                  <span className="text-[0.625rem] text-text-muted">{g.done}/{g.total}</span>
                </div>
                <div className="h-px bg-border/40">
                  <motion.div className="h-full" style={{ backgroundColor: g.color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.25 + i * 0.06 }} />
                </div>
              </div>
            )
          })}
        </FadeIn>
      </div>

      {selectedTask && (
        <TaskModal
          visible={!!selectedTask}
          task={{ text: selectedTask.task, day: 'Wed', time: selectedTask.time, done: selectedTask.status === 'done', description: '', output: selectedTask.output }}
          goalColor={selectedTask.color || '#9C8F80'}
          onClose={() => setSelectedTask(null)}
          onToggleDone={() => { toggleDone(selectedTask.id); setSelectedTask(null) }}
          onRemove={() => removeTask(selectedTask.id)}
        />
      )}
    </PageTransition>
  )
}
