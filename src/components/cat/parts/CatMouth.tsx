import { motion, AnimatePresence } from 'framer-motion'
import type { CatPartProps } from '../types'
import { mouthVariants } from '../behaviors/variants'

export function CatMouth({ state }: CatPartProps) {
  const isEating = state === 'eating'
  const isDisgusted = state === 'disgusted'
  const isNormal = !isEating && !isDisgusted

  return (
    <g>
      <AnimatePresence>
        {isEating && (
          <>
            <motion.path
              d="M 60 130 Q 55 180 100 195 Q 145 180 140 130 Z"
              fill="#2A0A0A"
              initial={{ d: 'M 90 140 Q 95 142 100 142 Q 105 142 110 140 Z' }}
              animate={{ d: 'M 60 130 Q 55 180 100 195 Q 145 180 140 130 Z' }}
              exit={{ d: 'M 90 140 Q 95 142 100 142 Q 105 142 110 140 Z' }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            />

            <motion.path
              d="M 65 133 Q 60 175 100 188 Q 140 175 135 133 Z"
              fill="#3D1515"
              initial={{ d: 'M 91 140 Q 95 141 100 141 Q 105 141 109 140 Z' }}
              animate={{ d: 'M 65 133 Q 60 175 100 188 Q 140 175 135 133 Z' }}
              exit={{ d: 'M 91 140 Q 95 141 100 141 Q 105 141 109 140 Z' }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            />

            <motion.ellipse
              cx={100} cy={175} rx={16} ry={8}
              fill="#D4735E"
              initial={{ opacity: 0, ry: 0 }}
              animate={{ opacity: 1, ry: 8 }}
              exit={{ opacity: 0, ry: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            />

            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.05, duration: 0.15 }}
            >
              <path d="M 72 132 L 76 142 L 80 132" fill="#FFFFFF" />
              <path d="M 86 130 L 89 139 L 92 130" fill="#FFFFFF" />
              <path d="M 108 130 L 111 139 L 114 130" fill="#FFFFFF" />
              <path d="M 120 132 L 124 142 L 128 132" fill="#FFFFFF" />
            </motion.g>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDisgusted && (
          <>
            <motion.path
              d="M 88 140 Q 92 136 96 140 Q 100 144 104 140 Q 108 136 112 140"
              fill="none"
              stroke="#6B5040"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ d: 'M 90 140 Q 100 146 110 140' }}
              animate={{ d: 'M 88 140 Q 92 136 96 140 Q 100 144 104 140 Q 108 136 112 140' }}
              exit={{ d: 'M 90 140 Q 100 146 110 140' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />

            <motion.g
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
            >
              <ellipse cx={108} cy={152} rx={7} ry={9} fill="#D4735E" />
              <ellipse cx={108} cy={150} rx={5} ry={6} fill="#E88A7A" />
            </motion.g>
          </>
        )}
      </AnimatePresence>

      {isNormal && (
        <>
          <line
            x1={100} y1={130} x2={100} y2={137}
            stroke="#6B5040"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <motion.path
            d="M 90 140 Q 100 146 110 140"
            fill="none"
            stroke="#6B5040"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={mouthVariants[state]}
          />
        </>
      )}
    </g>
  )
}
