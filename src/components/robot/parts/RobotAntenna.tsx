import { motion } from 'framer-motion'
import type { RobotPartProps } from '../types'
import { antennaVariants, lightVariants } from '../behaviors/variants'

export function RobotAntenna({ state }: RobotPartProps) {
  return (
    <motion.g
      animate={antennaVariants[state]}
      style={{ originX: '100px', originY: '65px' }}
    >
      <line x1={100} y1={65} x2={100} y2={35} stroke="#8A9AB0" strokeWidth={3} strokeLinecap="round" />

      <motion.circle
        cx={100}
        cy={30}
        r={7}
        fill="#5BA3D9"
        animate={lightVariants[state]}
      />
      <circle cx={100} cy={30} r={7} fill="none" stroke="#4A8FC4" strokeWidth={1.5} />

      <circle cx={98} cy={28} r={2} fill="#FFFFFF" opacity={0.6} />
    </motion.g>
  )
}
