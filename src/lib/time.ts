import type { DayOfWeek, TimeRange, ScheduledBlock } from '../types'

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTime12h(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return days[new Date().getDay()]
}

export function getCurrentTimeString(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function isTimeInRange(time: string, range: TimeRange): boolean {
  const t = timeToMinutes(time)
  const start = timeToMinutes(range.start)
  const end = timeToMinutes(range.end)

  if (start <= end) {
    return t >= start && t < end
  }
  return t >= start || t < end
}

export function getBlockDurationMinutes(range: TimeRange): number {
  const start = timeToMinutes(range.start)
  const end = timeToMinutes(range.end)

  if (end > start) {
    return end - start
  }
  return (24 * 60 - start) + end
}

export function getCurrentBlock(blocks: ScheduledBlock[], day: DayOfWeek): ScheduledBlock | undefined {
  const now = getCurrentTimeString()
  return blocks.find(b => b.day === day && isTimeInRange(now, b.time))
}

export function getNextBlock(blocks: ScheduledBlock[], day: DayOfWeek): ScheduledBlock | undefined {
  const nowMinutes = timeToMinutes(getCurrentTimeString())
  const dayBlocks = blocks
    .filter(b => b.day === day)
    .sort((a, b) => timeToMinutes(a.time.start) - timeToMinutes(b.time.start))

  return dayBlocks.find(b => timeToMinutes(b.time.start) > nowMinutes)
}

export function getMonday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  const aStart = timeToMinutes(a.start)
  const aEnd = timeToMinutes(a.end)
  const bStart = timeToMinutes(b.start)
  const bEnd = timeToMinutes(b.end)

  if (aStart < aEnd && bStart < bEnd) {
    return aStart < bEnd && bStart < aEnd
  }
  return true
}
