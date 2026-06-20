import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './AppShell'
import { WelcomeScreen } from '../onboarding/WelcomeScreen'
import { SetupScreen } from '../onboarding/SetupScreen'
import { SchedulePreviewScreen } from '../onboarding/SchedulePreviewScreen'
import { HomeScreen } from '../home/HomeScreen'
import { EndOfDayScreen } from '../home/EndOfDayScreen'
import { WeekScreen } from '../week/WeekScreen'
import { GoalsListScreen } from '../goals/GoalsListScreen'
import { GoalScreen } from '../goals/GoalScreen'
import { SettingsScreen } from '../settings/SettingsScreen'

type Step = 'welcome' | 'setup' | 'preview'

function getRoute(): string {
  return window.location.hash.replace('#app/', '').replace('#app', '') || 'home'
}

export function AppRouter() {
  const [route, setRoute] = useState(getRoute)
  const [onboarded, setOnboarded] = useState(false)
  const [step, setStep] = useState<Step>('welcome')

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.body.style.userSelect = 'auto'
    document.body.style.background = 'var(--color-page)'

    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function nav(r: string) {
    window.location.hash = `#app/${r}`
    setRoute(r)
  }

  if (!onboarded) {
    return (
      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeScreen key="w" onNext={() => setStep('setup')} />}
        {step === 'setup' && <SetupScreen key="s" onNext={() => setStep('preview')} onBack={() => setStep('welcome')} />}
        {step === 'preview' && <SchedulePreviewScreen key="p" onLockIn={() => { setOnboarded(true); nav('home') }} onBack={() => setStep('setup')} />}
      </AnimatePresence>
    )
  }

  function screen() {
    switch (route) {
      case 'home': return <HomeScreen key="home" />
      case 'review': return <EndOfDayScreen key="review" />
      case 'week': return <WeekScreen key="week" />
      case 'goals': return <GoalsListScreen key="goals" onGoalClick={() => nav('goal')} />
      case 'goal': return <GoalScreen key="goal" onBack={() => nav('goals')} />
      case 'settings': return <SettingsScreen key="settings" />
      default: return <HomeScreen key="home" />
    }
  }

  return (
    <AppShell currentRoute={route} onNavigate={nav}>
      <AnimatePresence mode="wait">
        {screen()}
      </AnimatePresence>
    </AppShell>
  )
}
