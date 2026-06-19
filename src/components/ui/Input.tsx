interface InputProps {
  label?: string
  hint?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function Input({ label, hint, placeholder, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold text-text-primary">{label}</label>}
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-transparent px-5 py-3.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus transition-colors duration-150"
      />
    </div>
  )
}
