import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'
import { FadeIn } from '../ui/FadeIn'
import { scheduleService } from '../../services/ScheduleService'
import { goalService } from '../../services/GoalService'
import { useGoalsStore } from '../../stores/goals'
import { getGoalColor } from '../../lib/colors'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function formatTime12(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const s = h >= 12 ? 'PM' : 'AM'
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hr}${s}` : `${hr}:${String(m).padStart(2, '0')}${s}`
}

interface SchedulePreviewScreenProps {
  onLockIn: () => void
  onBack: () => void
}

interface PreviewBlock {
  day: string
  label: string
  time: string
  color: string
  type: string
}

export function SchedulePreviewScreen({ onLockIn, onBack }: SchedulePreviewScreenProps) {
  const [loading, setLoading] = useState(true)
  const [blocks, setBlocks] = useState<PreviewBlock[]>([])
  const [weekOf, setWeekOf] = useState(getMonday())
  const [error, setError] = useState('')
  const [locking, setLocking] = useState(false)

  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)

  useEffect(() => {
    generateSchedule()
  }, [])

  async function generateSchedule() {
    setLoading(true)
    setError('')
    try {
      for (const g of goals) {
        const tasks = await goalService.listTasks(Number(g.id)) as unknown[]
        if (tasks.length === 0) {
          await goalService.breakdownGoal(Number(g.id)).catch(() => {})
        }
      }

      const data = await scheduleService.generate(weekOf) as { blocks: Array<{ day: string; label: string; time: { start: string; end: string }; goalId: number | null; type: string }> }
      const mapped: PreviewBlock[] = (data.blocks || []).map(b => {
        const goal = goals.find(g => Number(g.id) === b.goalId)
        const color = goal ? getGoalColor(goal.colorId).bg : ''
        return {
          day: b.day,
          label: b.label,
          time: `${formatTime12(b.time.start)}–${formatTime12(b.time.end)}`,
          color,
          type: b.type,
        }
      })
      setBlocks(mapped)
    } catch {
      setError('Could not generate schedule. Try again.')
    }
    setLoading(false)
  }

  async function handleLockIn() {
    setLocking(true)
    try {
      await scheduleService.lock(weekOf)
    } catch {}
    setLocking(false)
    onLockIn()
  }

  const dayGroups = DAY_NAMES.filter(d => blocks.some(b => b.day === d.toUpperCase().slice(0, 3)))

  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="thinking"
              className="flex flex-col items-center justify-center pt-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Cat state="thinking" size={64} />
              <FadeIn delay={0.3} y={0} className="text-text-secondary mt-6">
                <p>Building your week...</p>
              </FadeIn>
              <FadeIn delay={0.5} y={0} className="flex gap-1 mt-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-olive/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </FadeIn>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center pt-32">
              <Cat state="idle" size={48} />
              <p className="text-sm text-text-muted mt-6">{error}</p>
              <div className="mt-6">
                <Button variant="primary" size="sm" label="Try again" onClick={generateSchedule} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Cat state="happy" size={32} />
                <h1 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: '-0.02em' }}>
                  Here's your week.
                </h1>
              </div>
              <p className="text-sm text-text-secondary mb-8 ml-11">
                {goals.length} goals → {blocks.length} blocks. Every task leads back to a goal.
              </p>

              <div className={`grid gap-4 mb-8`} style={{ gridTemplateColumns: `repeat(${Math.min(dayGroups.length, 7)}, 1fr)` }}>
                {dayGroups.map((day, di) => {
                  const dayKey = day.toUpperCase().slice(0, 3)
                  const dayBlocks = blocks.filter(b => b.day === dayKey)
                  return (
                    <div key={day}>
                      <p className="text-xs font-semibold text-text-secondary mb-3 text-center">{day}</p>
                      <div className="flex flex-col gap-1.5">
                        {dayBlocks.map((block, bi) => (
                          <motion.div
                            key={bi}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: di * 0.06 + bi * 0.04 }}
                            className="rounded-lg px-2 py-2"
                            style={{ backgroundColor: block.color ? `${block.color}12` : 'var(--color-surface-hover)' }}
                          >
                            <p className="text-[0.5625rem] font-medium truncate" style={{ color: block.color || 'var(--color-text-secondary)' }}>
                              {block.label}
                            </p>
                            <p className="text-[0.5rem] text-text-muted">{block.time}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              <FadeIn delay={0.8} y={0} className="flex items-center justify-between">
                <Button variant="ghost" size="sm" label="← adjust" onClick={onBack} />
                <Button variant="primary" onClick={handleLockIn} label={locking ? 'Locking...' : 'Lock it in'} disabled={locking} />
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
