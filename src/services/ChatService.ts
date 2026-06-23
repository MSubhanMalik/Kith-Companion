import { axiosService } from './AxiosService'
import { endpoints } from '../config/api'

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

interface ChatMessage {
  id: number
  role: string
  content: string
  createdAt: string
}

export const chatService = {
  async send(message: string, pageContext?: { screen: string; goalId?: number | null }) {
    const res = await axiosService.post<ApiResponse<ChatMessage>>(endpoints.chat.send, {
      message,
      page_context: pageContext || undefined,
    })
    return res.data
  },

  async getHistory() {
    const res = await axiosService.get<ApiResponse<ChatMessage[]>>(endpoints.chat.history)
    return res.data
  },

}
