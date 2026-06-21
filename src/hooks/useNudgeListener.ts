import { useEffect, useRef } from 'react'
import { useScheduleStore } from '../stores/schedule'
import { useAuthStore } from '../stores/auth'
import { axiosService } from '../services/AxiosService'
import { endpoints } from '../config/api'

declare global {
  interface Window {
    appAPI?: {
      onFileContent: (cb: (data: unknown) => void) => void
      googleAuth: () => Promise<string>
      pushNudge: (data: Record<string, unknown>) => void
      dismissNudge: () => void
    }
  }
}

interface NudgeResponse {
  id: number
  type: string
  message: string
  scheduledBlockId: number | null
  dismissed: boolean
  triggeredAt: string
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function useNudgeListener() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const currentWeek = useScheduleStore(s => s.currentWeek)
  const lastNudgeBlock = useRef<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !window.appAPI?.pushNudge) return

    function checkScheduleEvents() {
      if (!currentWeek?.blocks) return

      const now = new Date()
      const nowMinutes = now.getHours() * 60 + now.getMinutes()
      const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3)

      const todayBlocks = currentWeek.blocks
        .filter(b => b.day === dayName && b.type === 'goal_task')
        .sort((a, b) => a.time.start.localeCompare(b.time.start))

      for (const block of todayBlocks) {
        const blockStart = timeToMinutes(block.time.start)
        const blockEnd = timeToMinutes(block.time.end)
        const blockKey = `${block.id}-${block.day}`

        if (lastNudgeBlock.current === blockKey) continue

        if (nowMinutes >= blockStart - 5 && nowMinutes < blockStart) {
          lastNudgeBlock.current = blockKey
          fetchAndPushNudge('block_start', block.id)
          return
        }

        if (nowMinutes >= blockEnd && nowMinutes < blockEnd + 5) {
          lastNudgeBlock.current = blockKey + '-end'
          fetchAndPushNudge('block_end', block.id)
          return
        }
      }
    }

    async function fetchAndPushNudge(trigger: string, blockId?: number) {
      try {
        const res = await axiosService.post<{ data: NudgeResponse }>(endpoints.chat.nudge)
        const nudge = res.data
        if (nudge?.message) {
          window.appAPI?.pushNudge({
            kind: 'bubble',
            type: trigger === 'block_start' ? 'direction' : 'connection',
            label: trigger === 'block_start' ? 'coming up' : 'block done',
            message: nudge.message,
            primaryAction: 'Open Kith',
            secondaryAction: 'Dismiss',
          })
        }
      } catch {}
    }

    checkScheduleEvents()
    intervalRef.current = setInterval(checkScheduleEvents, 60000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLoggedIn, currentWeek])
}
