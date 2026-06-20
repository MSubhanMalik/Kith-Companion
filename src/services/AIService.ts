import type { Goal, ScheduledBlock } from '../types'

export class AIService {
  async breakGoalIntoTasks(_goalLabel: string, _targetDate: string): Promise<Array<{ text: string; day: string; time: string; description: string; output: string }>> {
    return []
  }

  async generateCatMessage(_goals: Goal[], _blocks: ScheduledBlock[], _completions: Record<string, string>): Promise<string> {
    return ''
  }

  async suggestReschedule(_blocks: ScheduledBlock[], _missedTaskId: string): Promise<string> {
    return ''
  }
}

export const aiService = new AIService()
