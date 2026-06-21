import { useState } from 'react'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { Button } from '../ui/Button'
import { useGoalsStore } from '../../stores/goals'
import { useScheduleStore } from '../../stores/schedule'
import { CATEGORY_COLORS } from '../../lib/colors'
import type { CategoryColorId } from '../../types'

const COLOR_ORDER: CategoryColorId[] = [
  'terracotta', 'sage', 'sienna', 'slate', 'plum',
  'teal', 'amber', 'clay', 'moss', 'dusty-rose',
]

interface GoalInput {
  label: string
  date: string
  weeklyHours: string
  isPrivate: boolean
  nickname: string
}

interface BlockInput {
  label: string
  startTime: string
  endTime: string
  days: string
}

interface SetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function SetupScreen({ onNext, onBack }: SetupScreenProps) {
  const [goals, setGoals] = useState<GoalInput[]>([
    { label: '', date: '', weeklyHours: '', isPrivate: false, nickname: '' },
  ])
  const [blocks, setBlocks] = useState<BlockInput[]>([
    { label: 'Work', startTime: '09:00', endTime: '17:00', days: 'Mon–Fri' },
    { label: 'Gym', startTime: '18:00', endTime: '19:00', days: 'Mon–Fri' },
    { label: 'Sleep', startTime: '23:00', endTime: '07:00', days: 'Every day' },
  ])
  const [saving, setSaving] = useState(false)

  const addGoal = useGoalsStore(s => s.addGoal)
  const addLifeBlock = useScheduleStore(s => s.addLifeBlock)

  function updateGoal(index: number, field: keyof GoalInput, value: string | boolean) {
    setGoals(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g))
  }

  function addGoalRow() {
    if (goals.length >= 10) return
    setGoals(prev => [...prev, { label: '', date: '', weeklyHours: '', isPrivate: false, nickname: '' }])
  }

  function removeGoalRow(index: number) {
    setGoals(prev => prev.filter((_, i) => i !== index))
  }

  function updateBlock(index: number, field: keyof BlockInput, value: string) {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b))
  }

  function addBlockRow() {
    setBlocks(prev => [...prev, { label: '', startTime: '09:00', endTime: '17:00', days: 'Mon–Fri' }])
  }

  function removeBlockRow(index: number) {
    setBlocks(prev => prev.filter((_, i) => i !== index))
  }

  function parseDays(daysStr: string): string[] {
    const s = daysStr.toLowerCase().replace(/[–—]/g, '-')
    if (s.includes('every')) return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    if (s.includes('mon') && s.includes('fri') && s.includes('-')) return ['mon', 'tue', 'wed', 'thu', 'fri']
    if (s.includes('sat') && s.includes('sun') && s.includes('-')) return ['sat', 'sun']
    const allDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    const found = allDays.filter(d => s.includes(d))
    return found.length > 0 ? found : ['mon', 'tue', 'wed', 'thu', 'fri']
  }

  async function handleBuild() {
    const validGoals = goals.filter(g => g.label.trim())
    if (validGoals.length === 0) return

    setSaving(true)

    for (const g of validGoals) {
      await addGoal(g.label.trim(), parseFloat(g.weeklyHours) || 0, g.isPrivate, g.nickname.trim(), g.date || undefined)
    }

    for (const b of blocks) {
      if (!b.label.trim()) continue
      await addLifeBlock({
        label: b.label.trim(),
        days: parseDays(b.days) as import('../../types').DayOfWeek[],
        time: { start: b.startTime, end: b.endTime },
      })
    }

    setSaving(false)
    onNext()
  }

  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-[32rem] mx-auto">
        <FadeIn y={12}>
          <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
            Two things I need from you.
          </h1>
          <p className="text-sm text-text-secondary mb-12">
            Your goals and the blocks I can't touch. That's it — I'll handle the rest.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} y={10} className="mb-14">
          <SectionLabel className="mb-5">Your goals · ranked by priority</SectionLabel>

          <div className="flex flex-col gap-6">
            {goals.map((goal, i) => {
              const colorId = COLOR_ORDER[i % COLOR_ORDER.length]
              const color = CATEGORY_COLORS[colorId].bg
              return (
                <FadeIn key={i} delay={0.15 + i * 0.06}>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <span className="text-lg font-bold text-text-muted">{i + 1}</span>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          value={goal.label}
                          onChange={e => updateGoal(i, 'label', e.target.value)}
                          placeholder="What are you working toward?"
                          className="flex-1 text-text-primary font-medium bg-transparent border-b border-border/50 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/40"
                        />
                        <button
                          onClick={() => updateGoal(i, 'isPrivate', !goal.isPrivate)}
                          className={`text-sm cursor-pointer transition-colors shrink-0 ${
                            goal.isPrivate ? 'text-olive' : 'text-text-muted/50 hover:text-text-muted'
                          }`}
                          title={goal.isPrivate ? 'Private — using nickname' : 'Make private'}
                        >
                          {goal.isPrivate ? '🔒' : '🔓'}
                        </button>
                        {goals.length > 1 && (
                          <button onClick={() => removeGoalRow(i)} className="text-xs text-text-muted/50 hover:text-direction cursor-pointer">✕</button>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[0.625rem] text-text-muted">By</span>
                        <input
                          type="date"
                          value={goal.date}
                          onChange={e => updateGoal(i, 'date', e.target.value)}
                          className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1 focus:outline-none focus:border-olive"
                        />
                        <span className="text-[0.625rem] text-text-muted">hrs/wk</span>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          step="1"
                          value={goal.weeklyHours}
                          onChange={e => updateGoal(i, 'weeklyHours', e.target.value)}
                          placeholder="0"
                          className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1 focus:outline-none focus:border-olive w-12 text-center"
                        />

                        {goal.isPrivate && (
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-[0.625rem] text-olive">shown as</span>
                            <input
                              value={goal.nickname}
                              onChange={e => updateGoal(i, 'nickname', e.target.value)}
                              placeholder="nickname"
                              className="text-xs text-olive font-medium bg-transparent border-b border-olive/30 pb-1 focus:outline-none focus:border-olive w-20 placeholder:text-olive/30"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}

            <FadeIn delay={0.4} y={0}>
              <Button variant="ghost" size="sm" label="+ add goal" onClick={addGoalRow} />
            </FadeIn>
          </div>
        </FadeIn>

        <FadeIn delay={0.3} y={10} className="mb-14">
          <SectionLabel className="mb-5">Non-negotiables · I won't schedule over these</SectionLabel>

          <div className="flex flex-col gap-3">
            {blocks.map((block, i) => (
              <FadeIn key={i} delay={0.35 + i * 0.05} y={6}
                className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  <input
                    value={block.label}
                    onChange={e => updateBlock(i, 'label', e.target.value)}
                    placeholder="Label"
                    className="text-text-primary font-medium bg-transparent focus:outline-none placeholder:text-text-muted/40 w-24"
                  />
                  <input
                    value={block.days}
                    onChange={e => updateBlock(i, 'days', e.target.value)}
                    className="text-xs text-text-muted bg-transparent focus:outline-none w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="time" value={block.startTime} onChange={e => updateBlock(i, 'startTime', e.target.value)}
                    className="text-sm text-text-secondary bg-transparent focus:outline-none w-24" />
                  <span className="text-text-muted">–</span>
                  <input type="time" value={block.endTime} onChange={e => updateBlock(i, 'endTime', e.target.value)}
                    className="text-sm text-text-secondary bg-transparent focus:outline-none w-24" />
                  <button onClick={() => removeBlockRow(i)} className="text-xs text-text-muted/50 hover:text-direction cursor-pointer">✕</button>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.55} y={0}>
              <Button variant="ghost" size="sm" label="+ add block" onClick={addBlockRow} />
            </FadeIn>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} y={0} className="flex items-center justify-between">
          <Button variant="ghost" size="sm" label="← back" onClick={onBack} />
          <Button variant="primary" onClick={handleBuild} label={saving ? 'Building...' : 'Build my schedule'} disabled={saving} />
        </FadeIn>
      </div>
    </div>
  )
}
