import type { Transition, TargetAndTransition } from 'framer-motion'
import type { CatState } from '../../cat/types'

type StateVariants = Record<CatState, TargetAndTransition>

const springGentle: Transition = { type: 'spring', stiffness: 120, damping: 14 }
const springSnappy: Transition = { type: 'spring', stiffness: 300, damping: 20 }
const springBouncy: Transition = { type: 'spring', stiffness: 400, damping: 12 }

export const bodyVariants: StateVariants = {
  idle: { y: [0, -2, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { y: 3, rotate: 5, transition: springGentle },
  alert: { y: -5, scale: 1.03, transition: springSnappy },
  thinking: { rotate: [0, -2, 2, 0], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } },
  happy: { y: [0, -6, 0], transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } },
  nudge: { y: -3, transition: springBouncy },
  delivering: { y: -2, transition: springGentle },
  listening: { rotate: -3, transition: springGentle },
  eating: { scaleY: [1, 1.06, 0.97, 1], transition: { duration: 0.5, ease: 'easeOut' } },
  disgusted: { x: [0, -4, 4, -3, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  hungry: { y: [0, -4, 0], scaleY: [1, 0.95, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
}

export const eyeVariants: StateVariants = {
  idle: { scaleY: 1, transition: springGentle },
  sleeping: { scaleY: 0.08, transition: { duration: 0.3 } },
  alert: { scaleY: 1.15, transition: springSnappy },
  thinking: { scaleY: 0.8, transition: springGentle },
  happy: { scaleY: 0.35, transition: springGentle },
  nudge: { scaleY: 1.05, transition: springGentle },
  delivering: { scaleY: 0.85, transition: springGentle },
  listening: { scaleY: 1.1, transition: springGentle },
  eating: { scaleY: 0.15, transition: { duration: 0.15 } },
  disgusted: { scaleY: [1, 0.4, 0.5], scaleX: [1, 1.2, 1.1], transition: { duration: 0.3 } },
  hungry: { scaleY: [1.15, 1.3, 1.15], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
}

export const pupilVariants: StateVariants = {
  idle: { x: [0, 2, 0, -2, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { scale: 0, transition: { duration: 0.2 } },
  alert: { scale: 1.3, transition: springSnappy },
  thinking: { x: 3, y: -2, transition: springGentle },
  happy: { scale: 0.8, transition: springGentle },
  nudge: { scale: 1.1, transition: springGentle },
  delivering: { scale: 1, transition: springGentle },
  listening: { x: -3, transition: springGentle },
  eating: { scale: 0.5, transition: { duration: 0.15 } },
  disgusted: { scale: 0.5, x: 4, transition: { duration: 0.3 } },
  hungry: { scale: [1.4, 1.7, 1.4], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
}

export const mouthVariants: StateVariants = {
  idle: { d: 'M 85 148 Q 92 155 100 155 Q 108 155 115 148', transition: springGentle },
  sleeping: { d: 'M 90 148 Q 96 152 100 152 Q 104 152 110 148', transition: springGentle },
  alert: { d: 'M 87 148 Q 94 153 100 153 Q 106 153 113 148', transition: springSnappy },
  thinking: { d: 'M 88 148 Q 94 152 100 152 Q 106 152 112 148', transition: springGentle },
  happy: { d: 'M 82 146 Q 90 158 100 158 Q 110 158 118 146', transition: springGentle },
  nudge: { d: 'M 85 148 Q 92 155 100 155 Q 108 155 115 148', transition: springGentle },
  delivering: { d: 'M 86 147 Q 93 154 100 154 Q 107 154 114 147', transition: springGentle },
  listening: { d: 'M 86 148 Q 93 153 100 153 Q 107 153 114 148', transition: springGentle },
  eating: { d: 'M 85 145 Q 100 168 115 145', transition: springBouncy },
  disgusted: { d: 'M 88 150 Q 92 146 96 150 Q 100 154 104 150 Q 108 146 112 150', transition: springSnappy },
  hungry: { d: 'M 83 147 Q 90 157 100 157 Q 110 157 117 147', transition: springGentle },
}

export const armVariants: StateVariants = {
  idle: { rotate: [0, 2, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { rotate: 8, transition: springGentle },
  alert: { rotate: -5, transition: springSnappy },
  thinking: { rotate: -12, y: -4, transition: springGentle },
  happy: { rotate: [0, -8, 8, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
  nudge: { rotate: -15, transition: springBouncy },
  delivering: { rotate: -8, transition: springGentle },
  listening: { rotate: 0, transition: springGentle },
  eating: { rotate: [0, -10, 0], transition: { duration: 0.3, ease: 'easeOut' } },
  disgusted: { rotate: [0, -15, 15, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  hungry: { rotate: [-15, -25, -15], y: [0, -6, 0], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
}

export const hairVariants: StateVariants = {
  idle: { rotate: [0, 1, 0, -1, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { rotate: 3, transition: springGentle },
  alert: { rotate: -2, scaleY: 1.05, transition: springSnappy },
  thinking: { rotate: 2, transition: springGentle },
  happy: { rotate: [0, -3, 3, 0], scaleY: 1.05, transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
  nudge: { rotate: -2, transition: springBouncy },
  delivering: { rotate: 0, transition: springGentle },
  listening: { rotate: -2, transition: springGentle },
  eating: { scaleY: [1, 1.08, 1], transition: { duration: 0.4, ease: 'easeOut' } },
  disgusted: { rotate: [0, -4, 4, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  hungry: { rotate: [0, 2, -2, 0], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
}
