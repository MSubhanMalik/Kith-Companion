import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import type { CatPartProps } from '../types'
import { pupilVariants } from '../behaviors/variants'

export function CatPupils({ state }: CatPartProps) {
  const driftControls = useAnimationControls()

  const drift = useCallback(async () => {
    if (state !== 'idle') return

    const dx = (Math.random() - 0.5) * 8
    const dy = (Math.random() - 0.5) * 4

    await driftControls.start({
      x: dx,
      y: dy,
      transition: { duration: 0.8, ease: 'easeInOut' },
    })

    const holdTime = 2000 + Math.random() * 1000
    await new Promise((r) => setTimeout(r, holdTime))

    await driftControls.start({
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    })
  }, [state, driftControls])

  useEffect(() => {
    if (state !== 'idle') return

    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 5000
      return setTimeout(() => {
        drift()
        timerId = scheduleNext()
      }, delay)
    }

    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [state, drift])

  return (
    <motion.g
      animate={state === 'idle' ? driftControls : pupilVariants[state]}
    >
      <circle cx={76} cy={107} r={8} fill="#1A1510" />
      <circle cx={124} cy={107} r={8} fill="#1A1510" />

      <circle cx={73} cy={102} r={3} fill="#FFFFFF" opacity={0.95} />
      <circle cx={121} cy={102} r={3} fill="#FFFFFF" opacity={0.95} />

      <circle cx={78} cy={109} r={1.5} fill="#FFFFFF" opacity={0.5} />
      <circle cx={126} cy={109} r={1.5} fill="#FFFFFF" opacity={0.5} />
    </motion.g>
  )
}
