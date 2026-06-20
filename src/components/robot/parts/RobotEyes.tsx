import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import type { RobotPartProps } from '../types'
import { eyeVariants } from '../behaviors/variants'

export function RobotEyes({ state }: RobotPartProps) {
  const blinkControls = useAnimationControls()

  const blink = useCallback(async () => {
    if (state !== 'idle') return
    await blinkControls.start({
      scaleY: [1, 0.05, 1],
      transition: { duration: 0.12, times: [0, 0.4, 1], ease: 'easeInOut' },
    })
  }, [state, blinkControls])

  useEffect(() => {
    if (state !== 'idle') return
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 4000
      return setTimeout(() => {
        blink()
        timerId = scheduleNext()
      }, delay)
    }
    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [state, blink])

  const eyeAnimate = state === 'idle' ? undefined : eyeVariants[state]

  return (
    <motion.g
      animate={blinkControls}
      style={{ originX: '100px', originY: '100px' }}
    >
      <motion.g animate={eyeAnimate}>
        <ellipse cx={78} cy={100} rx={16} ry={18} fill="#FFFFFF" />
        <ellipse cx={78} cy={100} rx={16} ry={18} fill="none" stroke="#8A9AB0" strokeWidth={1.5} />

        <ellipse cx={122} cy={100} rx={16} ry={18} fill="#FFFFFF" />
        <ellipse cx={122} cy={100} rx={16} ry={18} fill="none" stroke="#8A9AB0" strokeWidth={1.5} />
      </motion.g>
    </motion.g>
  )
}
