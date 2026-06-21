import { axiosService } from './AxiosService'
import { endpoints } from '../config/api'

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export const goalService = {
  async list() {
    const res = await axiosService.get<ApiResponse<unknown[]>>(endpoints.goals.list)
    return res.data
  },

  async create(data: { label: string; color_id?: string; target_date?: string; weekly_hours?: number; is_private?: boolean; nickname?: string }) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.goals.create, data)
    return res.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const res = await axiosService.patch<ApiResponse<unknown>>(endpoints.goals.update(id), data)
    return res.data
  },

  async remove(id: number) {
    await axiosService.delete(endpoints.goals.delete(id))
  },

  async reorder(orderedIds: number[]) {
    await axiosService.post(endpoints.goals.reorder, { ordered_ids: orderedIds })
  },

  async listTasks(goalId: number) {
    const res = await axiosService.get<ApiResponse<unknown[]>>(endpoints.tasks.list(goalId))
    return res.data
  },

  async createTask(goalId: number, data: { text: string; description?: string; output?: string; day_of_week?: string; scheduled_time?: string; estimated_minutes?: number }) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.tasks.create(goalId), data)
    return res.data
  },

  async updateTask(goalId: number, taskId: number, data: Record<string, unknown>) {
    const res = await axiosService.patch<ApiResponse<unknown>>(endpoints.tasks.update(goalId, taskId), data)
    return res.data
  },

  async removeTask(goalId: number, taskId: number) {
    await axiosService.delete(endpoints.tasks.delete(goalId, taskId))
  },

  async reorderTasks(goalId: number, orderedIds: number[]) {
    await axiosService.post(endpoints.tasks.reorder(goalId), { ordered_ids: orderedIds })
  },

  async listNotes(goalId: number) {
    const res = await axiosService.get<ApiResponse<unknown[]>>(endpoints.notes.list(goalId))
    return res.data
  },

  async createNote(goalId: number, text: string) {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.notes.create(goalId), { text })
    return res.data
  },

  async updateNote(goalId: number, noteId: number, data: Record<string, unknown>) {
    const res = await axiosService.patch<ApiResponse<unknown>>(endpoints.notes.update(goalId, noteId), data)
    return res.data
  },

  async removeNote(goalId: number, noteId: number) {
    await axiosService.delete(endpoints.notes.delete(goalId, noteId))
  },

  async breakdownGoal(goalId: number) {
    const res = await axiosService.post<ApiResponse<unknown[]>>(endpoints.goals.breakdown(goalId))
    return res.data
  },
}
