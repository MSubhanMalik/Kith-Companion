import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Goal, Milestone, MilestoneStep, CategoryColorId } from '../types'
import { assignColor } from '../lib/colors'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const SEED_GOALS: Goal[] = [
  { id: 'g1', label: 'Earn $10K/month from freelancing', targetDate: '2026-12-31', currentStatus: '2 active clients', successMetric: 'Monthly revenue $10K', colorId: 'terracotta', rank: 1, weeklyHours: 16, createdAt: '2026-06-01', isPrivate: false, nickname: '' },
  { id: 'g2', label: 'Launch startup MVP', targetDate: '2027-03-15', currentStatus: 'Landing page only', successMetric: '100 paid users', colorId: 'sage', rank: 2, weeklyHours: 10, createdAt: '2026-06-01', isPrivate: false, nickname: '' },
  { id: 'g3', label: 'Train intern — web dev', targetDate: '2026-09-01', currentStatus: 'Starting week 2', successMetric: 'Intern ships full stack app', colorId: 'sienna', rank: 3, weeklyHours: 6, createdAt: '2026-06-01', isPrivate: false, nickname: '' },
]

const SEED_MILESTONES: Milestone[] = []

interface GoalsStore {
  goals: Goal[]
  milestones: Milestone[]

  addGoal: (label: string, weeklyHours: number, isPrivate?: boolean, nickname?: string) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  removeGoal: (id: string) => void
  reorderGoals: (orderedIds: string[]) => void

  addMilestone: (goalId: string, text: string, weekOf: string) => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void
  removeMilestone: (id: string) => void

  addStep: (milestoneId: string, text: string, estimatedMinutes: number) => void
  updateStep: (milestoneId: string, stepId: string, updates: Partial<MilestoneStep>) => void
  removeStep: (milestoneId: string, stepId: string) => void

  getGoalById: (id: string) => Goal | undefined
  getGoalDisplayName: (goal: Goal) => string
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: SEED_GOALS,
      milestones: SEED_MILESTONES,

      addGoal: (label, weeklyHours, isPrivate = false, nickname = '') => {
        const { goals } = get()
        if (goals.length >= 10) return
        const colorId: CategoryColorId = assignColor(goals)
        set({
          goals: [...goals, {
            id: generateId(), label, targetDate: '', currentStatus: '', successMetric: '',
            colorId, rank: goals.length + 1, weeklyHours, createdAt: new Date().toISOString(),
            isPrivate, nickname,
          }],
        })
      },

      updateGoal: (id, updates) => {
        set({ goals: get().goals.map(g => g.id === id ? { ...g, ...updates } : g) })
      },

      removeGoal: (id) => {
        const { goals, milestones } = get()
        const filtered = goals.filter(g => g.id !== id)
        set({
          goals: filtered.map((g, i) => ({ ...g, rank: i + 1 })),
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
        set({
          milestones: [...get().milestones, {
            id: generateId(), goalId, text, successProof: '', steps: [], weekOf, status: 'pending',
          }],
        })
      },

      updateMilestone: (id, updates) => {
        set({ milestones: get().milestones.map(m => m.id === id ? { ...m, ...updates } : m) })
      },

      removeMilestone: (id) => {
        set({ milestones: get().milestones.filter(m => m.id !== id) })
      },

      addStep: (milestoneId, text, estimatedMinutes) => {
        set({
          milestones: get().milestones.map(m =>
            m.id === milestoneId
              ? { ...m, steps: [...m.steps, { id: generateId(), text, estimatedMinutes, status: 'pending' }] }
              : m
          ),
        })
      },

      updateStep: (milestoneId, stepId, updates) => {
        set({
          milestones: get().milestones.map(m =>
            m.id === milestoneId
              ? { ...m, steps: m.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) }
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

      getGoalById: (id) => get().goals.find(g => g.id === id),

      getGoalDisplayName: (goal) => goal.isPrivate ? goal.nickname : goal.label,
    }),
    { name: 'kith-goals' }
  )
)
