import type { LifeBlock, Goal, Milestone, ScheduledBlock, TimeRange } from '../types'
import { DAYS_OF_WEEK } from '../types'
import { timeToMinutes, minutesToTime } from './time'

const SLOT_MINUTES = 30
const SLOTS_PER_DAY = 48
const MIN_SESSION_SLOTS = 1
const PREFERRED_SESSION_SLOTS = 3
const MAX_SESSION_SLOTS = 4
const MAX_DAY_RATIO = 0.4

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

type SlotMatrix = boolean[][]

function buildAvailabilityMatrix(lifeBlocks: LifeBlock[]): SlotMatrix {
  const matrix: SlotMatrix = DAYS_OF_WEEK.map(() =>
    Array(SLOTS_PER_DAY).fill(true)
  )

  for (const block of lifeBlocks) {
    const startSlot = Math.floor(timeToMinutes(block.time.start) / SLOT_MINUTES)
    const endSlot = Math.ceil(timeToMinutes(block.time.end) / SLOT_MINUTES)

    for (const day of block.days) {
      const dayIndex = DAYS_OF_WEEK.indexOf(day)
      if (dayIndex === -1) continue

      if (startSlot < endSlot) {
        for (let s = startSlot; s < endSlot && s < SLOTS_PER_DAY; s++) {
          matrix[dayIndex][s] = false
        }
      } else {
        for (let s = startSlot; s < SLOTS_PER_DAY; s++) {
          matrix[dayIndex][s] = false
        }
        for (let s = 0; s < endSlot; s++) {
          matrix[dayIndex][s] = false
        }
      }
    }
  }

  return matrix
}

function findContiguousSlots(daySlots: boolean[], minLength: number): { start: number; length: number }[] {
  const runs: { start: number; length: number }[] = []
  let runStart = -1
  let runLength = 0

  for (let i = 0; i < daySlots.length; i++) {
    if (daySlots[i]) {
      if (runStart === -1) runStart = i
      runLength++
    } else {
      if (runLength >= minLength) {
        runs.push({ start: runStart, length: runLength })
      }
      runStart = -1
      runLength = 0
    }
  }
  if (runLength >= minLength) {
    runs.push({ start: runStart, length: runLength })
  }

  return runs.sort((a, b) => b.length - a.length)
}

interface TaskToSchedule {
  goalId: string
  goalLabel: string
  stepText?: string
  milestoneStepId?: string
  slots: number
}

function collectTasks(goal: Goal, milestones: Milestone[]): TaskToSchedule[] {
  const goalMilestones = milestones.filter(m => m.goalId === goal.id)
  const tasks: TaskToSchedule[] = []

  for (const milestone of goalMilestones) {
    if (milestone.steps.length > 0) {
      for (const step of milestone.steps) {
        if (step.status === 'done') continue
        tasks.push({
          goalId: goal.id,
          goalLabel: goal.label,
          stepText: step.text,
          milestoneStepId: step.id,
          slots: Math.max(MIN_SESSION_SLOTS, Math.ceil(step.estimatedMinutes / SLOT_MINUTES)),
        })
      }
    } else {
      const totalSlots = Math.max(MIN_SESSION_SLOTS, Math.ceil(goal.weeklyHours * 60 / SLOT_MINUTES))
      tasks.push({
        goalId: goal.id,
        goalLabel: goal.label,
        stepText: milestone.text,
        slots: totalSlots,
      })
    }
  }

  if (tasks.length === 0) {
    const totalSlots = Math.ceil(goal.weeklyHours * 60 / SLOT_MINUTES)
    const sessionsNeeded = Math.ceil(totalSlots / PREFERRED_SESSION_SLOTS)
    const slotsPerSession = Math.ceil(totalSlots / sessionsNeeded)

    for (let i = 0; i < sessionsNeeded; i++) {
      tasks.push({
        goalId: goal.id,
        goalLabel: goal.label,
        stepText: `${goal.label} work`,
        slots: Math.min(slotsPerSession, MAX_SESSION_SLOTS),
      })
    }
  }

  return tasks
}

export function generateWeekSchedule(
  _weekOf: string,
  goals: Goal[],
  milestones: Milestone[],
  lifeBlocks: LifeBlock[]
): ScheduledBlock[] {
  const matrix = buildAvailabilityMatrix(lifeBlocks)
  const scheduledBlocks: ScheduledBlock[] = []

  for (const block of lifeBlocks) {
    for (const day of block.days) {
      scheduledBlocks.push({
        id: generateId(),
        type: 'life_block',
        referenceId: block.id,
        day,
        time: { start: block.time.start, end: block.time.end },
        label: block.label,
        status: 'scheduled',
      })
    }
  }

  const sortedGoals = [...goals].sort((a, b) => a.rank - b.rank)

  for (const goal of sortedGoals) {
    const tasks = collectTasks(goal, milestones)
    let totalSlotsUsed = 0
    const maxSlots = Math.ceil(goal.weeklyHours * 60 / SLOT_MINUTES)
    const maxSlotsPerDay = Math.ceil(maxSlots * MAX_DAY_RATIO)
    const slotsPerDay: Record<number, number> = {}

    for (const task of tasks) {
      if (totalSlotsUsed >= maxSlots) break

      let placed = false
      const dayOrder = getDayRoundRobin(slotsPerDay)

      for (const dayIndex of dayOrder) {
        if (placed) break
        const currentDaySlots = slotsPerDay[dayIndex] ?? 0
        if (currentDaySlots >= maxSlotsPerDay) continue

        const available = findContiguousSlots(matrix[dayIndex], MIN_SESSION_SLOTS)
        if (available.length === 0) continue

        const slotsNeeded = Math.min(
          task.slots,
          maxSlots - totalSlotsUsed,
          maxSlotsPerDay - currentDaySlots,
          MAX_SESSION_SLOTS
        )

        for (const run of available) {
          const sessionLength = Math.min(slotsNeeded, run.length)
          if (sessionLength < MIN_SESSION_SLOTS) continue

          const startMin = run.start * SLOT_MINUTES
          const endMin = startMin + sessionLength * SLOT_MINUTES
          const time: TimeRange = {
            start: minutesToTime(startMin),
            end: minutesToTime(endMin),
          }

          for (let s = run.start; s < run.start + sessionLength; s++) {
            matrix[dayIndex][s] = false
          }

          scheduledBlocks.push({
            id: generateId(),
            type: 'goal_task',
            referenceId: goal.id,
            day: DAYS_OF_WEEK[dayIndex],
            time,
            label: goal.label,
            taskDescription: task.stepText,
            milestoneStepId: task.milestoneStepId,
            status: 'scheduled',
          })

          totalSlotsUsed += sessionLength
          slotsPerDay[dayIndex] = (slotsPerDay[dayIndex] ?? 0) + sessionLength
          placed = true
          break
        }
      }
    }
  }

  return scheduledBlocks.sort((a, b) => {
    const dayDiff = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day)
    if (dayDiff !== 0) return dayDiff
    return a.time.start.localeCompare(b.time.start)
  })
}

function getDayRoundRobin(slotsPerDay: Record<number, number>): number[] {
  return Array.from({ length: 7 }, (_, i) => i)
    .sort((a, b) => (slotsPerDay[a] ?? 0) - (slotsPerDay[b] ?? 0))
}
