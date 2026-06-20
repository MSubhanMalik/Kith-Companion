import { getGoalColor } from '../lib/colors'
import type { CategoryColorId } from '../types'

export function useGoalColor(colorId: CategoryColorId) {
  return getGoalColor(colorId)
}
