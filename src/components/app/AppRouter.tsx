import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './AppShell'
import { WelcomeScreen } from '../onboarding/WelcomeScreen'
import { GoalsScreen } from '../onboarding/GoalsScreen'
import { LifeBlocksScreen } from '../onboarding/LifeBlocksScreen'
import { SchedulePreviewScreen } from '../onboarding/SchedulePreviewScreen'
import { HomeScreen } from '../home/HomeScreen'
import { EndOfDayScreen } from '../home/EndOfDayScreen'
import { WeekScreen } from '../week/WeekScreen'
import { DashboardScreen } from '../dashboard/DashboardScreen'
import { GoalDetailScreen } from '../goals/GoalDetailScreen'
import { GoalBoardScreen } from '../goals/GoalBoardScreen'
import { SettingsScreen } from '../settings/SettingsScreen'

type Step = 'welcome' | 'goals' | 'blocks' | 'preview'

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
    document.body.style.background = '#F5F0E8'

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
        {step === 'welcome' && <WelcomeScreen key="w" onNext={() => setStep('goals')} />}
        {step === 'goals' && <GoalsScreen key="g" onNext={() => setStep('blocks')} onBack={() => setStep('welcome')} />}
        {step === 'blocks' && <LifeBlocksScreen key="b" onNext={() => setStep('preview')} onBack={() => setStep('goals')} />}
        {step === 'preview' && <SchedulePreviewScreen key="p" onLockIn={() => { setOnboarded(true); nav('home') }} onBack={() => setStep('blocks')} />}
      </AnimatePresence>
    )
  }

  function screen() {
    switch (route) {
      case 'home': return <HomeScreen key="home" />
      case 'review': return <EndOfDayScreen key="review" />
      case 'week': return <WeekScreen key="week" />
      case 'progress': return <DashboardScreen key="progress" onGoalClick={() => nav('goal')} />
      case 'goal': return <GoalDetailScreen key="goal" onBack={() => nav('progress')} onNotesClick={() => nav('board')} />
      case 'board': return <GoalBoardScreen key="board" onBack={() => nav('goal')} />
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
