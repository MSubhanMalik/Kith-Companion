import { exportWeeklySchedule, exportGoalSchedule } from '../lib/export'

export class ExportService {
  exportWeek() {
    exportWeeklySchedule()
  }

  exportGoal(goalName: string) {
    exportGoalSchedule(goalName)
  }
}

export const exportService = new ExportService()
