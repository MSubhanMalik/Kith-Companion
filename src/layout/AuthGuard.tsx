import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/AuthService'
import { axiosService } from '../services/AxiosService'
import { LoginScreen } from '../components/auth/LoginScreen'
import { RegisterScreen } from '../components/auth/RegisterScreen'
import { useToastStore } from '../components/ui/Toast'

declare global {
  interface Window {
    appAPI?: {
      onFileContent: (cb: (data: unknown) => void) => void
      googleAuth: () => Promise<string>
    }
  }
}

type AuthView = 'login' | 'register'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, setAuth } = useAuthStore()
  const [authView, setAuthView] = useState<AuthView>('login')
  const addToast = useToastStore(s => s.addToast)

  async function handleLogin(email: string, password: string) {
    try {
      const result = await authService.login(email, password)
      axiosService.setAccessToken(result.access_token)
      setAuth(result.user, result.access_token)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Login failed'
      addToast(msg, 'error')
    }
  }

  async function handleRegister(email: string, password: string, firstName: string, lastName: string) {
    try {
      const result = await authService.register(email, password, firstName, lastName)
      axiosService.setAccessToken(result.access_token)
      setAuth(result.user, result.access_token)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Registration failed'
      addToast(msg, 'error')
    }
  }

  async function handleGoogleLogin() {
    if (!window.appAPI?.googleAuth) {
      addToast('Google login only works in the desktop app', 'info')
      return
    }

    try {
      const idToken = await window.appAPI.googleAuth()
      const result = await authService.googleAuth(idToken)
      axiosService.setAccessToken(result.access_token)
      setAuth(result.user, result.access_token)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Google login failed'
      if (msg !== 'Auth window closed') {
        addToast(msg, 'error')
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        {authView === 'login' ? (
          <LoginScreen
            key="login"
            onLogin={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterScreen
            key="register"
            onRegister={handleRegister}
            onGoogleLogin={handleGoogleLogin}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </AnimatePresence>
    )
  }

  return <>{children}</>
}
