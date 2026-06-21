import { axiosService } from './AxiosService'
import { endpoints } from '../config/api'

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export const todayService = {
  async getToday() {
    const res = await axiosService.get<ApiResponse<unknown>>(endpoints.today.get)
    return res.data
  },

  async completeBlock(blockId: number, status: string) {
    const res = await axiosService.post<ApiResponse<unknown>>(`${endpoints.today.complete(blockId)}?status=${status}`)
    return res.data
  },

  async closeDay() {
    const res = await axiosService.post<ApiResponse<unknown>>(endpoints.today.closeDay)
    return res.data
  },
}
