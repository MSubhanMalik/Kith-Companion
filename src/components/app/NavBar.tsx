interface NavBarProps {
  currentRoute: string
  onNavigate: (route: string) => void
}

const NAV_ITEMS = [
  { route: 'today', label: 'Today' },
  { route: 'roadmap', label: 'Roadmap' },
  { route: 'brain', label: 'Brain' },
  { route: 'settings', label: 'Settings' },
]

export function NavBar({ currentRoute, onNavigate }: NavBarProps) {
  return (
    <nav className="flex items-center justify-center gap-1 px-8 py-2.5 border-b border-border">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.route}
          onClick={() => onNavigate(item.route)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${
            currentRoute === item.route
              ? 'bg-olive/10 text-olive'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
