import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import type { CatPartProps } from '../types'
import { whiskerVariants } from '../behaviors/variants'

export function CatWhiskers({ state }: CatPartProps) {
  const twitchControls = useAnimationControls()

  const twitch = useCallback(async () => {
    if (state !== 'idle') return
    await twitchControls.start({
      rotate: [0, 3, -2, 0],
      transition: { duration: 0.2, ease: 'easeInOut' },
    })
  }, [state, twitchControls])

  useEffect(() => {
    if (state !== 'idle') return

    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 6000
      return setTimeout(() => {
        twitch()
        timerId = scheduleNext()
      }, delay)
    }

    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [state, twitch])

  const whiskerAnimate = state === 'idle' ? undefined : whiskerVariants[state]

  return (
    <motion.g animate={twitchControls}>
      <motion.g animate={whiskerAnimate}>
        <g style={{ transformOrigin: '70px 130px' }}>
          <line x1={66} y1={124} x2={25} y2={116} stroke="#A68B6B" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
          <line x1={66} y1={130} x2={22} y2={129} stroke="#A68B6B" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
          <line x1={66} y1={136} x2={25} y2={143} stroke="#A68B6B" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
        </g>

        <g style={{ transformOrigin: '130px 130px' }}>
          <line x1={134} y1={124} x2={175} y2={116} stroke="#A68B6B" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
          <line x1={134} y1={130} x2={178} y2={129} stroke="#A68B6B" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
          <line x1={134} y1={136} x2={175} y2={143} stroke="#A68B6B" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
        </g>
      </motion.g>
    </motion.g>
  )
}
