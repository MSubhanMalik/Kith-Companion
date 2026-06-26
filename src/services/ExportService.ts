import { axiosService } from './AxiosService'
import { endpoints } from '../config/api'
import { exportWeeklySchedule, exportGoalSchedule } from '../lib/export'

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

interface WeekExportData {
  weekOf: string
  blocks: Array<{
    day: string
    startTime: string
    endTime: string
    label: string
    type: string
    status: string
  }>
  filename: string
}

interface GoalExportData {
  goal: {
    id: number
    label: string
    targetDate: string | null
    weeklyHours: number
  }
  tasks: Array<{
    text: string
    description: string
    output: string
    dayOfWeek: string
    status: string
  }>
  filename: string
}

export const exportService = {
  async exportWeekReport(weekOf: string, weekLabel?: string) {
    const res = await axiosService.get<ApiResponse<WeekExportData>>(endpoints.export.week(weekOf))
    const data = res.data
    const blocks = data.blocks.map(b => ({
      day: b.day,
      label: b.label,
      time: { start: b.startTime, end: b.endTime },
      goalId: null,
      type: b.type,
      status: b.status,
    }))
    exportWeeklySchedule(blocks, [], weekLabel || `Week of ${data.weekOf}`)
  },

  async exportGoalReport(goalId: number, goalColor?: string) {
    const res = await axiosService.get<ApiResponse<GoalExportData>>(endpoints.export.goal(goalId))
    const data = res.data
    const tasks = data.tasks.map(t => ({
      text: t.text,
      description: t.description,
      output: t.output,
      day: t.dayOfWeek,
      done: t.status === 'DONE',
    }))
    exportGoalSchedule(data.goal.label, tasks, goalColor)
  },
}
