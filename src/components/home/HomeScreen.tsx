import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { TaskModal } from '../goals/TaskModal'
import { Button } from '../ui/Button'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'
import { todayService } from '../../services/TodayService'
import { scheduleService } from '../../services/ScheduleService'
import { useCatStore } from '../../stores/cat'

interface Block {
  id: string
  time: string
  task: string
  goal: string
  output: string
  color: string
  status: 'done' | 'active' | 'upcoming'
  blockId: number
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export function HomeScreen() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  useEffect(() => {
    loadToday()
  }, [])

  async function loadToday() {
    setLoading(true)
    try {
      const data = await todayService.getToday() as { blocks: Array<{ id: number; label: string; time: { start: string }; taskDescription: string; outputDefinition: string; goalId: number; status: string; type: string }>; completions: Record<string, string> }
      const mapped: Block[] = (data.blocks || []).map(b => {
        const goal = goals.find(g => Number(g.id) === b.goalId)
        const goalColor = goal ? getGoalColor(goal.colorId).bg : ''
        const completionStatus = data.completions?.[b.id]
        let status: 'done' | 'active' | 'upcoming' = 'upcoming'
        if (completionStatus === 'DONE') status = 'done'
        else if (b.status === 'COMPLETED') status = 'done'

        return {
          id: String(b.id),
          time: formatTime12(b.time.start),
          task: b.label,
          goal: goal ? getGoalDisplayName(goal) : (b.type === 'LIFE_BLOCK' ? '' : ''),
          output: b.outputDefinition || '',
          color: goalColor,
          status,
          blockId: b.id,
        }
      })
      setBlocks(mapped)
    } catch {}
    setLoading(false)
  }

  const setCatState = useCatStore(s => s.setState)

  async function toggleDone(id: string) {
    const block = blocks.find(b => b.id === id)
    if (!block) return
    const newStatus = block.status === 'done' ? 'PENDING' : 'DONE'
    try {
      await todayService.completeBlock(block.blockId, newStatus)
      setBlocks(prev => prev.map(b => {
        if (b.id !== id) return b
        return { ...b, status: newStatus === 'DONE' ? 'done' as const : 'upcoming' as const }
      }))
      if (newStatus === 'DONE') {
        setCatState('happy')
        setTimeout(() => setCatState('idle'), 3000)
      }
    } catch {}
  }

  const goalsSummary = goals.filter(g => !g.isPrivate).map(g => {
    const color = getGoalColor(g.colorId)
    const goalBlocks = blocks.filter(b => b.goal === getGoalDisplayName(g))
    const done = goalBlocks.filter(b => b.status === 'done').length
    return {
      label: getGoalDisplayName(g),
      color: color.bg,
      done,
      total: goalBlocks.length,
    }
  })

  const doneCount = blocks.filter(t => t.status === 'done').length

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-6 pb-12 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
          <Cat state="thinking" size={48} />
        </div>
      </PageTransition>
    )
  }

  if (blocks.length === 0 && goals.length === 0) {
    return (
      <PageTransition>
        <div className="pt-6 pb-12 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
          <Cat state="idle" size={48} />
          <p className="text-text-secondary mt-6 text-center">No tasks today.<br />Add a goal to get started.</p>
        </div>
      </PageTransition>
    )
  }

  if (blocks.length === 0 && goals.length > 0) {
    return (
      <PageTransition>
        <EmptySchedule onGenerated={loadToday} />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <ScreenHeader
          catState="idle"
          message={`${new Date().toLocaleDateString('en-US', { weekday: 'long' })} · ${doneCount} of ${blocks.length} done`}
          right={
            doneCount >= blocks.length - 1
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

        <Reorder.Group axis="y" values={blocks} onReorder={setBlocks}>
          {blocks.map((row) => {
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
                      onClick={() => setSelectedBlock(row)}
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

      {selectedBlock && (
        <TaskModal
          visible={!!selectedBlock}
          task={{ text: selectedBlock.task, day: new Date().toLocaleDateString('en-US', { weekday: 'short' }), time: selectedBlock.time, done: selectedBlock.status === 'done', description: '', output: selectedBlock.output }}
          goalColor={selectedBlock.color || '#9C8F80'}
          onClose={() => setSelectedBlock(null)}
          onToggleDone={() => { toggleDone(selectedBlock.id); setSelectedBlock(null) }}
          onRemove={() => setSelectedBlock(null)}
        />
      )}
    </PageTransition>
  )
}

function EmptySchedule({ onGenerated }: { onGenerated: () => void }) {
  const [generating, setGenerating] = useState(false)
  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  function getThisMonday(): string {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(today)
    monday.setDate(diff)
    return monday.toISOString().split('T')[0]
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      await scheduleService.generate(getThisMonday())
      onGenerated()
    } catch {}
    setGenerating(false)
  }

  return (
    <div className="pt-6 pb-12 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <Cat state="alert" size={48} />
      <p className="text-text-primary font-semibold mt-6">
        {goals.length} {goals.length === 1 ? 'goal' : 'goals'}, no schedule yet.
      </p>
      <p className="text-sm text-text-muted mt-1 mb-6 text-center max-w-[20rem]">
        Generate this week's schedule to see your tasks for today.
      </p>

      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {goals.map(g => {
          const color = getGoalColor(g.colorId)
          return (
            <span key={g.id} className="text-xs px-3 py-1 rounded-full" style={{ color: color.bg, backgroundColor: `${color.bg}10` }}>
              {getGoalDisplayName(g)}
            </span>
          )
        })}
      </div>

      <Button
        variant="primary"
        size="sm"
        label={generating ? 'Generating...' : 'Generate this week'}
        onClick={handleGenerate}
        disabled={generating}
      />
    </div>
  )
}
