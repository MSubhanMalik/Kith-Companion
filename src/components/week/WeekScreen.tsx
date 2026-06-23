import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { FadeIn } from '../ui/FadeIn'
import { Button } from '../ui/Button'
import { exportWeeklySchedule } from '../../lib/export'
import { scheduleService } from '../../services/ScheduleService'
import { goalService } from '../../services/GoalService'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'

type View = 'week' | 'month'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_MAP: Record<string, number> = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 }

interface WeekTask {
  label: string
  time: string
  color: string
  done: boolean
  isLifeBlock: boolean
}

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const mStr = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const sStr = sunday.toLocaleDateString('en-US', { day: 'numeric' })
  return `${mStr} – ${sStr}`
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function formatWeekOf(d: Date): string {
  return d.toISOString().split('T')[0]
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export function WeekScreen() {
  const [view, setView] = useState<View>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [weekBlocks, setWeekBlocks] = useState<Array<{ day: string; label: string; time: { start: string; end: string }; goalId: number | null; status: string; type: string }>>([])
  const [goalTasks, setGoalTasks] = useState<Array<{ day: string; label: string; time: string; goalId: number; color: string; done: boolean }>>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [hasSchedule, setHasSchedule] = useState(false)

  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  const today = new Date()
  const todayDate = today.getDate().toString()
  const currentMonday = useMemo(() => addDays(getMonday(today), weekOffset * 7), [weekOffset])

  useEffect(() => {
    loadWeek()
  }, [currentMonday])

  async function loadWeek() {
    setLoading(true)
    try {
      let data = await scheduleService.getWeek(formatWeekOf(currentMonday)) as { blocks: typeof weekBlocks } | null
      if (data && data.blocks && data.blocks.length > 0) {
        setWeekBlocks(data.blocks)
        setHasSchedule(true)
      } else {
        if (goals.length > 0 && weekOffset === 0) {
          try {
            data = await scheduleService.generate(formatWeekOf(currentMonday)) as { blocks: typeof weekBlocks }
            setWeekBlocks(data?.blocks || [])
            setHasSchedule(true)
          } catch {
            setWeekBlocks([])
            setHasSchedule(false)
          }
        } else {
          setWeekBlocks([])
          setHasSchedule(false)
        }
      }
    } catch {
      setWeekBlocks([])
      setHasSchedule(false)
    }

    try {
      const allTasks: typeof goalTasks = []
      for (const g of goals) {
        const tasks = await goalService.listTasks(Number(g.id)) as Array<{ dayOfWeek: string; text: string; scheduledTime: string; status: string }>
        const color = getGoalColor(g.colorId).bg
        for (const t of tasks) {
          if (t.dayOfWeek) {
            allTasks.push({ day: t.dayOfWeek, label: t.text, time: t.scheduledTime || '', goalId: Number(g.id), color, done: t.status === 'DONE' })
          }
        }
      }
      setGoalTasks(allTasks)
    } catch {}

    setLoading(false)
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      const data = await scheduleService.generate(formatWeekOf(currentMonday)) as { blocks: typeof weekBlocks }
      setWeekBlocks(data?.blocks || [])
      setHasSchedule(true)
    } catch {}
    setGenerating(false)
  }

  const weekCols = useMemo(() => {
    return DAY_NAMES.map((day, i) => {
      const date = addDays(currentMonday, i)
      const dayKey = day.toUpperCase().slice(0, 3)

      const tasksFromBlocks: WeekTask[] = weekBlocks
        .filter(b => b.day === dayKey)
        .map(b => {
          const goal = goals.find(g => Number(g.id) === b.goalId)
          const color = goal ? getGoalColor(goal.colorId).bg : '#9C8F80'
          return {
            label: b.label,
            time: formatTime12(b.time?.start || '00:00'),
            color,
            done: b.status === 'COMPLETED',
            isLifeBlock: b.type === 'LIFE_BLOCK',
          }
        })

      const tasksFromGoals: WeekTask[] = hasSchedule ? [] : goalTasks
        .filter(t => t.day === day)
        .map(t => ({
          label: t.label,
          time: t.time ? formatTime12(t.time) : '',
          color: t.color,
          done: t.done,
          isLifeBlock: false,
        }))

      const allTasks = [...tasksFromBlocks, ...tasksFromGoals]
        .sort((a, b) => a.time.localeCompare(b.time))

      return { day, date: date.getDate().toString(), fullDate: date, tasks: allTasks }
    })
  }, [currentMonday, weekBlocks, goalTasks, goals, hasSchedule])

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <FadeIn y={0} className="flex items-center gap-3 mb-8">
          <Cat state="idle" size={26} />
          <button onClick={() => setWeekOffset(w => w - 1)} className="text-text-muted hover:text-text-primary cursor-pointer text-sm">←</button>
          <span className="text-sm text-text-muted">{formatWeekRange(currentMonday)}</span>
          <button onClick={() => setWeekOffset(w => w + 1)} className="text-text-muted hover:text-text-primary cursor-pointer text-sm">→</button>
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="sm" label="Export ↓" onClick={() => exportWeeklySchedule(weekBlocks, goals, formatWeekRange(currentMonday))} />
            <Button variant={hasSchedule ? 'ghost' : 'primary'} size="sm" label={generating ? 'Generating...' : hasSchedule ? 'Regenerate' : 'Generate schedule'} onClick={handleGenerate} disabled={generating} />
            {(['week', 'month'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors ${view === v ? 'text-text-primary font-medium' : 'text-text-muted hover:text-text-muted'}`}
              >{v}</button>
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {view === 'week' ? (
            <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Cat state="thinking" size={36} />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-4">
                  {weekCols.map((col, di) => (
                    <div key={col.day}>
                      <p className={`text-xs font-semibold mb-1 ${col.date === todayDate ? 'text-olive' : 'text-text-muted'}`}>{col.day}</p>
                      <p className={`text-[0.625rem] mb-4 ${col.date === todayDate ? 'text-olive/50' : 'text-text-muted/50'}`}>{col.date}</p>
                      <div className="flex flex-col gap-4">
                        {col.tasks.length === 0 && <p className="text-[0.625rem] text-text-muted/50">—</p>}
                        {col.tasks.map((task, ti) => (
                          <FadeIn key={ti} delay={di * 0.03 + ti * 0.03} y={0}>
                            <p className={`text-[0.6875rem] leading-snug ${task.done ? 'line-through opacity-30' : ''} ${task.isLifeBlock ? 'opacity-40' : ''}`} style={{ color: task.isLifeBlock ? 'var(--color-text-muted)' : task.color }}>
                              {task.label}
                            </p>
                            <p className="text-[0.5625rem] text-text-muted/50 mt-0.5">{task.time}</p>
                          </FadeIn>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <MonthView currentMonday={currentMonday} />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

function MonthView({ currentMonday }: { currentMonday: Date }) {
  const today = new Date()
  const todayStr = today.toDateString()
  const month = currentMonday.getMonth()
  const year = currentMonday.getFullYear()

  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const startDay = firstDay.getDay() === 0 ? -5 : 2 - firstDay.getDay()
    const result: Array<Array<{ d: number; date: Date; inMonth: boolean }>> = []

    const cursor = new Date(year, month, startDay)
    for (let w = 0; w < 5; w++) {
      const week: Array<{ d: number; date: Date; inMonth: boolean }> = []
      for (let d = 0; d < 7; d++) {
        week.push({ d: cursor.getDate(), date: new Date(cursor), inMonth: cursor.getMonth() === month })
        cursor.setDate(cursor.getDate() + 1)
      }
      result.push(week)
    }
    return result
  }, [month, year])

  return (
    <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-7 gap-x-2 mb-3">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <p key={i} className="text-[0.625rem] text-text-muted/50 text-center">{d}</p>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <FadeIn key={wi} delay={wi * 0.04} y={0} className="grid grid-cols-7 gap-x-2">
          {week.map((day, di) => {
            const isToday = day.date.toDateString() === todayStr
            return (
              <div key={di} className={`py-3 text-center rounded-lg ${isToday ? 'bg-olive/5' : ''}`}>
                <p className={`text-sm ${isToday ? 'text-olive font-semibold' : day.inMonth ? 'text-text-primary' : 'text-text-muted/30'}`}>{day.d}</p>
              </div>
            )
          })}
        </FadeIn>
      ))}
    </motion.div>
  )
}
