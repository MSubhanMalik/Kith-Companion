import type { DayOfWeek, ScheduledBlock } from '../types'
import { getCurrentDayOfWeek, getCurrentTimeString, getCurrentBlock, getNextBlock, getMonday, getTodayISO, formatTime12h } from '../lib/time'

export class TimeService {
  getCurrentDay(): DayOfWeek {
    return getCurrentDayOfWeek()
  }

  getCurrentTime(): string {
    return getCurrentTimeString()
  }

  getMonday(): string {
    return getMonday()
  }

  getToday(): string {
    return getTodayISO()
  }

  formatTime(time: string): string {
    return formatTime12h(time)
  }

  findCurrentBlock(blocks: ScheduledBlock[]): ScheduledBlock | undefined {
    return getCurrentBlock(blocks, this.getCurrentDay())
  }

  findNextBlock(blocks: ScheduledBlock[]): ScheduledBlock | undefined {
    return getNextBlock(blocks, this.getCurrentDay())
  }
}

export const timeService = new TimeService()
