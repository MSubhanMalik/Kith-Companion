import type { CatState } from '../cat/types'
import { RobotAntenna } from './parts/RobotAntenna'
import { RobotHead } from './parts/RobotHead'
import { RobotEyes } from './parts/RobotEyes'
import { RobotPupils } from './parts/RobotPupils'
import { RobotMouth } from './parts/RobotMouth'
import { RobotBody } from './parts/RobotBody'
import { RobotArms } from './parts/RobotArms'
import { RobotFeet } from './parts/RobotFeet'

interface RobotProps {
  state: CatState
  size?: number
}

export function Robot({ state, size = 90 }: RobotProps) {
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="robotGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={0} dy={2} stdDeviation={3} floodColor="#6080A0" floodOpacity={0.15} />
        </filter>
      </defs>

      <g filter="url(#robotGlow)">
        <RobotFeet state={state} />
        <RobotBody state={state} />
        <RobotArms state={state} />
        <RobotAntenna state={state} />
        <RobotHead state={state} />
        <RobotEyes state={state} />
        <RobotPupils state={state} />
        <RobotMouth state={state} />
      </g>
    </svg>
  )
}
