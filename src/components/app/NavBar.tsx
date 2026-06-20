interface NavBarProps {
  currentRoute: string
  onNavigate: (route: string) => void
}

const NAV = [
  { route: 'home', label: 'Today' },
  { route: 'week', label: 'Week' },
  { route: 'goals', label: 'Goals' },
  { route: 'settings', label: 'Settings' },
]

export function NavBar({ currentRoute, onNavigate }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-page/80 backdrop-blur-sm flex items-end justify-center gap-1 z-50 pb-2 pt-24">
      {NAV.map(({ route, label }) => (
        <button
          key={route}
          onClick={() => onNavigate(route)}
          className={`px-4 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
            currentRoute === route || (route === 'goals' && currentRoute === 'goal')
              ? 'text-text-primary font-semibold'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
