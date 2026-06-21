import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Goal, Milestone, MilestoneStep, CategoryColorId } from '../types'
import { assignColor } from '../lib/colors'
import { goalService } from '../services/GoalService'

interface GoalsStore {
  goals: Goal[]
  milestones: Milestone[]
  loading: boolean

  fetchGoals: () => Promise<void>
  addGoal: (label: string, weeklyHours: number, isPrivate?: boolean, nickname?: string, targetDate?: string) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  removeGoal: (id: string) => Promise<void>
  reorderGoals: (orderedIds: string[]) => Promise<void>

  setGoals: (goals: Goal[]) => void
  getGoalById: (id: string) => Goal | undefined
  getGoalDisplayName: (goal: Goal) => string
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: [],
      milestones: [],
      loading: false,

      fetchGoals: async () => {
        set({ loading: true })
        try {
          const data = await goalService.list() as Goal[]
          set({ goals: data, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addGoal: async (label, weeklyHours, isPrivate = false, nickname = '', targetDate) => {
        const { goals } = get()
        if (goals.length >= 10) return
        const colorId: CategoryColorId = assignColor(goals)
        try {
          const created = await goalService.create({
            label,
            color_id: colorId,
            weekly_hours: weeklyHours,
            is_private: isPrivate,
            nickname,
            target_date: targetDate || undefined,
          }) as Goal
          set({ goals: [...goals, created] })
        } catch {}
      },

      updateGoal: async (id, updates) => {
        const apiUpdates: Record<string, unknown> = {}
        if (updates.label !== undefined) apiUpdates.label = updates.label
        if (updates.targetDate !== undefined) apiUpdates.target_date = updates.targetDate
        if (updates.currentStatus !== undefined) apiUpdates.current_status = updates.currentStatus
        if (updates.successMetric !== undefined) apiUpdates.success_metric = updates.successMetric
        if (updates.weeklyHours !== undefined) apiUpdates.weekly_hours = updates.weeklyHours
        if (updates.rank !== undefined) apiUpdates.rank = updates.rank
        if (updates.isPrivate !== undefined) apiUpdates.is_private = updates.isPrivate
        if (updates.nickname !== undefined) apiUpdates.nickname = updates.nickname
        if (updates.colorId !== undefined) apiUpdates.color_id = updates.colorId

        try {
          const updated = await goalService.update(Number(id), apiUpdates) as Goal
          set({ goals: get().goals.map(g => String(g.id) === String(id) ? updated : g) })
        } catch {}
      },

      removeGoal: async (id) => {
        try {
          await goalService.remove(Number(id))
          const filtered = get().goals.filter(g => String(g.id) !== String(id))
          set({ goals: filtered })
        } catch {}
      },

      reorderGoals: async (orderedIds) => {
        const { goals } = get()
        const reordered = orderedIds
          .map((id, i) => {
            const goal = goals.find(g => String(g.id) === String(id))
            return goal ? { ...goal, rank: i + 1 } : null
          })
          .filter((g): g is Goal => g !== null)
        set({ goals: reordered })

        try {
          await goalService.reorder(orderedIds.map(Number))
        } catch {}
      },

      setGoals: (goals) => set({ goals }),

      getGoalById: (id) => get().goals.find(g => String(g.id) === String(id)),

      getGoalDisplayName: (goal) => goal.isPrivate ? goal.nickname : goal.label,
    }),
    { name: 'kith-goals', version: 2, migrate: () => ({ goals: [], milestones: [], loading: false }) }
  )
)
