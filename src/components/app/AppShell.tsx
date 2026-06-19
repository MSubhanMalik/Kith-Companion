import type { ReactNode } from 'react'
import { NavBar } from './NavBar'

interface AppShellProps {
  children: ReactNode
  currentRoute: string
  onNavigate: (route: string) => void
}

export function AppShell({ children, currentRoute, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      <div className="h-16 shrink-0" />
      <NavBar currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-8 py-6">
        {children}
      </main>
    </div>
  )
}
