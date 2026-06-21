import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LifeBlock, WeekSchedule, ScheduledBlock, DayOfWeek } from '../types'
import { scheduleService } from '../services/ScheduleService'
import { timeService } from '../services'

interface ScheduleStore {
  lifeBlocks: LifeBlock[]
  currentWeek: WeekSchedule | null
  weekHistory: WeekSchedule[]
  morningReviewTime: string
  nightReviewTime: string
  loading: boolean

  fetchLifeBlocks: () => Promise<void>
  addLifeBlock: (block: Omit<LifeBlock, 'id'>) => Promise<void>
  updateLifeBlock: (id: string, updates: Partial<Omit<LifeBlock, 'id'>>) => Promise<void>
  removeLifeBlock: (id: string) => Promise<void>

  fetchWeek: (weekOf: string) => Promise<void>
  generateWeek: (weekOf: string) => Promise<void>
  lockWeek: (weekOf: string) => Promise<void>

  setCurrentWeek: (week: WeekSchedule) => void
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
      lifeBlocks: [],
      currentWeek: null,
      weekHistory: [],
      morningReviewTime: '08:00',
      nightReviewTime: '21:00',
      loading: false,

      fetchLifeBlocks: async () => {
        try {
          const data = await scheduleService.listLifeBlocks()
          set({ lifeBlocks: data as LifeBlock[] })
        } catch {}
      },

      addLifeBlock: async (block) => {
        try {
          const created = await scheduleService.createLifeBlock({
            label: block.label,
            start_time: block.time.start,
            end_time: block.time.end,
            days: block.days,
          })
          set({ lifeBlocks: [...get().lifeBlocks, created as LifeBlock] })
        } catch {}
      },

      updateLifeBlock: async (id, updates) => {
        const apiData: Record<string, unknown> = {}
        if (updates.label) apiData.label = updates.label
        if (updates.time) {
          apiData.start_time = updates.time.start
          apiData.end_time = updates.time.end
        }
        if (updates.days) apiData.days = updates.days

        try {
          const updated = await scheduleService.updateLifeBlock(Number(id), apiData)
          set({ lifeBlocks: get().lifeBlocks.map(b => String(b.id) === String(id) ? updated as LifeBlock : b) })
        } catch {}
      },

      removeLifeBlock: async (id) => {
        try {
          await scheduleService.removeLifeBlock(Number(id))
          set({ lifeBlocks: get().lifeBlocks.filter(b => String(b.id) !== String(id)) })
        } catch {}
      },

      fetchWeek: async (weekOf) => {
        set({ loading: true })
        try {
          const data = await scheduleService.getWeek(weekOf)
          if (data) {
            set({ currentWeek: data as WeekSchedule, loading: false })
          } else {
            set({ currentWeek: null, loading: false })
          }
        } catch {
          set({ loading: false })
        }
      },

      generateWeek: async (weekOf) => {
        set({ loading: true })
        try {
          const data = await scheduleService.generate(weekOf)
          set({ currentWeek: data as WeekSchedule, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      lockWeek: async (weekOf) => {
        try {
          const data = await scheduleService.lock(weekOf)
          set({ currentWeek: data as WeekSchedule })
        } catch {}
      },

      setCurrentWeek: (week) => {
        const { currentWeek, weekHistory } = get()
        const history = currentWeek ? [...weekHistory, currentWeek].slice(-8) : weekHistory
        set({ currentWeek: week, weekHistory: history })
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
    { name: 'kith-schedule', version: 2, migrate: () => ({ lifeBlocks: [], currentWeek: null, weekHistory: [], morningReviewTime: '08:00', nightReviewTime: '21:00', loading: false }) }
  )
)
