import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './AppShell'
import { HomeScreen } from '../home/HomeScreen'
import { EndOfDayScreen } from '../home/EndOfDayScreen'
import { WeekScreen } from '../week/WeekScreen'
import { GoalsListScreen } from '../goals/GoalsListScreen'
import { GoalScreen } from '../goals/GoalScreen'
import { ProfileScreen } from '../profile/ProfileScreen'

function getRoute(): string {
  return window.location.hash.replace('#app/', '').replace('#app', '') || 'home'
}

export function AppRouter() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function nav(r: string) {
    window.location.hash = `#app/${r}`
    setRoute(r)
  }

  function screen() {
    switch (route) {
      case 'home': return <HomeScreen key="home" />
      case 'review': return <EndOfDayScreen key="review" />
      case 'week': return <WeekScreen key="week" />
      case 'goals': return <GoalsListScreen key="goals" onGoalClick={() => nav('goal')} />
      case 'goal': return <GoalScreen key="goal" onBack={() => nav('goals')} />
      case 'profile': return <ProfileScreen key="profile" />
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
