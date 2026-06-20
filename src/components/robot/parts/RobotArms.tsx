import { motion } from 'framer-motion'
import type { RobotPartProps } from '../types'
import { armVariants } from '../behaviors/variants'

export function RobotArms({ state }: RobotPartProps) {
  return (
    <>
      <motion.g
        animate={armVariants[state]}
        style={{ originX: '48px', originY: '150px' }}
      >
        <path
          d="M 48 150 Q 30 155 25 170 Q 22 178 28 182"
          fill="none"
          stroke="#8A9AB0"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={28} cy={182} r={6} fill="#C8D2E0" stroke="#8A9AB0" strokeWidth={1.5} />
      </motion.g>

      <motion.g
        animate={armVariants[state]}
        style={{ originX: '152px', originY: '150px', scaleX: -1 }}
      >
        <path
          d="M 152 150 Q 170 155 175 170 Q 178 178 172 182"
          fill="none"
          stroke="#8A9AB0"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={172} cy={182} r={6} fill="#C8D2E0" stroke="#8A9AB0" strokeWidth={1.5} />
      </motion.g>
    </>
  )
}
