import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/auth'
import { useOnboardingStore } from '../../stores/onboarding'
import { useReadingStore } from '../../stores/reading'
import { PageTransition } from '../ui/PageTransition'
import { AppShell } from './AppShell'
import { LoginScreen } from '../auth/LoginScreen'
import { SignupScreen } from '../auth/SignupScreen'
import { WelcomeScreen } from '../onboarding/WelcomeScreen'
import { FieldPicker } from '../onboarding/FieldPicker'
import { GoalLevel } from '../onboarding/GoalLevel'
import { RoadmapScreen } from '../roadmap/RoadmapScreen'
import { TodayScreen } from '../today/TodayScreen'
import { QuestionScreen } from '../question/QuestionScreen'
import { BrainScreen } from '../brain/BrainScreen'
import { FetchScreen } from '../fetch/FetchScreen'
import { SettingsScreen } from '../settings/SettingsScreen'
import { ReadingScreen } from '../reading/ReadingScreen'

declare global {
  interface Window {
    appAPI?: {
      onFileContent: (cb: (data: { fileName: string; type: 'text' | 'pdf'; content: string }) => void) => void
    }
  }
}

function getSubRoute(): string {
  const hash = window.location.hash
  return hash.replace('#app', '').replace(/^\//, '') || ''
}

export function AppRouter() {
  const [route, setRoute] = useState(getSubRoute)
  const { isLoggedIn } = useAuthStore()
  const { isComplete } = useOnboardingStore()
  const { setFile, clear: clearReading } = useReadingStore()

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.body.style.userSelect = 'auto'
    const handleHash = () => setRoute(getSubRoute())
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  useEffect(() => {
    window.appAPI?.onFileContent((data) => {
      setFile(data.fileName, data.type, data.content)
    })
  }, [setFile])

  const navigate = (path: string) => {
    window.location.hash = `#app/${path}`
  }

  useEffect(() => {
    if (!route) {
      if (!isLoggedIn) {
        navigate('login')
      } else if (!isComplete) {
        navigate('welcome')
      } else {
        navigate('today')
      }
    }
  }, [route, isLoggedIn, isComplete])

  const authRoutes = ['login', 'signup']
  const onboardingRoutes = ['welcome', 'field', 'goal']
  const isAuth = authRoutes.includes(route)
  const isOnboarding = onboardingRoutes.includes(route)
  const isReading = route === 'reading'

  if (isReading) {
    return (
      <ReadingScreen onClose={() => {
        clearReading()
        navigate('today')
      }} />
    )
  }

  const renderScreen = () => {
    switch (route) {
      case 'login':
        return (
          <LoginScreen
            onLogin={() => navigate(isComplete ? 'today' : 'welcome')}
            onSwitchToSignup={() => navigate('signup')}
          />
        )
      case 'signup':
        return (
          <SignupScreen
            onSignup={() => navigate('welcome')}
            onSwitchToLogin={() => navigate('login')}
          />
        )
      case 'welcome':
        return <WelcomeScreen onNext={() => navigate('field')} />
      case 'field':
        return <FieldPicker onNext={() => navigate('goal')} />
      case 'goal':
        return <GoalLevel onNext={() => navigate('roadmap')} />
      case 'roadmap':
        return <RoadmapScreen />
      case 'today':
        return <TodayScreen onNavigate={navigate} />
      case 'question':
        return <QuestionScreen onBack={() => navigate('today')} />
      case 'brain':
        return <BrainScreen />
      case 'fetch':
        return <FetchScreen onBack={() => navigate('today')} />
      case 'settings':
        return <SettingsScreen onLogout={() => navigate('login')} />
      default:
        return null
    }
  }

  if (isAuth || isOnboarding) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <PageTransition routeKey={route}>
            {renderScreen()}
          </PageTransition>
        </div>
      </div>
    )
  }

  return (
    <AppShell currentRoute={route} onNavigate={navigate}>
      <PageTransition routeKey={route}>
        {renderScreen()}
      </PageTransition>
    </AppShell>
  )
}
