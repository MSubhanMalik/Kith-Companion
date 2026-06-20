import { axiosService } from './AxiosService'
import { endpoints } from '../config/api'

interface StandardResponse<T> {
  data: T
  message: string
  status: number
  success: boolean
}

interface AuthData {
  access_token: string
  refresh_token: string
  user: {
    id: number
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
}

export class AuthService {
  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<AuthData> {
    const res = await axiosService.post<StandardResponse<AuthData>>(endpoints.auth.register, {
      email, password, first_name: firstName, last_name: lastName,
    })
    return res.data
  }

  async login(email: string, password: string): Promise<AuthData> {
    const res = await axiosService.post<StandardResponse<AuthData>>(endpoints.auth.login, { email, password })
    return res.data
  }

  async googleAuth(token: string): Promise<AuthData> {
    const res = await axiosService.post<StandardResponse<AuthData>>(endpoints.auth.google, { token })
    return res.data
  }

  async getUserInfo(): Promise<AuthData['user'] | null> {
    try {
      const res = await axiosService.get<StandardResponse<AuthData['user']>>(endpoints.auth.me)
      return res.data
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()
