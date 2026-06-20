interface SectionLabelProps {
  children: string
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`text-[0.625rem] text-text-muted tracking-widest uppercase ${className}`}>
      {children}
    </p>
  )
}
