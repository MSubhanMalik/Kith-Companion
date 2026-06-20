import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { motion } from 'framer-motion'
import { useGoalsStore } from '../../stores/goals'
import { useScheduleStore } from '../../stores/schedule'
import { getGoalColor } from '../../lib/colors'
import { DAY_LABELS } from '../../types'

function formatBlockDetail(block: { label: string; days: string[]; time: { start: string; end: string } }): string {
  const dayLabels = block.days.map(d => DAY_LABELS[d as keyof typeof DAY_LABELS] || d)
  const dayRange = dayLabels.length === 7 ? 'Every day' : dayLabels.join(', ')
  const start = formatHour(block.time.start)
  const end = formatHour(block.time.end)
  return `${start}–${end} · ${dayRange}`
}

function formatHour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function SettingsScreen() {
  const goals = useGoalsStore(s => s.goals)
  const getGoalDisplayName = useGoalsStore(s => s.getGoalDisplayName)
  const lifeBlocks = useScheduleStore(s => s.lifeBlocks)

  return (
    <PageTransition>
      <div className="pt-6 pb-12 max-w-[26rem]">
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">Settings</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-12">
          <p className="text-xs text-text-muted mb-4">goals</p>
          {goals.map((g, i) => {
            const color = getGoalColor(g.colorId)
            return (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bg }} />
                <span className="text-sm text-text-primary flex-1">{getGoalDisplayName(g)}</span>
                {g.isPrivate && <span className="text-[0.625rem] text-olive">🔒 {g.nickname}</span>}
                <span className="text-xs text-text-muted">{g.weeklyHours}h/wk</span>
                <button className={`text-sm cursor-pointer ${g.isPrivate ? 'text-olive' : 'text-text-muted/50 hover:text-text-muted'}`}>
                  {g.isPrivate ? '🔒' : '🔓'}
                </button>
              </div>
            )
          })}
          <button className="text-xs text-text-muted hover:text-olive mt-2 cursor-pointer">+ add</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <p className="text-xs text-text-muted mb-4">non-negotiables</p>
          {lifeBlocks.map((b, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-text-primary">{b.label}</span>
              <span className="text-xs text-text-muted">{formatBlockDetail(b)}</span>
            </div>
          ))}
          <button className="text-xs text-text-muted hover:text-olive mt-2 cursor-pointer">+ add</button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <button className="text-xs text-text-muted hover:text-direction cursor-pointer">Reset everything</button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
