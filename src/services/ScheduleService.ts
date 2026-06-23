import { axiosService } from './AxiosService'
import { endpoints } from '../config/api'

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export const scheduleService = {
  async getWeek(weekOf: string, goalId?: number) {
    const url = goalId ? `${endpoints.schedule.week(weekOf)}?goal_id=${goalId}` : endpoints.schedule.week(weekOf)
    const res = await axiosService.get<ApiResponse<unknown>>(url)
    return res.data
  },

  async generate(weekOf: string) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.schedule.generate, { week_of: weekOf })
    return res.data
  },

  async lock(weekOf: string) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.schedule.lock(weekOf))
    return res.data
  },

  async reschedule(weekOf: string) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.schedule.reschedule(weekOf))
    return res.data
  },

  async moveBlock(blockId: number, newDay: string, newTime: string) {
    const res = await axiosService.patch<ApiResponse<unknown>>(endpoints.schedule.moveBlock(blockId), { new_day: newDay, new_time: newTime })
    return res.data
  },

  async listLifeBlocks() {
    const res = await axiosService.get<ApiResponse<unknown[]>>(endpoints.schedule.lifeBlocks)
    return res.data
  },

  async createLifeBlock(data: { label: string; start_time: string; end_time: string; days: string[] }) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.schedule.lifeBlocks, data)
    return res.data
  },

  async updateLifeBlock(id: number, data: Record<string, unknown>) {
    const res = await axiosService.patch<ApiResponse<unknown>>(endpoints.schedule.updateLifeBlock(id), data)
    return res.data
  },

  async removeLifeBlock(id: number) {
    await axiosService.delete(endpoints.schedule.deleteLifeBlock(id))
  },
}
