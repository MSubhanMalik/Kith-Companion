import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

const ALL_GOALS = [
  {
    id: '1',
    label: 'Earn $10K/month from freelancing',
    color: '#C4745C',
    catMessage: 'Freelancing is on track. 4 of 7 tasks done this week.',
    scheduled: [
      { text: 'Send 5 cold DMs to agency founders', day: 'Mon', time: '5:30 PM' },
      { text: 'Follow up 3 warm leads', day: 'Tue', time: '5:30 PM' },
      { text: 'Send 5 cold DMs to CTOs', day: 'Wed', time: '5:30 PM' },
    ],
    queued: ['Prep discovery call deck', 'Send SOW to API client', 'Research 10 new leads'],
    done: ['Set up freelance portfolio site', 'Create cold outreach template'],
  },
  {
    id: '2',
    label: 'Launch startup MVP with 100 users',
    color: '#7A9A6D',
    catMessage: 'Startup needs 4 more hours this week to stay on pace.',
    scheduled: [
      { text: 'Build auth endpoints', day: 'Mon', time: '9 PM' },
      { text: 'Build session management', day: 'Tue', time: '9 PM' },
      { text: 'Stripe checkout flow', day: 'Wed', time: '9 PM' },
    ],
    queued: ['Test payment flow e2e', 'Fix bugs + deploy staging', 'Build user dashboard'],
    done: ['Set up project repo', 'Design database schema'],
  },
  {
    id: '3',
    label: 'Build LinkedIn audience to 10K',
    color: '#B08455',
    catMessage: '1 of 4 done. At this pace you\'ll miss the 3-post target.',
    scheduled: [
      { text: 'Write "How I automate outreach"', day: 'Mon', time: '11 PM' },
      { text: 'Write "Why I build in public"', day: 'Wed', time: '11 PM' },
      { text: 'Weekly wins recap', day: 'Fri', time: '11 PM' },
    ],
    queued: ['5 tools I use daily', 'Client acquisition: the numbers', 'How I schedule my week with a cat'],
    done: ['How I went from 0 to 1200 followers'],
  },
]

interface GoalScreenProps {
  onBack: () => void
}

export function GoalScreen({ onBack }: GoalScreenProps) {
  const [activeIndex, setActiveIndex] = useState(2)
  const goal = ALL_GOALS[activeIndex]

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">{goal.catMessage}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <button onClick={onBack} className="text-xs text-text-muted/40 hover:text-text-muted cursor-pointer mb-6">← goals</button>

          <div className="flex gap-3 mb-8">
            {ALL_GOALS.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setActiveIndex(i)}
                className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  i === activeIndex ? 'font-medium' : 'text-text-muted/40 hover:text-text-muted'
                }`}
                style={i === activeIndex ? { color: g.color } : {}}
              >
                {g.label.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={goal.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <h1 className="text-xl font-bold text-text-primary leading-snug mb-10" style={{ letterSpacing: '-0.02em' }}>
              {goal.label}
            </h1>

            <div>
              <p className="text-xs text-text-muted/40 mb-4">this week</p>
              <div className="flex flex-col gap-3">
                {goal.scheduled.map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-4">
                    <span className="text-sm" style={{ color: goal.color }}>{item.text}</span>
                    <span className="text-[0.625rem] text-text-muted/30 shrink-0">{item.day} {item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <p className="text-xs text-text-muted/40 mb-4">queue · {goal.queued.length}</p>
              <div className="flex flex-col gap-3">
                {goal.queued.map((text, i) => (
                  <p key={i} className="text-sm text-text-secondary">{text}</p>
                ))}
              </div>
              <input
                placeholder="add a task..."
                className="w-full text-sm text-text-primary bg-transparent border-b border-border/20 pb-2 mt-4 focus:outline-none focus:border-olive placeholder:text-text-muted/25"
              />
            </div>

            <div className="mt-12">
              <p className="text-xs text-text-muted/40 mb-4">done</p>
              <div className="flex flex-col gap-2">
                {goal.done.map((text, i) => (
                  <p key={i} className="text-sm text-text-muted/30 line-through">{text}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
