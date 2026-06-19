import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Goal, Milestone, MilestoneStep, CategoryColorId } from '../types'
import { assignColor } from '../lib/colors'

interface GoalsStore {
  goals: Goal[]
  milestones: Milestone[]

  addGoal: (label: string, weeklyHours: number) => void
  updateGoal: (id: string, updates: Partial<Pick<Goal, 'label' | 'weeklyHours' | 'colorId' | 'targetDate' | 'currentStatus' | 'successMetric'>>) => void
  removeGoal: (id: string) => void
  reorderGoals: (orderedIds: string[]) => void

  addMilestone: (goalId: string, text: string, weekOf: string) => void
  updateMilestone: (id: string, updates: Partial<Pick<Milestone, 'text' | 'status' | 'successProof'>>) => void
  removeMilestone: (id: string) => void

  addStep: (milestoneId: string, text: string, estimatedMinutes: number) => void
  updateStep: (milestoneId: string, stepId: string, updates: Partial<Pick<MilestoneStep, 'text' | 'estimatedMinutes' | 'status'>>) => void
  removeStep: (milestoneId: string, stepId: string) => void

  getMilestonesByGoal: (goalId: string, weekOf: string) => Milestone[]
  getGoalById: (id: string) => Goal | undefined
  getAvailableHours: (totalAvailable: number) => number
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: [],
      milestones: [],

      addGoal: (label, weeklyHours) => {
        const { goals } = get()
        if (goals.length >= 10) return

        const colorId: CategoryColorId = assignColor(goals)
        const goal: Goal = {
          id: generateId(),
          label,
          targetDate: '',
          currentStatus: '',
          successMetric: '',
          colorId,
          rank: goals.length + 1,
          weeklyHours,
          createdAt: new Date().toISOString(),
        }
        set({ goals: [...goals, goal] })
      },

      updateGoal: (id, updates) => {
        set({
          goals: get().goals.map(g =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })
      },

      removeGoal: (id) => {
        const { goals, milestones } = get()
        const filtered = goals.filter(g => g.id !== id)
        const reranked = filtered.map((g, i) => ({ ...g, rank: i + 1 }))
        set({
          goals: reranked,
          milestones: milestones.filter(m => m.goalId !== id),
        })
      },

      reorderGoals: (orderedIds) => {
        const { goals } = get()
        const reordered = orderedIds
          .map((id, i) => {
            const goal = goals.find(g => g.id === id)
            return goal ? { ...goal, rank: i + 1 } : null
          })
          .filter((g): g is Goal => g !== null)
        set({ goals: reordered })
      },

      addMilestone: (goalId, text, weekOf) => {
        const milestone: Milestone = {
          id: generateId(),
          goalId,
          text,
          successProof: '',
          steps: [],
          weekOf,
          status: 'pending',
        }
        set({ milestones: [...get().milestones, milestone] })
      },

      updateMilestone: (id, updates) => {
        set({
          milestones: get().milestones.map(m =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })
      },

      removeMilestone: (id) => {
        set({ milestones: get().milestones.filter(m => m.id !== id) })
      },

      addStep: (milestoneId, text, estimatedMinutes) => {
        const step: MilestoneStep = {
          id: generateId(),
          text,
          estimatedMinutes,
          status: 'pending',
        }
        set({
          milestones: get().milestones.map(m =>
            m.id === milestoneId
              ? { ...m, steps: [...m.steps, step] }
              : m
          ),
        })
      },

      updateStep: (milestoneId, stepId, updates) => {
        set({
          milestones: get().milestones.map(m =>
            m.id === milestoneId
              ? {
                  ...m,
                  steps: m.steps.map(s =>
                    s.id === stepId ? { ...s, ...updates } : s
                  ),
                }
              : m
          ),
        })
      },

      removeStep: (milestoneId, stepId) => {
        set({
          milestones: get().milestones.map(m =>
            m.id === milestoneId
              ? { ...m, steps: m.steps.filter(s => s.id !== stepId) }
              : m
          ),
        })
      },

      getMilestonesByGoal: (goalId, weekOf) => {
        return get().milestones.filter(m => m.goalId === goalId && m.weekOf === weekOf)
      },

      getGoalById: (id) => {
        return get().goals.find(g => g.id === id)
      },

      getAvailableHours: (totalAvailable) => {
        const allocated = get().goals.reduce((sum, g) => sum + g.weeklyHours, 0)
        return Math.max(0, totalAvailable - allocated)
      },
    }),
    { name: 'kith-goals' }
  )
)
