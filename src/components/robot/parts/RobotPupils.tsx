import { motion } from 'framer-motion'
import type { RobotPartProps } from '../types'
import { pupilVariants } from '../behaviors/variants'

export function RobotPupils({ state }: RobotPartProps) {
  return (
    <motion.g animate={pupilVariants[state]}>
      <circle cx={78} cy={102} r={8} fill="#3D5A80" />
      <circle cx={122} cy={102} r={8} fill="#3D5A80" />

      <circle cx={75} cy={98} r={3} fill="#FFFFFF" opacity={0.9} />
      <circle cx={119} cy={98} r={3} fill="#FFFFFF" opacity={0.9} />

      <circle cx={80} cy={104} r={1.5} fill="#FFFFFF" opacity={0.5} />
      <circle cx={124} cy={104} r={1.5} fill="#FFFFFF" opacity={0.5} />
    </motion.g>
  )
}
