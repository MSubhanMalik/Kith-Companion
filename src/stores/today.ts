import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DayLog, Nudge, NudgeType } from '../types'
import { getTodayISO } from '../lib/time'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function emptyLog(date: string): DayLog {
  return {
    date,
    morningCommitment: [],
    taskCompletions: {},
    focusScores: {},
    distractions: [],
    energyLevel: 0,
    tomorrowTopThree: [],
  }
}

interface TodayStore {
  logs: Record<string, DayLog>
  nudges: Nudge[]

  getLog: (date?: string) => DayLog
  setMorningCommitment: (commitments: string[], date?: string) => void
  setTaskCompletion: (blockId: string, status: 'done' | 'partial' | 'skipped', date?: string) => void
  setFocusScore: (blockId: string, score: number, date?: string) => void
  addDistraction: (text: string, date?: string) => void
  removeDistraction: (index: number, date?: string) => void
  setEnergyLevel: (level: number, date?: string) => void
  setTomorrowTopThree: (items: string[], date?: string) => void
  completeMorning: (date?: string) => void
  completeNight: (date?: string) => void
  isMorningDone: (date?: string) => boolean
  isNightDone: (date?: string) => boolean

  addNudge: (type: NudgeType, message: string, scheduledBlockId?: string) => void
  dismissNudge: (id: string) => void
  hasNudgeFired: (type: NudgeType, scheduledBlockId?: string) => boolean
  clearOldNudges: () => void
}

export const useTodayStore = create<TodayStore>()(
  persist(
    (set, get) => ({
      logs: {},
      nudges: [],

      getLog: (date) => {
        const d = date ?? getTodayISO()
        return get().logs[d] ?? emptyLog(d)
      },

      setMorningCommitment: (commitments, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({ logs: { ...logs, [d]: { ...log, morningCommitment: commitments } } })
      },

      setTaskCompletion: (blockId, status, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({
          logs: {
            ...logs,
            [d]: { ...log, taskCompletions: { ...log.taskCompletions, [blockId]: status } },
          },
        })
      },

      setFocusScore: (blockId, score, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({
          logs: {
            ...logs,
            [d]: { ...log, focusScores: { ...log.focusScores, [blockId]: score } },
          },
        })
      },

      addDistraction: (text, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({
          logs: {
            ...logs,
            [d]: { ...log, distractions: [...log.distractions, text] },
          },
        })
      },

      removeDistraction: (index, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({
          logs: {
            ...logs,
            [d]: { ...log, distractions: log.distractions.filter((_, i) => i !== index) },
          },
        })
      },

      setEnergyLevel: (level, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({ logs: { ...logs, [d]: { ...log, energyLevel: level } } })
      },

      setTomorrowTopThree: (items, date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({ logs: { ...logs, [d]: { ...log, tomorrowTopThree: items } } })
      },

      completeMorning: (date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({
          logs: { ...logs, [d]: { ...log, morningDoneAt: new Date().toISOString() } },
        })
      },

      completeNight: (date) => {
        const d = date ?? getTodayISO()
        const { logs } = get()
        const log = logs[d] ?? emptyLog(d)
        set({
          logs: { ...logs, [d]: { ...log, nightDoneAt: new Date().toISOString() } },
        })
      },

      isMorningDone: (date) => {
        const d = date ?? getTodayISO()
        return !!get().logs[d]?.morningDoneAt
      },

      isNightDone: (date) => {
        const d = date ?? getTodayISO()
        return !!get().logs[d]?.nightDoneAt
      },

      addNudge: (type, message, scheduledBlockId) => {
        const nudge: Nudge = {
          id: generateId(),
          type,
          message,
          scheduledBlockId,
          triggeredAt: new Date().toISOString(),
          dismissed: false,
        }
        set({ nudges: [...get().nudges, nudge] })
      },

      dismissNudge: (id) => {
        set({
          nudges: get().nudges.map(n =>
            n.id === id ? { ...n, dismissed: true } : n
          ),
        })
      },

      hasNudgeFired: (type, scheduledBlockId) => {
        return get().nudges.some(
          n => n.type === type && n.scheduledBlockId === scheduledBlockId
        )
      },

      clearOldNudges: () => {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
        set({
          nudges: get().nudges.filter(
            n => new Date(n.triggeredAt).getTime() > oneDayAgo
          ),
        })
      },
    }),
    { name: 'kith-today' }
  )
)
