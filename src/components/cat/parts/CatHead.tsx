import type { CatPartProps } from '../types'

export function CatHead({ state: _state }: CatPartProps) {
  return (
    <>
      <ellipse cx={100} cy={110} rx={66} ry={60} fill="url(#headGrad)" />
      <ellipse cx={100} cy={126} rx={46} ry={30} fill="url(#bellyGrad)" />

      <path d="M 48 95 Q 50 100 48 105" stroke="#B89B72" strokeWidth={0.7} fill="none" opacity={0.3} />
      <path d="M 152 95 Q 150 100 152 105" stroke="#B89B72" strokeWidth={0.7} fill="none" opacity={0.3} />
      <path d="M 55 115 Q 57 118 55 121" stroke="#B89B72" strokeWidth={0.6} fill="none" opacity={0.25} />
      <path d="M 145 115 Q 143 118 145 121" stroke="#B89B72" strokeWidth={0.6} fill="none" opacity={0.25} />
    </>
  )
}
