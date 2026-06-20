import type { Goal, Milestone, LifeBlock, ScheduledBlock } from '../types'
import { generateWeekSchedule } from '../lib/scheduler'

export class SchedulerService {
  generateWeek(weekOf: string, goals: Goal[], milestones: Milestone[], lifeBlocks: LifeBlock[]): ScheduledBlock[] {
    return generateWeekSchedule(weekOf, goals, milestones, lifeBlocks)
  }

  rescheduleAfterCompletion(
    currentBlocks: ScheduledBlock[],
    completedBlockId: string,
    _goals: Goal[]
  ): ScheduledBlock[] {
    return currentBlocks.map(b =>
      b.id === completedBlockId ? { ...b, status: 'completed' as const } : b
    )
  }

  moveTask(blocks: ScheduledBlock[], taskId: string, newDay: ScheduledBlock['day'], newTime: string): ScheduledBlock[] {
    return blocks.map(b =>
      b.id === taskId ? { ...b, day: newDay, time: { ...b.time, start: newTime } } : b
    )
  }

  removeTask(blocks: ScheduledBlock[], taskId: string): ScheduledBlock[] {
    return blocks.filter(b => b.id !== taskId)
  }
}

export const schedulerService = new SchedulerService()
