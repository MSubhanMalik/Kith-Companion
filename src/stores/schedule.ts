import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LifeBlock, WeekSchedule, ScheduledBlock, DayOfWeek } from '../types'
import { schedulerService } from '../services'
import { timeService } from '../services'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const SEED_LIFE_BLOCKS: LifeBlock[] = [
  { id: 'lb1', label: 'Work', days: ['mon', 'tue', 'wed', 'thu', 'fri'], time: { start: '09:00', end: '17:00' } },
  { id: 'lb2', label: 'Gym', days: ['mon', 'tue', 'wed', 'thu', 'fri'], time: { start: '18:00', end: '19:00' } },
  { id: 'lb3', label: 'Sleep', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], time: { start: '23:00', end: '07:00' } },
]

interface ScheduleStore {
  lifeBlocks: LifeBlock[]
  currentWeek: WeekSchedule | null
  weekHistory: WeekSchedule[]
  morningReviewTime: string
  nightReviewTime: string

  addLifeBlock: (block: Omit<LifeBlock, 'id'>) => void
  updateLifeBlock: (id: string, updates: Partial<Omit<LifeBlock, 'id'>>) => void
  removeLifeBlock: (id: string) => void

  setCurrentWeek: (week: WeekSchedule) => void
  lockWeek: () => void
  updateBlockStatus: (blockId: string, status: ScheduledBlock['status']) => void
  moveTask: (taskId: string, newDay: DayOfWeek, newTime: string) => void
  removeTask: (taskId: string) => void

  setMorningReviewTime: (time: string) => void
  setNightReviewTime: (time: string) => void

  getBlocksForDay: (day: DayOfWeek) => ScheduledBlock[]
  getGoalBlocksForDay: (day: DayOfWeek) => ScheduledBlock[]
  getCurrentBlock: () => ScheduledBlock | undefined
  getNextBlock: () => ScheduledBlock | undefined
  getTotalAvailableHours: () => number
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      lifeBlocks: SEED_LIFE_BLOCKS,
      currentWeek: null,
      weekHistory: [],
      morningReviewTime: '08:00',
      nightReviewTime: '21:00',

      addLifeBlock: (block) => {
        set({ lifeBlocks: [...get().lifeBlocks, { ...block, id: generateId() }] })
      },

      updateLifeBlock: (id, updates) => {
        set({ lifeBlocks: get().lifeBlocks.map(b => b.id === id ? { ...b, ...updates } : b) })
      },

      removeLifeBlock: (id) => {
        set({ lifeBlocks: get().lifeBlocks.filter(b => b.id !== id) })
      },

      setCurrentWeek: (week) => {
        const { currentWeek, weekHistory } = get()
        const history = currentWeek ? [...weekHistory, currentWeek].slice(-8) : weekHistory
        set({ currentWeek: week, weekHistory: history })
      },

      lockWeek: () => {
        const { currentWeek } = get()
        if (!currentWeek) return
        set({ currentWeek: { ...currentWeek, lockedAt: new Date().toISOString() } })
      },

      updateBlockStatus: (blockId, _status) => {
        const { currentWeek } = get()
        if (!currentWeek) return
        set({
          currentWeek: {
            ...currentWeek,
            blocks: schedulerService.rescheduleAfterCompletion(currentWeek.blocks, blockId, []),
          },
        })
      },

      moveTask: (taskId, newDay, newTime) => {
        const { currentWeek } = get()
        if (!currentWeek) return
        set({
          currentWeek: {
            ...currentWeek,
            blocks: schedulerService.moveTask(currentWeek.blocks, taskId, newDay, newTime),
          },
        })
      },

      removeTask: (taskId) => {
        const { currentWeek } = get()
        if (!currentWeek) return
        set({
          currentWeek: {
            ...currentWeek,
            blocks: schedulerService.removeTask(currentWeek.blocks, taskId),
          },
        })
      },

      setMorningReviewTime: (time) => set({ morningReviewTime: time }),
      setNightReviewTime: (time) => set({ nightReviewTime: time }),

      getBlocksForDay: (day) => {
        const { currentWeek } = get()
        if (!currentWeek) return []
        return currentWeek.blocks.filter(b => b.day === day).sort((a, b) => a.time.start.localeCompare(b.time.start))
      },

      getGoalBlocksForDay: (day) => {
        return get().getBlocksForDay(day).filter(b => b.type === 'goal_task')
      },

      getCurrentBlock: () => {
        const { currentWeek } = get()
        if (!currentWeek) return undefined
        return timeService.findCurrentBlock(currentWeek.blocks)
      },

      getNextBlock: () => {
        const { currentWeek } = get()
        if (!currentWeek) return undefined
        return timeService.findNextBlock(currentWeek.blocks)
      },

      getTotalAvailableHours: () => {
        const { lifeBlocks } = get()
        const HOURS_PER_WEEK = 168
        let blockedMinutes = 0
        for (const block of lifeBlocks) {
          const [startH, startM] = block.time.start.split(':').map(Number)
          const [endH, endM] = block.time.end.split(':').map(Number)
          let dur = (endH * 60 + endM) - (startH * 60 + startM)
          if (dur <= 0) dur += 24 * 60
          blockedMinutes += dur * block.days.length
        }
        return Math.max(0, HOURS_PER_WEEK - blockedMinutes / 60)
      },
    }),
    { name: 'kith-schedule' }
  )
)
