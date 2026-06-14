import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import type { CatPartProps } from '../types'
import { earVariants } from '../behaviors/variants'

export function CatEars({ state }: CatPartProps) {
  const leftControls = useAnimationControls()
  const rightControls = useAnimationControls()

  const twitch = useCallback(() => {
    if (state !== 'idle') return

    const isLeft = Math.random() > 0.5
    const controls = isLeft ? leftControls : rightControls
    controls.start({
      rotate: [0, -12, 0],
      transition: { duration: 0.2, ease: 'easeInOut' },
    })
  }, [state, leftControls, rightControls])

  useEffect(() => {
    if (state !== 'idle') return

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 6000
      return setTimeout(() => {
        twitch()
        timerId = scheduleNext()
      }, delay)
    }

    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [state, twitch])

  return (
    <>
      <motion.g
        animate={state === 'idle' ? undefined : earVariants[state]}
        style={{ originX: '68px', originY: '78px' }}
      >
        <motion.g
          animate={leftControls}
          style={{ originX: '68px', originY: '78px' }}
        >
          <path
            d="M 42 78 L 55 28 L 78 72 Z"
            fill="url(#headGrad)"
            stroke="#A68B6B"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d="M 50 72 L 57 36 L 72 68 Z"
            fill="#E8B4A0"
            opacity={0.7}
          />
          <path
            d="M 56 55 L 58 42"
            stroke="#D4A090"
            strokeWidth={0.6}
            fill="none"
            opacity={0.4}
          />
        </motion.g>
      </motion.g>

      <motion.g
        animate={state === 'idle' ? undefined : earVariants[state]}
        style={{ originX: '132px', originY: '78px' }}
      >
        <motion.g
          animate={rightControls}
          style={{ originX: '132px', originY: '78px' }}
        >
          <path
            d="M 158 78 L 145 28 L 122 72 Z"
            fill="url(#headGrad)"
            stroke="#A68B6B"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d="M 150 72 L 143 36 L 128 68 Z"
            fill="#E8B4A0"
            opacity={0.7}
          />
          <path
            d="M 144 55 L 142 42"
            stroke="#D4A090"
            strokeWidth={0.6}
            fill="none"
            opacity={0.4}
          />
        </motion.g>
      </motion.g>
    </>
  )
}
