import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import type { CatPartProps } from '../types'
import { eyeVariants } from '../behaviors/variants'

export function CatEyes({ state }: CatPartProps) {
  const blinkControls = useAnimationControls()

  const blink = useCallback(async () => {
    if (state !== 'idle') return
    await blinkControls.start({
      scaleY: [1, 0.05, 1],
      transition: { duration: 0.15, times: [0, 0.4, 1], ease: 'easeInOut' },
    })
  }, [state, blinkControls])

  useEffect(() => {
    if (state !== 'idle') return

    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 3000
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
      style={{ originX: '100px', originY: '105px' }}
    >
      <motion.g animate={eyeAnimate}>
        <ellipse cx={76} cy={105} rx={15} ry={17} fill="#FFFFFF" />
        <ellipse cx={76} cy={105} rx={15} ry={17} fill="none" stroke="#2C2417" strokeWidth={2} />

        <ellipse cx={124} cy={105} rx={15} ry={17} fill="#FFFFFF" />
        <ellipse cx={124} cy={105} rx={15} ry={17} fill="none" stroke="#2C2417" strokeWidth={2} />

        <ellipse cx={76} cy={105} rx={13} ry={15} fill="#FFFFFF" />
        <ellipse cx={124} cy={105} rx={13} ry={15} fill="#FFFFFF" />
      </motion.g>
    </motion.g>
  )
}
