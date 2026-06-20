import type { Goal, ScheduledBlock } from '../types'

export class AIService {
  async breakGoalIntoTasks(goalLabel: string, _targetDate: string): Promise<Array<{ text: string; day: string; time: string; description: string; output: string }>> {
    return [
      { text: `Plan ${goalLabel} strategy`, day: 'Mon', time: '5:30 PM', description: 'Define approach and milestones', output: 'Strategy document' },
      { text: `Execute first step for ${goalLabel}`, day: 'Tue', time: '5:30 PM', description: 'Start with the highest impact item', output: 'First deliverable' },
    ]
  }

  async generateCatMessage(_goals: Goal[], blocks: ScheduledBlock[], completions: Record<string, string>): Promise<string> {
    const totalTasks = blocks.filter(b => b.type === 'goal_task').length
    const doneTasks = Object.values(completions).filter(s => s === 'done').length
    return `${doneTasks} of ${totalTasks} done today`
  }

  async suggestReschedule(_blocks: ScheduledBlock[], _missedTaskId: string): Promise<string> {
    return 'I moved the missed task to tomorrow\'s first available slot.'
  }
}

export const aiService = new AIService()
