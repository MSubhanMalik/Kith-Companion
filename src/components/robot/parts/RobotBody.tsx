import { motion } from 'framer-motion'
import type { RobotPartProps } from '../types'
import { bodyVariants } from '../behaviors/variants'

export function RobotBody({ state }: RobotPartProps) {
  return (
    <motion.g
      animate={bodyVariants[state]}
      style={{ originX: '100px', originY: '160px' }}
    >
      <ellipse cx={100} cy={160} rx={55} ry={52} fill="#B8C4D4" />
      <ellipse cx={100} cy={160} rx={55} ry={52} fill="none" stroke="#8A9AB0" strokeWidth={2} />

      <ellipse cx={100} cy={165} rx={38} ry={32} fill="#D0D8E4" />

      <rect x={82} y={185} width={36} height={8} rx={4} fill="#8A9AB0" opacity={0.4} />

      <circle cx={88} cy={189} r={2} fill="#6EC4A0" opacity={0.6} />
      <circle cx={96} cy={189} r={2} fill="#6EC4A0" opacity={0.6} />
      <circle cx={104} cy={189} r={2} fill="#5BA3D9" opacity={0.6} />
      <circle cx={112} cy={189} r={2} fill="#5BA3D9" opacity={0.6} />
    </motion.g>
  )
}
