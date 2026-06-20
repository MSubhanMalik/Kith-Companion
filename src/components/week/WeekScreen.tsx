import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { exportWeeklySchedule } from '../../lib/export'

type View = 'week' | 'month'

const WEEK_COLS = [
  { day: 'Mon', date: '16', tasks: [
    { label: 'Send 5 cold DMs', time: '5:30', color: '#C4745C', done: true },
    { label: 'Build auth endpoints', time: '9:00', color: '#7A9A6D', done: true },
    { label: 'Write "How I automate outreach"', time: '11:00', color: '#B08455', done: true },
  ]},
  { day: 'Tue', date: '17', tasks: [
    { label: 'Follow up 3 leads', time: '5:30', color: '#C4745C', done: true },
    { label: 'Build session mgmt', time: '9:00', color: '#7A9A6D', done: true },
  ]},
  { day: 'Wed', date: '18', tasks: [
    { label: 'Send 5 DMs to CTOs', time: '5:30', color: '#C4745C', done: true },
    { label: 'Stripe checkout', time: '9:30', color: '#7A9A6D', done: false },
    { label: 'Write "Why I build in public"', time: '11:30', color: '#B08455', done: false },
  ]},
  { day: 'Thu', date: '19', tasks: [
    { label: 'Prep discovery call', time: '5:30', color: '#C4745C', done: false },
    { label: 'Test payment flow', time: '9:00', color: '#7A9A6D', done: false },
  ]},
  { day: 'Fri', date: '20', tasks: [
    { label: 'Send SOW + follow ups', time: '5:30', color: '#C4745C', done: false },
    { label: 'Weekly wins recap', time: '11:00', color: '#B08455', done: false },
  ]},
  { day: 'Sat', date: '21', tasks: [
    { label: 'Fix bugs + deploy', time: '10:00', color: '#7A9A6D', done: false },
  ]},
  { day: 'Sun', date: '22', tasks: [] },
]

const MONTH = [
  { days: [
    { d: 2, n: 2 }, { d: 3, n: 1 }, { d: 4, n: 3 }, { d: 5, n: 1 }, { d: 6, n: 2 }, { d: 7, n: 0 }, { d: 8, n: 0 },
  ]},
  { days: [
    { d: 9, n: 3 }, { d: 10, n: 2 }, { d: 11, n: 2 }, { d: 12, n: 2 }, { d: 13, n: 1 }, { d: 14, n: 1 }, { d: 15, n: 0 },
  ]},
  { days: [
    { d: 16, n: 3 }, { d: 17, n: 2 }, { d: 18, n: 3, today: true }, { d: 19, n: 2 }, { d: 20, n: 2 }, { d: 21, n: 1 }, { d: 22, n: 0 },
  ]},
  { days: [
    { d: 23, n: 2 }, { d: 24, n: 3 }, { d: 25, n: 1 }, { d: 26, n: 1 }, { d: 27, n: 2 }, { d: 28, n: 0 }, { d: 29, n: 0 },
  ]},
]

export function WeekScreen() {
  const [view, setView] = useState<View>('week')
  const todayDate = '18'

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="idle" size={26} />
          <button className="text-text-muted hover:text-text-primary cursor-pointer text-sm">←</button>
          <span className="text-sm text-text-muted">Jun 16 – 22</span>
          <button className="text-text-muted hover:text-text-primary cursor-pointer text-sm">→</button>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={exportWeeklySchedule} className="text-[0.625rem] text-text-muted hover:text-olive cursor-pointer transition-colors">Export ↓</button>
            {(['week', 'month'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors ${view === v ? 'text-text-primary font-medium' : 'text-text-muted hover:text-text-muted'}`}
              >{v}</button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'week' ? (
            <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-7 gap-4">
                {WEEK_COLS.map((col, di) => (
                  <div key={col.day}>
                    <p className={`text-xs font-semibold mb-1 ${col.date === todayDate ? 'text-olive' : 'text-text-muted'}`}>{col.day}</p>
                    <p className={`text-[0.625rem] mb-4 ${col.date === todayDate ? 'text-olive/50' : 'text-text-muted/50'}`}>{col.date}</p>
                    <div className="flex flex-col gap-4">
                      {col.tasks.length === 0 && <p className="text-[0.625rem] text-text-muted/50">—</p>}
                      {col.tasks.map((task, ti) => (
                        <motion.div key={ti} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: di * 0.03 + ti * 0.03 }}>
                          <p className={`text-[0.6875rem] leading-snug ${task.done ? 'line-through opacity-30' : ''}`} style={{ color: task.color }}>
                            {task.label}
                          </p>
                          <p className="text-[0.5625rem] text-text-muted/50 mt-0.5">{task.time}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-7 gap-x-2 mb-3">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <p key={i} className="text-[0.625rem] text-text-muted/50 text-center">{d}</p>
                ))}
              </div>
              {MONTH.map((week, wi) => (
                <motion.div key={wi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: wi * 0.04 }} className="grid grid-cols-7 gap-x-2">
                  {week.days.map((day, di) => (
                    <div key={di} className={`py-3 text-center rounded-lg ${(day as typeof day & {today?: boolean}).today ? 'bg-olive/5' : ''}`}>
                      <p className={`text-sm ${(day as typeof day & {today?: boolean}).today ? 'text-olive font-semibold' : day.n > 0 ? 'text-text-primary' : 'text-text-muted/50'}`}>{day.d}</p>
                      {day.n > 0 && <p className="text-[0.5rem] text-text-muted mt-0.5">{day.n} tasks</p>}
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
