import { motion, AnimatePresence } from 'framer-motion'
import type { RobotPartProps } from '../types'

export function RobotMouth({ state }: RobotPartProps) {
  const isHappy = state === 'happy' || state === 'nudge'
  const isError = state === 'disgusted'
  const isSleeping = state === 'sleeping'
  const isEating = state === 'eating'
  const isHungry = state === 'hungry'

  if (isSleeping) return null

  return (
    <g>
      <AnimatePresence>
        {isEating && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{ originX: '100px', originY: '122px' }}
          >
            <rect x={85} y={118} width={30} height={18} rx={4} fill="#2A2A3A" />
            <rect x={88} y={120} width={24} height={14} rx={3} fill="#3D3D50" />
          </motion.g>
        )}
      </AnimatePresence>

      {isHappy && (
        <path d="M 86 120 Q 100 132 114 120" fill="none" stroke="#5BA3D9" strokeWidth={2.5} strokeLinecap="round" />
      )}
      {isError && (
        <path d="M 86 126 Q 100 118 114 126" fill="none" stroke="#E07070" strokeWidth={2.5} strokeLinecap="round" />
      )}
      {isHungry && (
        <motion.path
          d="M 86 120 Q 100 130 114 120"
          fill="none"
          stroke="#5BA3D9"
          strokeWidth={2.5}
          strokeLinecap="round"
          animate={{ d: ['M 86 120 Q 100 130 114 120', 'M 86 119 Q 100 133 114 119', 'M 86 120 Q 100 130 114 120'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {!isHappy && !isError && !isEating && !isHungry && (
        <line x1={88} y1={122} x2={112} y2={122} stroke="#8A9AB0" strokeWidth={2} strokeLinecap="round" />
      )}
    </g>
  )
}
