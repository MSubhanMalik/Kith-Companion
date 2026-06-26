import { useState, useEffect } from 'react'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { todayService } from '../../services/TodayService'
import { axiosService } from '../../services/AxiosService'
import { endpoints } from '../../config/api'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'

interface ReviewBlock {
  id: number
  label: string
  goal: string
  color: string
  done: boolean
}

export function EndOfDayScreen() {
  const [blocks, setBlocks] = useState<ReviewBlock[]>([])
  const [weekSummary, setWeekSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [alreadyClosed, setAlreadyClosed] = useState(false)

  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  useEffect(() => {
    loadToday()
  }, [])

  async function loadToday() {
    setLoading(true)
    try {
      const data = await todayService.getToday() as { dayLog: { nightDoneAt: string | null }; blocks: Array<{ id: number; label: string; goalId: number; status: string; type: string }>; completions: Record<string, string> }
      if (data.dayLog?.nightDoneAt) setAlreadyClosed(true)
      const mapped: ReviewBlock[] = (data.blocks || []).map(b => {
        const goal = goals.find(g => Number(g.id) === b.goalId)
        const goalColor = goal ? getGoalColor(goal.colorId).bg : '#9C8F80'
        const isDone = data.completions?.[b.id] === 'DONE' || b.status === 'COMPLETED'
        return {
          id: b.id,
          label: b.label,
          goal: goal ? getGoalDisplayName(goal) : '',
          color: goalColor,
          done: isDone,
        }
      })
      setBlocks(mapped)
    } catch {}
    setLoading(false)
  }

  async function toggleDone(id: number) {
    const block = blocks.find(b => b.id === id)
    if (!block) return
    const newStatus = block.done ? 'PENDING' : 'DONE'
    try {
      await todayService.completeBlock(id, newStatus)
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, done: !b.done } : b))
    } catch {}
  }

  async function handleCloseDay() {
    setClosing(true)
    try {
      if (weekSummary.trim()) {
        const d = new Date()
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        d.setDate(diff)
        const weekOf = d.toISOString().split('T')[0]
        await axiosService.patch(endpoints.schedule.weekSummary(weekOf), { summary_line: weekSummary.trim() })
      }
      await todayService.closeDay()
      window.location.hash = '#app/home'
    } catch {}
    setClosing(false)
  }

  const doneCount = blocks.filter(t => t.done).length

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-6 pb-12 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
          <Cat state="thinking" size={48} />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <ScreenHeader catState="thinking" message={`${doneCount} of ${blocks.length} done · tap to change`} />

        <div className="grid grid-cols-[1fr_5.5rem_3rem] gap-x-3 mb-2 px-1">
          <SectionLabel>Today</SectionLabel>
          <SectionLabel>Goal</SectionLabel>
          <SectionLabel className="text-right">Done</SectionLabel>
        </div>

        {blocks.map((row, i) => (
          <FadeIn key={row.id} delay={0.05 + i * 0.03} y={0}
            className="grid grid-cols-[1fr_5.5rem_3rem] gap-x-3 items-center py-2.5 px-1">
            <span className={`text-sm ${row.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>{row.label}</span>
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

        {blocks.length === 0 && (
          <FadeIn delay={0.1} y={0} className="py-8 text-center">
            <p className="text-sm text-text-muted">No scheduled blocks today.</p>
          </FadeIn>
        )}

        <FadeIn delay={0.4} className="mt-10 mb-6">
          <SectionLabel className="mb-2">Week summary — one line</SectionLabel>
          <input
            value={weekSummary}
            onChange={e => setWeekSummary(e.target.value)}
            placeholder="How was this week? e.g. Shipped auth, 3 new leads, LinkedIn behind"
            className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
          />
        </FadeIn>

        <FadeIn delay={0.5} y={0} className="mt-6">
          {alreadyClosed ? (
            <p className="text-sm text-text-muted">Day already closed. <a href="#app/home" className="text-olive hover:text-olive-hover cursor-pointer">Back to today →</a></p>
          ) : (
            <Button variant="primary" label={closing ? 'Closing...' : 'Close the day'} onClick={handleCloseDay} disabled={closing} />
          )}
        </FadeIn>
      </div>
    </PageTransition>
  )
}
