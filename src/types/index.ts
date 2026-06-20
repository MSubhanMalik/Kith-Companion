export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const DAYS_OF_WEEK: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

export interface TimeRange {
  start: string
  end: string
}

export interface LifeBlock {
  id: string
  label: string
  days: DayOfWeek[]
  time: TimeRange
}

export type CategoryColorId =
  | 'terracotta'
  | 'sage'
  | 'sienna'
  | 'slate'
  | 'plum'
  | 'teal'
  | 'amber'
  | 'clay'
  | 'moss'
  | 'dusty-rose'

export interface Goal {
  id: string
  label: string
  targetDate: string
  currentStatus: string
  successMetric: string
  colorId: CategoryColorId
  rank: number
  weeklyHours: number
  createdAt: string
  isPrivate: boolean
  nickname: string
}

export interface MilestoneStep {
  id: string
  text: string
  estimatedMinutes: number
  status: 'pending' | 'in_progress' | 'done'
}

export interface Milestone {
  id: string
  goalId: string
  text: string
  successProof: string
  steps: MilestoneStep[]
  weekOf: string
  status: 'pending' | 'in_progress' | 'done'
}

export interface ScheduledBlock {
  id: string
  type: 'life_block' | 'goal_task'
  referenceId: string
  day: DayOfWeek
  time: TimeRange
  label: string
  taskDescription?: string
  outputDefinition?: string
  milestoneStepId?: string
  status: 'scheduled' | 'active' | 'completed' | 'skipped'
}

export interface WeekSchedule {
  weekOf: string
  blocks: ScheduledBlock[]
  lockedAt?: string
}

export interface DayLog {
  date: string
  morningCommitment: string[]
  taskCompletions: Record<string, 'done' | 'partial' | 'skipped'>
  focusScores: Record<string, number>
  distractions: string[]
  energyLevel: number
  tomorrowTopThree: string[]
  morningDoneAt?: string
  nightDoneAt?: string
}

export interface WeekMetrics {
  weekOf: string
  hoursPlanned: Record<string, number>
  hoursCompleted: Record<string, number>
  avgFocusScore: number
  avgEnergy: number
  milestonesCompleted: number
  milestonesTotal: number
  patterns: string[]
}

export type NudgeType =
  | 'block_start'
  | 'block_midpoint'
  | 'block_ending'
  | 'morning_reminder'
  | 'night_reminder'
  | 'idle_check'
  | 'behind_gentle'

export interface Nudge {
  id: string
  type: NudgeType
  message: string
  scheduledBlockId?: string
  triggeredAt: string
  dismissed: boolean
}

export type OnboardingStep = 'welcome' | 'setup' | 'preview'
