import type { Goal, Milestone, LifeBlock, ScheduledBlock, DayOfWeek } from '../types'

export class SchedulerService {
  generateWeek(_weekOf: string, _goals: Goal[], _milestones: Milestone[], _lifeBlocks: LifeBlock[]): ScheduledBlock[] {
    return []
  }

  rescheduleAfterCompletion(blocks: ScheduledBlock[], _completedBlockId: string, _goals: Goal[]): ScheduledBlock[] {
    return blocks
  }

  moveTask(blocks: ScheduledBlock[], _taskId: string, _newDay: DayOfWeek, _newTime: string): ScheduledBlock[] {
    return blocks
  }

  removeTask(blocks: ScheduledBlock[], _taskId: string): ScheduledBlock[] {
    return blocks
  }
}

export const schedulerService = new SchedulerService()
