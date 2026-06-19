import type { CategoryColorId, Goal } from '../types'

export interface CategoryColor {
  bg: string
  light: string
  text: string
}

export const CATEGORY_COLORS: Record<CategoryColorId, CategoryColor> = {
  terracotta:   { bg: '#C4745C', light: 'rgba(196,116,92,0.10)',  text: '#A85D47' },
  sage:         { bg: '#7A9A6D', light: 'rgba(122,154,109,0.10)', text: '#5E7E52' },
  sienna:       { bg: '#B08455', light: 'rgba(176,132,85,0.10)',  text: '#8E6A42' },
  slate:        { bg: '#7889A0', light: 'rgba(120,137,160,0.10)', text: '#5E6F84' },
  plum:         { bg: '#9B7BA8', light: 'rgba(155,123,168,0.10)', text: '#7E5F8E' },
  teal:         { bg: '#5E9E94', light: 'rgba(94,158,148,0.10)',  text: '#4A8078' },
  amber:        { bg: '#C49B4A', light: 'rgba(196,155,74,0.10)',  text: '#A07F3A' },
  clay:         { bg: '#B07B6E', light: 'rgba(176,123,110,0.10)', text: '#8E6358' },
  moss:         { bg: '#6E8B5E', light: 'rgba(110,139,94,0.10)',  text: '#577148' },
  'dusty-rose': { bg: '#B8848E', light: 'rgba(184,132,142,0.10)', text: '#966A74' },
}

const COLOR_ORDER: CategoryColorId[] = [
  'terracotta', 'sage', 'sienna', 'slate', 'plum',
  'teal', 'amber', 'clay', 'moss', 'dusty-rose',
]

export function assignColor(existingGoals: Goal[]): CategoryColorId {
  const used = new Set(existingGoals.map(g => g.colorId))
  return COLOR_ORDER.find(c => !used.has(c)) ?? COLOR_ORDER[0]
}

export function getGoalColor(colorId: CategoryColorId): CategoryColor {
  return CATEGORY_COLORS[colorId]
}
