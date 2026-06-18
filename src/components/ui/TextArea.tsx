interface TextAreaProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function TextArea({ placeholder, value, onChange }: TextAreaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus transition-colors duration-150 resize-none"
    />
  )
}
