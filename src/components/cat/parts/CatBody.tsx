import { motion } from 'framer-motion'
import type { CatPartProps } from '../types'
import { bodyVariants } from '../behaviors/variants'

export function CatBody({ state }: CatPartProps) {
  return (
    <motion.g
      animate={bodyVariants[state]}
      style={{ originX: '100px', originY: '240px' }}
    >
      <ellipse cx={100} cy={210} rx={52} ry={58} fill="url(#bodyGrad)" />
      <ellipse cx={100} cy={215} rx={36} ry={40} fill="url(#bellyGrad)" />

      <path d="M 65 190 Q 68 195 66 200" stroke="#B89B72" strokeWidth={0.8} fill="none" opacity={0.4} />
      <path d="M 130 188 Q 133 193 131 198" stroke="#B89B72" strokeWidth={0.8} fill="none" opacity={0.4} />
      <path d="M 70 205 Q 73 210 71 215" stroke="#B89B72" strokeWidth={0.8} fill="none" opacity={0.3} />
      <path d="M 128 203 Q 131 208 129 213" stroke="#B89B72" strokeWidth={0.8} fill="none" opacity={0.3} />
    </motion.g>
  )
}
