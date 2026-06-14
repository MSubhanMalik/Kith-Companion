import type { CatPartProps } from '../types'

export function CatNose({ state: _state }: CatPartProps) {
  return (
    <g>
      <path
        d="M 96 125 Q 100 132 104 125 Q 100 128 96 125 Z"
        fill="#D4735E"
      />
      <ellipse cx={100} cy={126} rx={4.5} ry={3.5} fill="#D4735E" />
      <ellipse cx={100} cy={125.5} rx={3} ry={1.5} fill="#E88070" opacity={0.5} />
    </g>
  )
}
