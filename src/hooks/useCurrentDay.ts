import { timeService } from '../services'

export function useCurrentDay() {
  return {
    day: timeService.getCurrentDay(),
    today: timeService.getToday(),
    weekOf: timeService.getMonday(),
  }
}
