import type { CatState } from '../cat/types'
import { motion } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import { useAnimationControls } from 'framer-motion'
import { bodyVariants, eyeVariants, pupilVariants, mouthVariants, armVariants, hairVariants } from './behaviors/variants'

interface BossProps {
  state: CatState
  size?: number
}

export function Boss({ state, size = 90 }: BossProps) {
  const blinkControls = useAnimationControls()

  const blink = useCallback(async () => {
    if (state !== 'idle') return
    await blinkControls.start({
      scaleY: [1, 0.05, 1],
      transition: { duration: 0.15, times: [0, 0.4, 1], ease: 'easeInOut' },
    })
  }, [state, blinkControls])

  useEffect(() => {
    if (state !== 'idle') return
    const scheduleNext = () => {
      const delay = 2500 + Math.random() * 3500
      return setTimeout(() => { blink(); timerId = scheduleNext() }, delay)
    }
    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [state, blink])

  const isEating = state === 'eating'

  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bossSkinGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E0BF98" />
          <stop offset="100%" stopColor="#CCA070" />
        </radialGradient>
        <filter id="bossShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={0} dy={2} stdDeviation={3} floodColor="#5A4030" floodOpacity={0.15} />
        </filter>
      </defs>

      <g filter="url(#bossShadow)">
        <motion.g animate={bodyVariants[state]} style={{ originX: '100px', originY: '180px' }}>

          {/* Navy shawl/jacket - draped over right shoulder */}
          <path d="M 55 182 Q 48 220 52 260 L 148 260 Q 152 220 148 182 Q 125 172 100 175 Q 75 172 55 182 Z" fill="#6B2040" />
          <path d="M 55 182 Q 48 220 52 260 L 148 260 Q 152 220 148 182 Q 125 172 100 175 Q 75 172 55 182 Z" fill="none" stroke="#551835" strokeWidth={1.5} />

          {/* Maroon shirt underneath */}
          <path d="M 62 185 Q 58 218 60 258 L 140 258 Q 142 218 138 185 Q 120 178 100 180 Q 80 178 62 185 Z" fill="#7A3050" />

          {/* Shawl overlay on right side */}
          <path d="M 110 182 Q 135 178 148 182 Q 152 220 148 260 L 125 260 Q 128 225 125 190 Z" fill="#2A3545" />
          <path d="M 110 182 Q 135 178 148 182 Q 152 220 148 260 L 125 260 Q 128 225 125 190 Z" fill="none" stroke="#1E2835" strokeWidth={1} opacity={0.5} />

          {/* Collar */}
          <path d="M 80 185 L 100 198 L 120 185" fill="none" stroke="#551835" strokeWidth={1.5} />

          {/* Buttons */}
          <circle cx={100} cy={208} r={2.5} fill="#551835" opacity={0.6} />
          <circle cx={100} cy={222} r={2.5} fill="#551835" opacity={0.6} />
          <circle cx={100} cy={236} r={2.5} fill="#551835" opacity={0.6} />

          {/* Arms */}
          <motion.g animate={armVariants[state]} style={{ originX: '55px', originY: '190px' }}>
            <path d="M 55 190 Q 35 200 30 218" fill="none" stroke="#2A3545" strokeWidth={12} strokeLinecap="round" />
            <circle cx={30} cy={220} r={7} fill="url(#bossSkinGrad)" />
          </motion.g>
          <motion.g animate={armVariants[state]} style={{ originX: '145px', originY: '190px', scaleX: -1 }}>
            <path d="M 145 190 Q 165 200 170 218" fill="none" stroke="#6B2040" strokeWidth={12} strokeLinecap="round" />
            <circle cx={170} cy={220} r={7} fill="url(#bossSkinGrad)" />
          </motion.g>

          {/* Head - slightly rounder */}
          <ellipse cx={100} cy={115} rx={64} ry={60} fill="url(#bossSkinGrad)" />

          {/* Hair - short, neat, no strands */}
          <motion.g animate={hairVariants[state]} style={{ originX: '100px', originY: '80px' }}>
            <path d="M 40 105 Q 36 75 52 55 Q 68 38 100 35 Q 132 38 148 55 Q 164 75 160 105 Q 155 90 140 82 Q 120 75 100 74 Q 80 75 60 82 Q 45 90 40 105 Z" fill="#1A1A1A" />
            <path d="M 48 100 Q 45 80 58 62 Q 72 48 100 46 Q 128 48 142 62 Q 155 80 152 100 Q 148 88 135 82 Q 118 76 100 76 Q 82 76 65 82 Q 52 88 48 100 Z" fill="#252525" />
          </motion.g>

          {/* Ears */}
          <ellipse cx={36} cy={118} rx={8} ry={12} fill="url(#bossSkinGrad)" />
          <ellipse cx={164} cy={118} rx={8} ry={12} fill="url(#bossSkinGrad)" />

          {/* Glasses - rectangular, dark thick frames */}
          <g>
            <rect x={55} y={100} width={35} height={28} rx={4} fill="none" stroke="#1A1A1A" strokeWidth={3} />
            <rect x={110} y={100} width={35} height={28} rx={4} fill="none" stroke="#1A1A1A" strokeWidth={3} />
            <line x1={90} y1={114} x2={110} y2={114} stroke="#1A1A1A" strokeWidth={2.5} />
            <line x1={55} y1={114} x2={44} y2={110} stroke="#1A1A1A" strokeWidth={2} />
            <line x1={145} y1={114} x2={156} y2={110} stroke="#1A1A1A" strokeWidth={2} />
            {/* Blue lens tint */}
            <rect x={57} y={102} width={31} height={24} rx={3} fill="#4488CC" opacity={0.08} />
            <rect x={112} y={102} width={31} height={24} rx={3} fill="#4488CC" opacity={0.08} />
          </g>

          {/* Eyes (inside glasses) */}
          <motion.g animate={blinkControls} style={{ originX: '100px', originY: '114px' }}>
            <motion.g animate={state === 'idle' ? undefined : eyeVariants[state]}>
              <ellipse cx={72} cy={114} rx={8} ry={9} fill="#FFFFFF" />
              <ellipse cx={128} cy={114} rx={8} ry={9} fill="#FFFFFF" />
            </motion.g>
          </motion.g>

          {/* Pupils */}
          <motion.g animate={pupilVariants[state]}>
            <circle cx={72} cy={115} r={5} fill="#1A1510" />
            <circle cx={128} cy={115} r={5} fill="#1A1510" />
            <circle cx={70} cy={112} r={2} fill="#FFFFFF" opacity={0.9} />
            <circle cx={126} cy={112} r={2} fill="#FFFFFF" opacity={0.9} />
          </motion.g>

          {/* Eyebrows - neat, straighter */}
          <path d="M 58 96 Q 72 92 88 96" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round" />
          <path d="M 112 96 Q 128 92 142 96" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round" />

          {/* Nose */}
          <path d="M 100 128 Q 96 134 100 137 Q 104 134 100 128" fill="#C09868" opacity={0.5} />

          {/* Light stubble beard - jaw and chin area */}
          <path d="M 65 138 Q 62 152 72 162 Q 85 170 100 172 Q 115 170 128 162 Q 138 152 135 138" fill="#3A3A3A" opacity={0.25} />
          <path d="M 68 140 Q 66 150 74 159 Q 87 167 100 168 Q 113 167 126 159 Q 134 150 132 140" fill="#3A3A3A" opacity={0.15} />
          {/* Chin patch slightly darker */}
          <ellipse cx={100} cy={165} rx={15} ry={8} fill="#2A2A2A" opacity={0.15} />

          {/* Mouth - closed, warm smile */}
          {isEating ? (
            <ellipse cx={100} cy={150} rx={12} ry={10} fill="#3D1515" />
          ) : (
            <motion.path
              d="M 85 148 Q 92 155 100 155 Q 108 155 115 148"
              fill="none"
              stroke="#8B5A40"
              strokeWidth={2}
              strokeLinecap="round"
              animate={mouthVariants[state]}
            />
          )}

          {/* Smile dimples */}
          <path d="M 82 150 Q 83 153 85 150" fill="none" stroke="#C09868" strokeWidth={0.8} opacity={0.3} />
          <path d="M 115 150 Q 117 153 118 150" fill="none" stroke="#C09868" strokeWidth={0.8} opacity={0.3} />

          {/* Cheek blush */}
          <circle cx={53} cy={132} r={10} fill="#E0A088" opacity={0.15} />
          <circle cx={147} cy={132} r={10} fill="#E0A088" opacity={0.15} />
        </motion.g>
      </g>
    </svg>
  )
}
