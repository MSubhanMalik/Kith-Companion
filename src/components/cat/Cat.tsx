import type { CatProps } from './types'
import { CatTail } from './parts/CatTail'
import { CatBody } from './parts/CatBody'
import { CatPaws } from './parts/CatPaws'
import { CatHead } from './parts/CatHead'
import { CatEars } from './parts/CatEars'
import { CatEyes } from './parts/CatEyes'
import { CatPupils } from './parts/CatPupils'
import { CatNose } from './parts/CatNose'
import { CatMouth } from './parts/CatMouth'
import { CatWhiskers } from './parts/CatWhiskers'
import { CatCheeks } from './parts/CatCheeks'

export function Cat({ state, size = 90 }: CatProps) {
  return (
    <svg
      viewBox="-10 0 220 280"
      width={size}
      height={size * 1.27}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#D4BA96" />
          <stop offset="100%" stopColor="#B89B72" />
        </radialGradient>
        <radialGradient id="headGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#D4BA96" />
          <stop offset="100%" stopColor="#B89B72" />
        </radialGradient>
        <radialGradient id="bellyGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#E8DBC8" />
          <stop offset="100%" stopColor="#D4C4A8" />
        </radialGradient>
        <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0A8A0" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#F0A8A0" stopOpacity={0} />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={0} dy={2} stdDeviation={3} floodColor="#8B7355" floodOpacity={0.15} />
        </filter>
      </defs>

      <g filter="url(#softShadow)">
        <CatTail state={state} />
        <CatBody state={state} />
        <CatPaws state={state} />
        <CatEars state={state} />
        <CatHead state={state} />
        <CatCheeks state={state} />
        <CatEyes state={state} />
        <CatPupils state={state} />
        <CatNose state={state} />
        <CatMouth state={state} />
        <CatWhiskers state={state} />
      </g>
    </svg>
  )
}
