import { motion } from 'framer-motion'
import type { CatPartProps } from '../types'
import { pawVariants } from '../behaviors/variants'

export function CatPaws({ state }: CatPartProps) {
  return (
    <motion.g animate={pawVariants[state]}>
      <ellipse cx={72} cy={254} rx={17} ry={11} fill="#D4C4A8" stroke="#B89B72" strokeWidth={1} />
      <ellipse cx={128} cy={254} rx={17} ry={11} fill="#D4C4A8" stroke="#B89B72" strokeWidth={1} />

      <g>
        <ellipse cx={64} cy={251} rx={3.5} ry={3} fill="#E8B4A0" opacity={0.6} />
        <ellipse cx={72} cy={248} rx={3.5} ry={3} fill="#E8B4A0" opacity={0.6} />
        <ellipse cx={80} cy={251} rx={3.5} ry={3} fill="#E8B4A0" opacity={0.6} />
        <ellipse cx={72} cy={256} rx={5} ry={4} fill="#E8B4A0" opacity={0.5} />
      </g>

      <g>
        <ellipse cx={120} cy={251} rx={3.5} ry={3} fill="#E8B4A0" opacity={0.6} />
        <ellipse cx={128} cy={248} rx={3.5} ry={3} fill="#E8B4A0" opacity={0.6} />
        <ellipse cx={136} cy={251} rx={3.5} ry={3} fill="#E8B4A0" opacity={0.6} />
        <ellipse cx={128} cy={256} rx={5} ry={4} fill="#E8B4A0" opacity={0.5} />
      </g>
    </motion.g>
  )
}
