import type { CatState } from '../cat/types'
import { motion } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import { useAnimationControls } from 'framer-motion'
import { bodyVariants, eyeVariants, pupilVariants, mouthVariants, armVariants, hairVariants } from './behaviors/variants'

interface AvatarProps {
  state: CatState
  size?: number
}

export function Avatar({ state, size = 90 }: AvatarProps) {
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
        <radialGradient id="skinGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E8C8A0" />
          <stop offset="100%" stopColor="#D4A878" />
        </radialGradient>
        <filter id="avatarShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={0} dy={2} stdDeviation={3} floodColor="#5A4030" floodOpacity={0.15} />
        </filter>
      </defs>

      <g filter="url(#avatarShadow)">
        <motion.g animate={bodyVariants[state]} style={{ originX: '100px', originY: '180px' }}>

          {/* Shirt / body */}
          <path d="M 60 185 Q 55 220 60 260 L 140 260 Q 145 220 140 185 Q 120 175 100 178 Q 80 175 60 185 Z" fill="#2C3340" />
          <path d="M 60 185 Q 55 220 60 260 L 140 260 Q 145 220 140 185 Q 120 175 100 178 Q 80 175 60 185 Z" fill="none" stroke="#1E2530" strokeWidth={1.5} />
          {/* Collar */}
          <path d="M 82 185 L 100 200 L 118 185" fill="none" stroke="#1E2530" strokeWidth={1.5} />
          {/* Buttons */}
          <circle cx={100} cy={210} r={2} fill="#1E2530" opacity={0.5} />
          <circle cx={100} cy={225} r={2} fill="#1E2530" opacity={0.5} />
          <circle cx={100} cy={240} r={2} fill="#1E2530" opacity={0.5} />

          {/* Arms */}
          <motion.g animate={armVariants[state]} style={{ originX: '55px', originY: '190px' }}>
            <path d="M 58 190 Q 38 200 32 218" fill="none" stroke="#2C3340" strokeWidth={12} strokeLinecap="round" />
            <circle cx={32} cy={220} r={7} fill="url(#skinGrad)" />
          </motion.g>
          <motion.g animate={armVariants[state]} style={{ originX: '145px', originY: '190px', scaleX: -1 }}>
            <path d="M 142 190 Q 162 200 168 218" fill="none" stroke="#2C3340" strokeWidth={12} strokeLinecap="round" />
            <circle cx={168} cy={220} r={7} fill="url(#skinGrad)" />
          </motion.g>

          {/* Head */}
          <ellipse cx={100} cy={115} rx={62} ry={58} fill="url(#skinGrad)" />

          {/* Hair - fluffy on top */}
          <motion.g animate={hairVariants[state]} style={{ originX: '100px', originY: '80px' }}>
            <path d="M 42 100 Q 38 70 55 50 Q 70 35 100 32 Q 130 35 145 50 Q 162 70 158 100 Q 150 85 130 78 Q 110 73 90 78 Q 70 85 55 95 Z" fill="#1A1A1A" />
            <path d="M 55 95 Q 50 80 60 65 Q 75 48 100 45 Q 125 48 140 65 Q 150 80 145 95" fill="#2A2A2A" />
            {/* Hair strands */}
            <path d="M 85 45 Q 82 35 88 30" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round" />
            <path d="M 105 43 Q 108 32 103 28" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round" />
            <path d="M 115 48 Q 120 38 116 33" fill="none" stroke="#1A1A1A" strokeWidth={1.5} strokeLinecap="round" />
          </motion.g>

          {/* Ears */}
          <ellipse cx={38} cy={115} rx={8} ry={12} fill="url(#skinGrad)" />
          <ellipse cx={162} cy={115} rx={8} ry={12} fill="url(#skinGrad)" />

          {/* Glasses */}
          <g>
            <rect x={58} y={100} width={32} height={26} rx={6} fill="none" stroke="#8B7355" strokeWidth={2} />
            <rect x={110} y={100} width={32} height={26} rx={6} fill="none" stroke="#8B7355" strokeWidth={2} />
            <line x1={90} y1={112} x2={110} y2={112} stroke="#8B7355" strokeWidth={2} />
            <line x1={58} y1={112} x2={46} y2={108} stroke="#8B7355" strokeWidth={1.5} />
            <line x1={142} y1={112} x2={154} y2={108} stroke="#8B7355" strokeWidth={1.5} />
            {/* Lens tint */}
            <rect x={60} y={102} width={28} height={22} rx={5} fill="#C8A870" opacity={0.12} />
            <rect x={112} y={102} width={28} height={22} rx={5} fill="#C8A870" opacity={0.12} />
          </g>

          {/* Eyes (inside glasses) */}
          <motion.g animate={blinkControls} style={{ originX: '100px', originY: '112px' }}>
            <motion.g animate={state === 'idle' ? undefined : eyeVariants[state]}>
              <ellipse cx={74} cy={112} rx={8} ry={9} fill="#FFFFFF" />
              <ellipse cx={126} cy={112} rx={8} ry={9} fill="#FFFFFF" />
            </motion.g>
          </motion.g>

          {/* Pupils */}
          <motion.g animate={pupilVariants[state]}>
            <circle cx={74} cy={113} r={5} fill="#1A1510" />
            <circle cx={126} cy={113} r={5} fill="#1A1510" />
            <circle cx={72} cy={110} r={2} fill="#FFFFFF" opacity={0.9} />
            <circle cx={124} cy={110} r={2} fill="#FFFFFF" opacity={0.9} />
          </motion.g>

          {/* Eyebrows */}
          <path d="M 60 96 Q 74 90 88 96" fill="none" stroke="#1A1A1A" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 112 96 Q 126 90 140 96" fill="none" stroke="#1A1A1A" strokeWidth={2.5} strokeLinecap="round" />

          {/* Nose */}
          <path d="M 100 125 Q 96 132 100 135 Q 104 132 100 125" fill="#C8A070" opacity={0.5} />

          {/* Beard */}
          <path d="M 72 142 Q 72 165 100 170 Q 128 165 128 142" fill="#1A1A1A" opacity={0.7} />
          <path d="M 75 142 Q 75 162 100 166 Q 125 162 125 142" fill="#2A2A2A" opacity={0.5} />

          {/* Mouth */}
          {isEating ? (
            <ellipse cx={100} cy={152} rx={12} ry={10} fill="#3D1515" />
          ) : (
            <motion.path
              d="M 88 148 Q 100 154 112 148"
              fill="none"
              stroke="#6B4030"
              strokeWidth={1.5}
              strokeLinecap="round"
              animate={mouthVariants[state]}
            />
          )}

          {/* Cheek blush */}
          <circle cx={55} cy={130} r={10} fill="#E8A090" opacity={0.2} />
          <circle cx={145} cy={130} r={10} fill="#E8A090" opacity={0.2} />
        </motion.g>
      </g>
    </svg>
  )
}
