import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { CatNudge } from '../cat/CatNudge'
import { CompletionPrompt } from '../cat/CompletionPrompt'

type HomeState = 'active' | 'between' | 'done' | 'rest'

const MOCK_STATE: HomeState = 'active'

const CURRENT = {
  label: 'Build Stripe checkout flow',
  goal: 'Startup',
  time: '9:30–11:30 PM',
  color: '#7A9A6D',
  remaining: 47,
  total: 120,
}

const NEXT = {
  label: 'Write LinkedIn post: weekly recap',
  time: '11:30 PM',
  color: '#B08455',
}

const DONE = [
  { label: 'Send 5 cold DMs', color: '#C4745C' },
  { label: 'Follow up API client', color: '#C4745C' },
]

export function HomeScreen() {
  const [nudgeVisible, setNudgeVisible] = useState(false)
  const [completionVisible, setCompletionVisible] = useState(false)
  const [homeState] = useState<HomeState>(MOCK_STATE)
  const progress = (CURRENT.total - CURRENT.remaining) / CURRENT.total

  useEffect(() => {
    if (homeState === 'active') {
      const timer = setTimeout(() => setNudgeVisible(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [homeState])

  if (homeState === 'rest') {
    return (
      <PageTransition>
        <div className="pt-6 pb-12 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 8rem)' }}>
          <Cat state="sleeping" size={48} />
          <p className="text-text-muted mt-6">No tasks today. Rest.</p>
        </div>
      </PageTransition>
    )
  }

  if (homeState === 'done') {
    return (
      <PageTransition>
        <div className="pt-6 pb-12">
          <motion.div className="flex items-center gap-3 mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Cat state="happy" size={26} />
            <span className="text-sm text-text-muted">All done. Nice work today.</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {DONE.map((t, i) => (
              <div key={i} className="flex items-center gap-3 mt-2">
                <span className="text-xs text-text-muted/30">done</span>
                <span className="text-sm text-text-muted/40 line-through">{t.label}</span>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
            <a href="#app/review" className="text-sm text-olive hover:text-olive-hover cursor-pointer">Close the day →</a>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  if (homeState === 'between') {
    return (
      <PageTransition>
        <div className="pt-6 pb-12">
          <motion.div className="flex items-center gap-3 mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Cat state="idle" size={26} />
            <span className="text-sm text-text-muted">Break time. Next task at 9:30 PM.</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs text-text-muted/40 mb-2">next</p>
            <p className="text-lg font-semibold text-text-primary" style={{ letterSpacing: '-0.01em' }}>{CURRENT.label}</p>
            <p className="text-xs mt-1" style={{ color: CURRENT.color }}>{CURRENT.goal} · {CURRENT.time}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-10">
            {DONE.map((t, i) => (
              <div key={i} className="flex items-center gap-3 mt-2">
                <span className="text-xs text-text-muted/30">done</span>
                <span className="text-sm text-text-muted/40 line-through">{t.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <motion.div className="flex items-center gap-3 mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state={nudgeVisible ? 'alert' : 'idle'} size={26} />
          <span className="text-sm text-text-muted">2 tasks left for your goals today</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="text-xs" style={{ color: CURRENT.color }}>{CURRENT.goal}</p>
          <h1 className="text-[2rem] font-bold text-text-primary mt-2 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            {CURRENT.label}
          </h1>
          <div className="flex items-center gap-4 mt-5">
            <span className="text-sm text-text-muted">{CURRENT.remaining} min left</span>
            <div className="flex-1 h-px bg-border/30">
              <motion.div className="h-full" style={{ backgroundColor: CURRENT.color }} initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted/40">next</span>
            <span className="text-sm text-text-muted">{NEXT.label}</span>
            <span className="text-xs text-text-muted/30 ml-auto">{NEXT.time}</span>
          </div>
        </motion.div>

        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          {DONE.map((t, i) => (
            <div key={i} className="flex items-center gap-3 mt-2">
              <span className="text-xs text-text-muted/30">done</span>
              <span className="text-sm text-text-muted/40 line-through">{t.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <CatNudge
        visible={nudgeVisible}
        catState="alert"
        message="Freelancing is your #1 goal but you haven't touched it since 7 PM. Want to swap tonight's remaining time?"
        action="Swap it"
        onAction={() => setNudgeVisible(false)}
        onDismiss={() => { setNudgeVisible(false); setTimeout(() => setCompletionVisible(true), 1500) }}
      />

      <CompletionPrompt
        visible={completionVisible}
        task="Build Stripe checkout flow"
        goal="Startup"
        goalColor="#7A9A6D"
        onYes={() => setCompletionVisible(false)}
        onNo={() => setCompletionVisible(false)}
      />
    </PageTransition>
  )
}
