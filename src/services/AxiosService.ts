import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../components/ui/Toast'
import { API_BASE } from '../config/api'

const ACCESS_COOKIE = 'kith_access'
const ACCESS_EXPIRES_HOURS = 1

class AxiosService {
  private static instance: AxiosService
  private axiosInstance: AxiosInstance

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000,
      withCredentials: true,
    })

    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const newToken = response.headers['x-new-access-token']
        if (newToken) {
          this.setAccessToken(newToken)
        }

        if (response.data?.data?.access_token) {
          this.setAccessToken(response.data.data.access_token)
          if (response.data.data.user) {
            useAuthStore.getState().setAuth(response.data.data.user, response.data.data.access_token)
          }
        }

        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          this.removeAccessToken()
          useAuthStore.getState().logout()
        } else {
          const message = error.response?.data?.message || error.response?.data?.detail || error.message || 'Something went wrong'
          useToastStore.getState().addToast(message, 'error')
        }
        return Promise.reject(error.response?.data || error)
      }
    )
  }

  private getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_COOKIE)
  }

  setAccessToken(token: string) {
    Cookies.set(ACCESS_COOKIE, token, {
      sameSite: 'lax',
      expires: new Date(Date.now() + ACCESS_EXPIRES_HOURS * 60 * 60 * 1000),
    })
  }

  removeAccessToken() {
    Cookies.remove(ACCESS_COOKIE)
  }

  static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService()
    }
    return AxiosService.instance
  }

  async get<T>(url: string): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.get(url)
    return res.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.post(url, data)
    return res.data
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.patch(url, data)
    return res.data
  }

  async delete<T>(url: string): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.delete(url)
    return res.data
  }
}

export const axiosService = AxiosService.getInstance()
