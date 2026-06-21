import { useEffect, useRef } from 'react'
import { useCatStore } from '../stores/cat'
import { useScheduleStore } from '../stores/schedule'
import type { CatState } from '../components/cat/types'

function getCurrentTimeMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function useCatIntelligence() {
  const setState = useCatStore(s => s.setState)
  const catState = useCatStore(s => s.state)
  const currentWeek = useScheduleStore(s => s.currentWeek)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    function checkSchedule() {
      if (catState === 'listening' || catState === 'eating' || catState === 'disgusted') return

      const now = getCurrentTimeMinutes()
      const today = new Date()
      const dayName = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3)

      if (now < 360 || now > 1380) {
        setState('sleeping')
        return
      }

      if (!currentWeek || !currentWeek.blocks) {
        setState('idle')
        return
      }

      const todayBlocks = currentWeek.blocks.filter(b => b.day === dayName)
      if (todayBlocks.length === 0) {
        setState('idle')
        return
      }

      for (const block of todayBlocks) {
        const startMin = timeToMinutes(block.time.start)
        const endMin = timeToMinutes(block.time.end)

        if (now >= startMin - 5 && now < startMin) {
          setState('alert')
          return
        }

        if (now >= startMin && now < endMin && block.type === 'goal_task') {
          setState('idle')
          return
        }
      }

      const allDone = todayBlocks
        .filter(b => b.type === 'goal_task')
        .every(b => b.status === 'completed' || b.status === 'COMPLETED')

      if (allDone && todayBlocks.some(b => b.type === 'goal_task')) {
        setState('happy')
        return
      }

      setState('idle')
    }

    checkSchedule()
    intervalRef.current = setInterval(checkSchedule, 60000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentWeek, setState, catState])
}
