import { motion } from 'framer-motion'
import type { CatPartProps } from '../types'
import { tailVariants } from '../behaviors/variants'

export function CatTail({ state }: CatPartProps) {
  return (
    <motion.g
      animate={tailVariants[state]}
      style={{ originX: '130px', originY: '230px' }}
    >
      <path
        d="M 130 230 Q 140 210 135 185 Q 130 165 120 150"
        fill="none"
        stroke="#B89B72"
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d="M 130 230 Q 140 210 135 185 Q 130 165 120 150"
        fill="none"
        stroke="#C4A882"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <circle cx={120} cy={150} r={5} fill="#C4A882" />
    </motion.g>
  )
}
