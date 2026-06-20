import { useState } from 'react'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
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
        <ScreenHeader catState="thinking" message={`${doneCount} of ${tasks.length} done · tap to change`} />

        <div className="grid grid-cols-[1fr_5.5rem_3rem] gap-x-3 mb-2 px-1">
          <SectionLabel>Today</SectionLabel>
          <SectionLabel>Goal</SectionLabel>
          <SectionLabel className="text-right">Done</SectionLabel>
        </div>

        {tasks.map((row, i) => (
          <FadeIn key={row.id} delay={0.05 + i * 0.03} y={0}
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
          </FadeIn>
        ))}

        <FadeIn delay={0.25} y={0} className="flex items-start gap-3 mt-8 mb-8">
          <Cat state="nudge" size={22} />
          <p className="text-sm text-text-muted">Stripe checkout moved to tomorrow 9:30 PM.</p>
        </FadeIn>

        <div className="grid grid-cols-[3.5rem_1fr_5.5rem] gap-x-3 mb-2 px-1">
          <SectionLabel>Time</SectionLabel>
          <SectionLabel>Tomorrow</SectionLabel>
          <SectionLabel>Goal</SectionLabel>
        </div>

        {TOMORROW.map((row, i) => (
          <FadeIn key={i} delay={0.3 + i * 0.03} y={0}
            className="grid grid-cols-[3.5rem_1fr_5.5rem] gap-x-3 items-center py-2.5 px-1">
            <span className="text-xs text-text-muted/50 tabular-nums">{row.time}</span>
            <span className="text-sm text-text-primary">{row.task}</span>
            <span className="text-xs" style={{ color: row.color }}>{row.goal}</span>
          </FadeIn>
        ))}

        <FadeIn delay={0.4} className="mt-10 mb-6">
          <SectionLabel className="mb-2">Week summary — one line</SectionLabel>
          <input
            defaultValue=""
            placeholder="How was this week? e.g. Shipped auth, 3 new leads, LinkedIn behind"
            className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
          />
        </FadeIn>

        <FadeIn delay={0.5} y={0} className="mt-6">
          <Button variant="primary" label="Close the day" onClick={handleCloseDay} />
        </FadeIn>
      </div>
    </PageTransition>
  )
}
