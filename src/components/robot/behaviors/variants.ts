import type { Transition, TargetAndTransition } from 'framer-motion'
import type { CatState } from '../../cat/types'

type StateVariants = Record<CatState, TargetAndTransition>

const springGentle: Transition = { type: 'spring', stiffness: 120, damping: 14 }
const springSnappy: Transition = { type: 'spring', stiffness: 300, damping: 20 }
const springBouncy: Transition = { type: 'spring', stiffness: 400, damping: 12 }

export const bodyVariants: StateVariants = {
  idle: { y: [0, -3, 0], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { y: [0, 2, 0], rotate: 5, transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
  alert: { y: -6, scale: 1.05, transition: springSnappy },
  thinking: { rotate: [0, -3, 3, -2, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  happy: { y: [0, -8, 0], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
  nudge: { y: -4, transition: springBouncy },
  delivering: { y: -3, transition: springGentle },
  listening: { y: [0, -2, 0], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
  eating: { scaleY: [1, 1.1, 0.95, 1], transition: { duration: 0.5, ease: 'easeOut' } },
  disgusted: { x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  hungry: { y: [0, -6, 0], scaleY: [1, 0.92, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
}

export const eyeVariants: StateVariants = {
  idle: { scaleY: 1, transition: springGentle },
  sleeping: { scaleY: 0.1, transition: { duration: 0.3 } },
  alert: { scaleY: 1.2, scaleX: 1.2, transition: springSnappy },
  thinking: { scaleY: 0.7, transition: springGentle },
  happy: { scaleY: 0.4, scaleX: 1.3, transition: springGentle },
  nudge: { scaleY: 1.1, transition: springGentle },
  delivering: { scaleY: 0.8, transition: springGentle },
  listening: { scaleY: 1.1, transition: springGentle },
  eating: { scaleY: 0.15, transition: { duration: 0.15 } },
  disgusted: { scaleY: [1, 0.4, 0.5], scaleX: [1, 1.3, 1.2], transition: { duration: 0.4 } },
  hungry: { scaleY: [1.2, 1.35, 1.2], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
}

export const pupilVariants: StateVariants = {
  idle: { x: [0, 2, 0, -2, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { scale: 0, transition: { duration: 0.2 } },
  alert: { scale: 1.4, transition: springSnappy },
  thinking: { x: [0, 4, -4, 0], y: [0, -2, 2, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  happy: { scale: 0.8, y: -1, transition: springGentle },
  nudge: { scale: 1.1, transition: springGentle },
  delivering: { scale: 1, transition: springGentle },
  listening: { scale: 1.1, x: 3, transition: springGentle },
  eating: { scale: 0.5, transition: { duration: 0.15 } },
  disgusted: { scale: [1, 0.3, 0.5], x: [0, 5, 3], transition: { duration: 0.3 } },
  hungry: { scale: [1.5, 1.8, 1.5], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
}

export const antennaVariants: StateVariants = {
  idle: { rotate: [0, 5, 0, -5, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { rotate: 15, transition: springGentle },
  alert: { rotate: [0, -10, 0], transition: { duration: 0.3, repeat: 2, ease: 'easeOut' } },
  thinking: { rotate: [0, 8, -8, 0], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
  happy: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
  nudge: { rotate: -10, transition: springBouncy },
  delivering: { rotate: 5, transition: springGentle },
  listening: { rotate: -15, transition: springSnappy },
  eating: { rotate: [0, 20, -20, 10, 0], transition: { duration: 0.5, ease: 'easeOut' } },
  disgusted: { rotate: [0, -25, 25, -15, 0], transition: { duration: 0.5, ease: 'easeOut' } },
  hungry: { rotate: [0, 15, -15, 10, -10, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
}

export const armVariants: StateVariants = {
  idle: { rotate: [0, 3, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { rotate: 10, y: 5, transition: springGentle },
  alert: { rotate: -5, transition: springSnappy },
  thinking: { rotate: -15, y: -5, transition: springGentle },
  happy: { rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
  nudge: { rotate: -20, transition: springBouncy },
  delivering: { rotate: -10, transition: springGentle },
  listening: { rotate: 0, transition: springGentle },
  eating: { rotate: [0, -15, 0], transition: { duration: 0.3, ease: 'easeOut' } },
  disgusted: { rotate: [0, -20, 20, 0], y: [0, -5, 5, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  hungry: { rotate: [-20, -35, -20], y: [0, -8, 0], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
}

export const lightVariants: StateVariants = {
  idle: { opacity: [0.3, 1, 0.3], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { opacity: 0.1, transition: { duration: 0.5 } },
  alert: { opacity: 1, transition: springSnappy },
  thinking: { opacity: [0.3, 1, 0.3], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
  happy: { opacity: 1, transition: springGentle },
  nudge: { opacity: 1, transition: springGentle },
  delivering: { opacity: [0.5, 1, 0.5], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
  listening: { opacity: 1, transition: springGentle },
  eating: { opacity: [1, 0.2, 1, 0.2, 1], transition: { duration: 0.4 } },
  disgusted: { opacity: [1, 0, 1, 0, 1], transition: { duration: 0.5 } },
  hungry: { opacity: [0.2, 1, 0.2], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
}
