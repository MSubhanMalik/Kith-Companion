import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

type View = 'week' | 'month'

const WEEK_COLS: Array<{ day: string; date: string; tasks: Array<{ label: string; time: string; color: string }> }> = [
  { day: 'Mon', date: '16', tasks: [
    { label: 'Send 5 cold DMs to agency founders', time: '5:30 PM', color: '#C4745C' },
    { label: 'Build auth endpoints', time: '9 PM', color: '#7A9A6D' },
    { label: 'Write "How I automate outreach"', time: '11 PM', color: '#B08455' },
  ]},
  { day: 'Tue', date: '17', tasks: [
    { label: 'Follow up 3 warm leads', time: '5:30 PM', color: '#C4745C' },
    { label: 'Build session mgmt', time: '9 PM', color: '#7A9A6D' },
  ]},
  { day: 'Wed', date: '18', tasks: [
    { label: 'Send 5 cold DMs to CTOs', time: '5:30 PM', color: '#C4745C' },
    { label: 'Stripe checkout', time: '9 PM', color: '#7A9A6D' },
    { label: 'Write "Why I build in public"', time: '11 PM', color: '#B08455' },
  ]},
  { day: 'Thu', date: '19', tasks: [
    { label: 'Prep discovery call', time: '5:30 PM', color: '#C4745C' },
    { label: 'Test payment flow', time: '9 PM', color: '#7A9A6D' },
  ]},
  { day: 'Fri', date: '20', tasks: [
    { label: 'Send SOW + follow ups', time: '5:30 PM', color: '#C4745C' },
    { label: 'Weekly wins recap', time: '11 PM', color: '#B08455' },
  ]},
  { day: 'Sat', date: '21', tasks: [
    { label: 'Fix bugs + deploy', time: '10 AM', color: '#7A9A6D' },
  ]},
  { day: 'Sun', date: '22', tasks: [] },
]

const MONTH_DATA = [
  { days: [
    { date: 2, dots: ['#C4745C', '#7A9A6D'] },
    { date: 3, dots: ['#C4745C'] },
    { date: 4, dots: ['#C4745C', '#7A9A6D', '#B08455'] },
    { date: 5, dots: ['#7A9A6D'] },
    { date: 6, dots: ['#C4745C', '#B08455'] },
    { date: 7, dots: [] },
    { date: 8, dots: [] },
  ]},
  { days: [
    { date: 9, dots: ['#C4745C', '#7A9A6D', '#B08455'] },
    { date: 10, dots: ['#C4745C', '#7A9A6D'] },
    { date: 11, dots: ['#C4745C', '#7A9A6D'] },
    { date: 12, dots: ['#7A9A6D', '#B08455'] },
    { date: 13, dots: ['#C4745C'] },
    { date: 14, dots: ['#7A9A6D'] },
    { date: 15, dots: [] },
  ]},
  { days: [
    { date: 16, dots: ['#C4745C', '#7A9A6D', '#B08455'] },
    { date: 17, dots: ['#C4745C', '#7A9A6D'] },
    { date: 18, dots: ['#C4745C', '#7A9A6D', '#B08455'], today: true },
    { date: 19, dots: ['#C4745C', '#7A9A6D'] },
    { date: 20, dots: ['#C4745C', '#B08455'] },
    { date: 21, dots: ['#7A9A6D'] },
    { date: 22, dots: [] },
  ]},
  { days: [
    { date: 23, dots: ['#C4745C', '#7A9A6D'] },
    { date: 24, dots: ['#C4745C', '#7A9A6D', '#B08455'] },
    { date: 25, dots: ['#7A9A6D'] },
    { date: 26, dots: ['#C4745C'] },
    { date: 27, dots: ['#C4745C', '#7A9A6D'] },
    { date: 28, dots: [] },
    { date: 29, dots: [] },
  ]},
  { days: [
    { date: 30, dots: ['#C4745C', '#B08455'] },
    { date: 1, dots: ['#C4745C', '#7A9A6D'], label: 'Jul' },
    { date: 2, dots: ['#7A9A6D', '#B08455'] },
    { date: 3, dots: ['#C4745C'] },
    { date: 4, dots: ['#C4745C', '#7A9A6D'] },
    { date: 5, dots: [] },
    { date: 6, dots: [] },
  ]},
]

const LEGEND = [
  { label: 'Freelancing', color: '#C4745C' },
  { label: 'Startup', color: '#7A9A6D' },
  { label: 'LinkedIn', color: '#B08455' },
]

export function WeekScreen() {
  const [view, setView] = useState<View>('week')
  const todayDate = '18'

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">
            {view === 'week' ? 'Thursday looks heavy. Friday is light. Want me to rebalance?' : 'June · 3 goals active'}
          </span>
          <div className="flex gap-1 ml-auto">
            {(['week', 'month'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`text-xs px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  view === v ? 'text-text-primary font-medium' : 'text-text-muted/40 hover:text-text-muted'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'week' ? (
            <motion.div
              key="week"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-7 gap-4">
                {WEEK_COLS.map((col, di) => (
                  <div key={col.day}>
                    <p className={`text-xs font-semibold mb-1 ${col.date === todayDate ? 'text-olive' : 'text-text-muted/40'}`}>
                      {col.day}
                    </p>
                    <p className={`text-[0.625rem] mb-4 ${col.date === todayDate ? 'text-olive/50' : 'text-text-muted/20'}`}>
                      {col.date}
                    </p>
                    <div className="flex flex-col gap-4">
                      {col.tasks.length === 0 && (
                        <p className="text-[0.625rem] text-text-muted/15">—</p>
                      )}
                      {col.tasks.map((task, ti) => (
                        <motion.div
                          key={ti}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: di * 0.03 + ti * 0.03 }}
                        >
                          <p className="text-[0.6875rem] leading-snug" style={{ color: task.color }}>
                            {task.label}
                          </p>
                          <p className="text-[0.5625rem] text-text-muted/25 mt-0.5">{task.time}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-5 mt-10">
                {LEGEND.map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-text-muted/40">{l.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-7 gap-x-2 mb-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <p key={i} className="text-[0.625rem] text-text-muted/25 text-center">{d}</p>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                {MONTH_DATA.map((week, wi) => (
                  <motion.div
                    key={wi}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: wi * 0.04 }}
                    className="grid grid-cols-7 gap-x-2"
                  >
                    {week.days.map((day, di) => (
                      <div
                        key={di}
                        className={`py-3 px-1 rounded-lg text-center ${
                          (day as typeof day & { today?: boolean }).today ? 'bg-olive/5' : ''
                        }`}
                      >
                        <p className={`text-sm mb-2 ${
                          (day as typeof day & { today?: boolean }).today
                            ? 'text-olive font-semibold'
                            : day.dots.length > 0 ? 'text-text-primary' : 'text-text-muted/20'
                        }`}>
                          {day.date}
                        </p>
                        <div className="flex justify-center gap-[3px]">
                          {day.dots.map((color, ci) => (
                            <div key={ci} className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-5 mt-8">
                {LEGEND.map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-text-muted/40">{l.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
