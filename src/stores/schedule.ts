import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LifeBlock, WeekSchedule, ScheduledBlock, DayOfWeek } from '../types'
import { getCurrentDayOfWeek, getCurrentBlock as findCurrentBlock, getNextBlock as findNextBlock } from '../lib/time'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

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

  setMorningReviewTime: (time: string) => void
  setNightReviewTime: (time: string) => void

  getBlocksForDay: (day: DayOfWeek) => ScheduledBlock[]
  getCurrentBlock: () => ScheduledBlock | undefined
  getNextBlock: () => ScheduledBlock | undefined
  getGoalBlocksForDay: (day: DayOfWeek) => ScheduledBlock[]
  getTotalAvailableHours: () => number
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      lifeBlocks: [],
      currentWeek: null,
      weekHistory: [],
      morningReviewTime: '08:00',
      nightReviewTime: '21:00',

      addLifeBlock: (block) => {
        set({ lifeBlocks: [...get().lifeBlocks, { ...block, id: generateId() }] })
      },

      updateLifeBlock: (id, updates) => {
        set({
          lifeBlocks: get().lifeBlocks.map(b =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })
      },

      removeLifeBlock: (id) => {
        set({ lifeBlocks: get().lifeBlocks.filter(b => b.id !== id) })
      },

      setCurrentWeek: (week) => {
        const { currentWeek, weekHistory } = get()
        const history = currentWeek
          ? [...weekHistory, currentWeek].slice(-8)
          : weekHistory
        set({ currentWeek: week, weekHistory: history })
      },

      lockWeek: () => {
        const { currentWeek } = get()
        if (!currentWeek) return
        set({
          currentWeek: {
            ...currentWeek,
            lockedAt: new Date().toISOString(),
          },
        })
      },

      updateBlockStatus: (blockId, status) => {
        const { currentWeek } = get()
        if (!currentWeek) return
        set({
          currentWeek: {
            ...currentWeek,
            blocks: currentWeek.blocks.map(b =>
              b.id === blockId ? { ...b, status } : b
            ),
          },
        })
      },

      setMorningReviewTime: (time) => set({ morningReviewTime: time }),
      setNightReviewTime: (time) => set({ nightReviewTime: time }),

      getBlocksForDay: (day) => {
        const { currentWeek } = get()
        if (!currentWeek) return []
        return currentWeek.blocks
          .filter(b => b.day === day)
          .sort((a, b) => a.time.start.localeCompare(b.time.start))
      },

      getCurrentBlock: () => {
        const { currentWeek } = get()
        if (!currentWeek) return undefined
        return findCurrentBlock(currentWeek.blocks, getCurrentDayOfWeek())
      },

      getNextBlock: () => {
        const { currentWeek } = get()
        if (!currentWeek) return undefined
        return findNextBlock(currentWeek.blocks, getCurrentDayOfWeek())
      },

      getGoalBlocksForDay: (day) => {
        return get().getBlocksForDay(day).filter(b => b.type === 'goal_task')
      },

      getTotalAvailableHours: () => {
        const { lifeBlocks } = get()
        const HOURS_PER_DAY = 24
        const DAYS_PER_WEEK = 7
        const totalHoursInWeek = HOURS_PER_DAY * DAYS_PER_WEEK

        let blockedMinutes = 0
        for (const block of lifeBlocks) {
          const [startH, startM] = block.time.start.split(':').map(Number)
          const [endH, endM] = block.time.end.split(':').map(Number)
          let durationMinutes = (endH * 60 + endM) - (startH * 60 + startM)
          if (durationMinutes <= 0) durationMinutes += 24 * 60
          blockedMinutes += durationMinutes * block.days.length
        }

        return Math.max(0, totalHoursInWeek - blockedMinutes / 60)
      },
    }),
    { name: 'kith-schedule' }
  )
)
