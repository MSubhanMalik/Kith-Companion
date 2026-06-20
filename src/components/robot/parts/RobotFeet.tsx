import type { RobotPartProps } from '../types'

export function RobotFeet({ state: _state }: RobotPartProps) {
  return (
    <g>
      <ellipse cx={78} cy={218} rx={18} ry={8} fill="#8A9AB0" />
      <ellipse cx={78} cy={216} rx={16} ry={6} fill="#A0AABC" />

      <ellipse cx={122} cy={218} rx={18} ry={8} fill="#8A9AB0" />
      <ellipse cx={122} cy={216} rx={16} ry={6} fill="#A0AABC" />
    </g>
  )
}
