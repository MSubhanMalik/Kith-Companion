import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cat } from '../cat/Cat'
import { Button } from '../ui/Button'

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void
  onGoogleLogin: () => void
  onSwitchToRegister: () => void
}

export function LoginScreen({ onLogin, onGoogleLogin, onSwitchToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Both fields are required')
      return
    }
    onLogin(email, password)
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-[22rem]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-10">
          <Cat state="idle" size={56} />
        </div>

        <h1 className="text-2xl font-bold text-text-primary text-center mb-2" style={{ letterSpacing: '-0.02em' }}>
          Welcome back
        </h1>
        <p className="text-sm text-text-muted text-center mb-10">
          Sign in to continue to Kith
        </p>

        <button
          onClick={onGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border/40 text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors cursor-pointer mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border/30" />
          <span className="text-xs text-text-muted">or</span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-muted block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
            />
          </div>

          {error && <p className="text-xs text-direction">{error}</p>}

          <div className="mt-2">
            <Button variant="primary" size="md" label="Sign in" fullWidth />
          </div>
        </form>

        <p className="text-xs text-text-muted text-center mt-8">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-olive hover:text-olive-hover cursor-pointer font-medium">
            Create one
          </button>
        </p>
      </motion.div>
    </div>
  )
}
