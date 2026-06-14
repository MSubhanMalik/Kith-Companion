import type { Transition, TargetAndTransition } from 'framer-motion'
import type { CatState } from '../types'

type StateVariants = Record<CatState, TargetAndTransition>

const springGentle: Transition = { type: 'spring', stiffness: 120, damping: 14 }
const springSnappy: Transition = { type: 'spring', stiffness: 300, damping: 20 }
const springBouncy: Transition = { type: 'spring', stiffness: 400, damping: 12 }

export const bodyVariants: StateVariants = {
  idle: {
    scaleY: [1, 1.03, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  sleeping: {
    scaleY: [1, 1.05, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  alert: { scaleY: 1, transition: springSnappy },
  thinking: {
    scaleY: [1, 1.02, 1],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
  happy: {
    scaleY: [1, 1.04, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  nudge: { scaleY: 1, transition: springGentle },
  delivering: { scaleY: 1, transition: springGentle },
  listening: {
    scaleY: [1, 1.02, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  eating: {
    scaleY: [1, 1.08, 1.02, 1],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  disgusted: {
    scaleY: [1, 0.92, 0.95],
    scaleX: [1, 1.06, 1.02],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  hungry: {
    scaleY: [1, 0.88, 1, 0.9, 1],
    scaleX: [1, 1.05, 1, 1.04, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const tailVariants: StateVariants = {
  idle: {
    rotate: [0, 6, 0, -4, 0],
    y: [0, -5, 0, 3, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  sleeping: {
    rotate: -10,
    y: 5,
    transition: springGentle,
  },
  alert: {
    rotate: 0,
    y: -8,
    transition: springSnappy,
  },
  thinking: {
    rotate: [0, 3, 0, -3, 0],
    y: [0, -3, 0, 2, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
  happy: {
    rotate: [0, 8, 0, -6, 0],
    y: [0, -8, 0, -6, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  nudge: { rotate: 3, y: -4, transition: springGentle },
  delivering: { rotate: 5, y: -6, transition: springGentle },
  listening: {
    rotate: [0, 4, 0],
    y: [0, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  eating: {
    rotate: 15,
    y: -10,
    transition: springBouncy,
  },
  disgusted: {
    rotate: [0, -20, 15, -10, 0],
    y: [0, 5, -3, 2, 0],
    transition: { duration: 0.8, ease: 'easeInOut' },
  },
  hungry: {
    rotate: [0, -15, 10, -8, 0],
    y: [0, 8, -5, 4, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const earVariants: StateVariants = {
  idle: { rotate: 0, transition: springGentle },
  sleeping: { rotate: 30, transition: springGentle },
  alert: { rotate: -5, transition: springSnappy },
  thinking: { rotate: 5, transition: springGentle },
  happy: { rotate: -3, transition: springGentle },
  nudge: { rotate: -5, transition: springSnappy },
  delivering: { rotate: 0, transition: springGentle },
  listening: { rotate: -10, transition: springSnappy },
  eating: { rotate: -8, transition: springBouncy },
  disgusted: {
    rotate: [0, 40, 35],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  hungry: {
    rotate: [15, 25, 15],
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const eyeVariants: StateVariants = {
  idle: { scaleY: 1, transition: springGentle },
  sleeping: { scaleY: 0.05, transition: { duration: 0.3, ease: 'easeOut' } },
  alert: { scaleY: 1.1, transition: springSnappy },
  thinking: { scaleY: 0.9, transition: springGentle },
  happy: { scaleY: 0.3, transition: springGentle },
  nudge: { scaleY: 1, transition: springGentle },
  delivering: { scaleY: 0.7, transition: springGentle },
  listening: { scaleY: 1.05, transition: springGentle },
  eating: { scaleY: 0.2, transition: { duration: 0.15 } },
  disgusted: {
    scaleY: [1, 0.4, 0.55, 0.45],
    scaleX: [1, 1.3, 1.1, 1.2],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hungry: {
    scaleY: [1.2, 1.35, 1.2],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const pupilVariants: StateVariants = {
  idle: { scale: 1, transition: springGentle },
  sleeping: { scale: 0, transition: { duration: 0.3 } },
  alert: { scale: 1.3, transition: springSnappy },
  thinking: { scale: 0.9, cx: 3, cy: -2, transition: springGentle },
  happy: { scale: 0.8, transition: springGentle },
  nudge: { scale: 1.1, transition: springGentle },
  delivering: { scale: 1, transition: springGentle },
  listening: { scale: 1.1, transition: springGentle },
  eating: { scale: 0.5, cy: 2, transition: { duration: 0.15 } },
  disgusted: {
    scale: [1, 0.3, 0.5],
    x: [0, 5, 3],
    y: [0, 3, 2],
    transition: { duration: 0.3 },
  },
  hungry: {
    scale: [1.5, 1.8, 1.5],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const mouthVariants: StateVariants = {
  idle: { d: 'M 90 140 Q 100 146 110 140', transition: springGentle },
  sleeping: { d: 'M 92 140 Q 100 143 108 140', transition: springGentle },
  alert: { d: 'M 90 140 Q 100 144 110 140', transition: springSnappy },
  thinking: { d: 'M 92 140 Q 100 144 108 140', transition: springGentle },
  happy: { d: 'M 88 138 Q 100 150 112 138', transition: springGentle },
  nudge: { d: 'M 90 140 Q 100 146 110 140', transition: springGentle },
  delivering: { d: 'M 92 138 Q 100 148 108 138', transition: springGentle },
  listening: { d: 'M 90 140 Q 100 145 110 140', transition: springGentle },
  eating: { d: 'M 85 136 Q 100 162 115 136', transition: springBouncy },
  disgusted: { d: 'M 88 140 Q 92 136 96 140 Q 100 144 104 140 Q 108 136 112 140', transition: springSnappy },
  hungry: {
    d: ['M 86 138 Q 100 152 114 138', 'M 88 136 Q 100 155 112 136', 'M 86 138 Q 100 152 114 138'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const pawVariants: StateVariants = {
  idle: { y: 0, transition: springGentle },
  sleeping: { y: 2, transition: springGentle },
  alert: { y: -2, transition: springSnappy },
  thinking: { y: 0, transition: springGentle },
  happy: {
    y: [0, -4, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  nudge: { x: 8, y: -6, transition: springSnappy },
  delivering: { y: -3, transition: springGentle },
  listening: { y: 0, transition: springGentle },
  eating: {
    y: [0, -6, 0],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  disgusted: {
    y: [0, -8, -4],
    x: [0, -6, 6, -3, 0],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  hungry: {
    y: [0, -12, 0, -8, 0],
    x: [0, 4, 0, -4, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const whiskerVariants: StateVariants = {
  idle: { rotate: 0, transition: springGentle },
  sleeping: { rotate: -5, transition: springGentle },
  alert: { rotate: 8, transition: springSnappy },
  thinking: { rotate: 0, transition: springGentle },
  happy: { rotate: 5, transition: springGentle },
  nudge: { rotate: 3, transition: springGentle },
  delivering: { rotate: 0, transition: springGentle },
  listening: { rotate: 4, transition: springGentle },
  eating: { rotate: 12, transition: springBouncy },
  disgusted: {
    rotate: [0, -12, 8, -6, 0],
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  hungry: {
    rotate: [0, 10, 0, -10, 0],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
}
