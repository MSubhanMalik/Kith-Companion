const colorMap = {
  green: 'bg-connection/10 text-connection',
  olive: 'bg-olive/10 text-olive',
  purple: 'bg-hook/10 text-hook',
  coral: 'bg-direction/10 text-direction',
  blue: 'bg-fetch/10 text-fetch',
}

interface BadgeProps {
  label: string
  color: keyof typeof colorMap
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium ${colorMap[color]}`}>
      {label}
    </span>
  )
}
