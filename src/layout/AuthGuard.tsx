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
    if (window.appAPI?.googleAuth) {
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
      return
    }

    const clientId = '691765170991-r2ifupsq46pmfof1586794a8epbbbdgr.apps.googleusercontent.com'
    const redirectUri = window.location.origin
    const nonce = Date.now().toString()
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid+email+profile&nonce=${nonce}`

    const popup = window.open(authUrl, 'google-auth', 'width=500,height=700')
    if (!popup) {
      addToast('Popup blocked — allow popups for this site', 'error')
      return
    }

    const interval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(interval)
          return
        }
        const url = popup.location.href
        if (url.startsWith(redirectUri)) {
          clearInterval(interval)
          const hash = url.split('#')[1]
          if (hash) {
            const params = new URLSearchParams(hash)
            const idToken = params.get('id_token')
            if (idToken) {
              popup.close()
              authService.googleAuth(idToken).then(result => {
                axiosService.setAccessToken(result.access_token)
                setAuth(result.user, result.access_token)
              }).catch(() => addToast('Google login failed', 'error'))
            }
          }
        }
      } catch {}
    }, 500)
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
