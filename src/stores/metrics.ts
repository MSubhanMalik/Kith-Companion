import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeekMetrics, WeekSchedule, DayLog, Goal, Milestone } from '../types'
import { getBlockDurationMinutes } from '../lib/time'

interface MetricsStore {
  weeklyMetrics: WeekMetrics[]

  computeWeekMetrics: (
    weekOf: string,
    schedule: WeekSchedule,
    logs: Record<string, DayLog>,
    goals: Goal[],
    milestones: Milestone[]
  ) => void
  getMetrics: (weekOf: string) => WeekMetrics | undefined
  getRecentMetrics: (count: number) => WeekMetrics[]
}

export const useMetricsStore = create<MetricsStore>()(
  persist(
    (set, get) => ({
      weeklyMetrics: [],

      computeWeekMetrics: (weekOf, schedule, logs, goals, milestones) => {
        const hoursPlanned: Record<string, number> = {}
        const hoursCompleted: Record<string, number> = {}

        for (const goal of goals) {
          hoursPlanned[goal.id] = 0
          hoursCompleted[goal.id] = 0
        }

        for (const block of schedule.blocks) {
          if (block.type !== 'goal_task') continue
          const durationHours = getBlockDurationMinutes(block.time) / 60
          const goalId = block.referenceId

          if (goalId in hoursPlanned) {
            hoursPlanned[goalId] += durationHours
          }

          const dayLogs = Object.values(logs)
          const completion = dayLogs.find(l => l.taskCompletions[block.id])
          if (completion) {
            const status = completion.taskCompletions[block.id]
            if (status === 'done') {
              hoursCompleted[goalId] = (hoursCompleted[goalId] ?? 0) + durationHours
            } else if (status === 'partial') {
              hoursCompleted[goalId] = (hoursCompleted[goalId] ?? 0) + durationHours * 0.5
            }
          }
        }

        const allFocusScores = Object.values(logs).flatMap(l => Object.values(l.focusScores))
        const avgFocusScore = allFocusScores.length > 0
          ? allFocusScores.reduce((a, b) => a + b, 0) / allFocusScores.length
          : 0

        const allEnergy = Object.values(logs).map(l => l.energyLevel).filter(e => e > 0)
        const avgEnergy = allEnergy.length > 0
          ? allEnergy.reduce((a, b) => a + b, 0) / allEnergy.length
          : 0

        const weekMilestones = milestones.filter(m => m.weekOf === weekOf)
        const milestonesCompleted = weekMilestones.filter(m => m.status === 'done').length
        const milestonesTotal = weekMilestones.length

        const patterns: string[] = []

        for (const goal of goals) {
          const planned = hoursPlanned[goal.id] ?? 0
          const completed = hoursCompleted[goal.id] ?? 0
          if (planned > 0 && completed < planned * 0.5) {
            patterns.push(`${goal.label} is below 50% of planned hours. What's getting in the way?`)
          }
        }

        if (avgFocusScore > 0 && avgFocusScore < 2.5) {
          patterns.push('Focus scores have been low this week. Consider lighter days or shorter blocks.')
        }

        const metrics: WeekMetrics = {
          weekOf,
          hoursPlanned,
          hoursCompleted,
          avgFocusScore: Math.round(avgFocusScore * 10) / 10,
          avgEnergy: Math.round(avgEnergy * 10) / 10,
          milestonesCompleted,
          milestonesTotal,
          patterns,
        }

        const existing = get().weeklyMetrics.filter(m => m.weekOf !== weekOf)
        set({ weeklyMetrics: [...existing, metrics].slice(-12) })
      },

      getMetrics: (weekOf) => {
        return get().weeklyMetrics.find(m => m.weekOf === weekOf)
      },

      getRecentMetrics: (count) => {
        return get().weeklyMetrics.slice(-count)
      },
    }),
    { name: 'kith-metrics' }
  )
)
