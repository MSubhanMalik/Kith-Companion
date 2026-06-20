import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/AuthService'

const ACCESS_COOKIE = 'kith_access'

interface AuthInitializerProps {
  onInitialized: () => void
}

export function AuthInitializer({ onInitialized }: AuthInitializerProps) {
  const { setAuth, logout } = useAuthStore()

  useEffect(() => {
    async function initialize() {
      const accessToken = Cookies.get(ACCESS_COOKIE)

      if (!accessToken) {
        logout()
        onInitialized()
        return
      }

      try {
        const user = await authService.getUserInfo()
        if (user) {
          setAuth(user, accessToken)
        } else {
          Cookies.remove(ACCESS_COOKIE)
          logout()
        }
      } catch {
        Cookies.remove(ACCESS_COOKIE)
        logout()
      }

      onInitialized()
    }

    initialize()
  }, [])

  return null
}
