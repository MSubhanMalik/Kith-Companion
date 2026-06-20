import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'
import { useTodayStore } from '../../stores/today'

interface Task {
  id: string
  task: string
  goal: string
  color: string
  done: boolean
}

const INITIAL: Task[] = [
  { id: '1', task: 'Send 5 cold DMs', goal: 'Freelancing', color: '#C4745C', done: true },
  { id: '2', task: 'Follow up API client', goal: 'Freelancing', color: '#C4745C', done: true },
  { id: '3', task: 'Gym', goal: '', color: '#9C8F80', done: true },
  { id: '4', task: 'Build Stripe checkout', goal: 'Startup', color: '#7A9A6D', done: false },
  { id: '5', task: 'Write LinkedIn recap', goal: 'LinkedIn', color: '#B08455', done: true },
]

const TOMORROW = [
  { time: '5:30 PM', task: 'Send 5 cold DMs (batch 4)', goal: 'Freelancing', color: '#C4745C' },
  { time: '9:30 PM', task: 'Fix Stripe refund edge case', goal: 'Startup', color: '#7A9A6D' },
  { time: '11:30 PM', task: 'Write LinkedIn post', goal: 'LinkedIn', color: '#B08455' },
]

export function EndOfDayScreen() {
  const [tasks, setTasks] = useState(INITIAL)
  const completeNight = useTodayStore(s => s.completeNight)
  const setTomorrowTopThree = useTodayStore(s => s.setTomorrowTopThree)

  function toggleDone(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function handleCloseDay() {
    completeNight()
    setTomorrowTopThree(TOMORROW.map(t => t.task))
  }

  const doneCount = tasks.filter(t => t.done).length

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="thinking" size={26} />
          <span className="text-sm text-text-muted">{doneCount} of {tasks.length} done · tap to change</span>
        </motion.div>

        <div className="grid grid-cols-[1fr_5.5rem_3rem] gap-x-3 text-[0.625rem] text-text-muted tracking-widest uppercase mb-2 px-1">
          <span>Today</span>
          <span>Goal</span>
          <span className="text-right">Done</span>
        </div>

        {tasks.map((row, i) => (
          <motion.div key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 + i * 0.03 }}
            className="grid grid-cols-[1fr_5.5rem_3rem] gap-x-3 items-center py-2.5 px-1">
            <span className={`text-sm ${row.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>{row.task}</span>
            <span className="text-xs" style={{ color: row.done ? `${row.color}40` : row.color }}>{row.goal}</span>
            <div className="flex justify-end">
              <div className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                style={row.done ? { backgroundColor: `${row.color}18` } : { border: '1.5px solid var(--color-border)' }}
                onClick={() => toggleDone(row.id)}>
                {row.done && <span className="text-[0.375rem]" style={{ color: row.color }}>✓</span>}
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div className="flex items-start gap-3 mt-8 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Cat state="nudge" size={22} />
          <p className="text-sm text-text-muted">Stripe checkout moved to tomorrow 9:30 PM.</p>
        </motion.div>

        <div className="grid grid-cols-[3.5rem_1fr_5.5rem] gap-x-3 text-[0.625rem] text-text-muted tracking-widest uppercase mb-2 px-1">
          <span>Time</span>
          <span>Tomorrow</span>
          <span>Goal</span>
        </div>

        {TOMORROW.map((row, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.03 }}
            className="grid grid-cols-[3.5rem_1fr_5.5rem] gap-x-3 items-center py-2.5 px-1">
            <span className="text-xs text-text-muted/50 tabular-nums">{row.time}</span>
            <span className="text-sm text-text-primary">{row.task}</span>
            <span className="text-xs" style={{ color: row.color }}>{row.goal}</span>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 mb-6">
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-2">Week summary — one line</p>
          <input
            defaultValue=""
            placeholder="How was this week? e.g. Shipped auth, 3 new leads, LinkedIn behind"
            className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
          <Button variant="primary" label="Close the day" onClick={handleCloseDay} />
        </motion.div>
      </div>
    </PageTransition>
  )
}
