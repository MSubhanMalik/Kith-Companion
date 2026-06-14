import type { RobotPartProps } from '../types'

export function RobotHead({ state: _state }: RobotPartProps) {
  return (
    <g>
      <rect x={40} y={65} width={120} height={80} rx={28} fill="#C8D2E0" />
      <rect x={40} y={65} width={120} height={80} rx={28} fill="none" stroke="#8A9AB0" strokeWidth={2} />

      <rect x={48} y={73} width={104} height={64} rx={22} fill="#D8E0EC" />

      <ellipse cx={100} cy={58} rx={18} ry={4} fill="#A0AABC" opacity={0.3} />
    </g>
  )
}
