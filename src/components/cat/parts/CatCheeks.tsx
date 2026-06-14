import type { CatPartProps } from '../types'

export function CatCheeks({ state: _state }: CatPartProps) {
  return (
    <>
      <circle cx={56} cy={124} r={12} fill="url(#cheekGlow)" />
      <circle cx={144} cy={124} r={12} fill="url(#cheekGlow)" />
    </>
  )
}
