import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'

const GOAL = {
  label: 'Build LinkedIn audience to 10K followers',
  color: '#B08455',
}

const SCHEDULED = [
  { text: 'How I automated my outreach with 3 tools', day: 'Mon 11 PM' },
  { text: 'Why I build in public — week 4 update', day: 'Wed 11 PM' },
  { text: 'Weekly wins recap', day: 'Fri 11 PM' },
]

const QUEUED = [
  '5 tools I use daily as a solo dev',
  'Client acquisition: the real numbers',
  'How I schedule my week with a cat',
  'Before/after: my daily routine transformation',
  'The pitch template that gets 20% reply rate',
  'Why most cold outreach fails (and what works)',
  'Lessons from my first $5K month freelancing',
]

const COMPLETED = [
  { text: 'How I went from 0 to 1200 followers in 3 months', date: 'Jun 14' },
  { text: 'The 3 types of LinkedIn posts that actually work', date: 'Jun 12' },
]

const NOTES = [
  'Best posting times: Tue/Thu 8–10 AM',
  'Engage 10 posts from target audience before posting',
  'Hook formula: [Contrarian take] + [Specific number] + [Promise]',
]

interface GoalBoardScreenProps {
  onBack: () => void
}

export function GoalBoardScreen({ onBack }: GoalBoardScreenProps) {
  return (
    <PageTransition>
      <div className="pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={28} />
          <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer">← back</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: GOAL.color }} />
            <h1 className="text-xl font-bold text-text-primary" style={{ letterSpacing: '-0.01em' }}>
              {GOAL.label}
            </h1>
          </div>
          <p className="text-xs text-text-muted mb-10 ml-7">
            {SCHEDULED.length + QUEUED.length} tasks · {SCHEDULED.length} scheduled · {COMPLETED.length} done
          </p>
        </motion.div>

        <div className="flex gap-10">
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-4">Scheduled this week</p>
              <div className="flex flex-col gap-3 mb-10">
                {SCHEDULED.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.03 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GOAL.color }} />
                    <span className="text-sm text-text-primary flex-1">{item.text}</span>
                    <span className="text-[0.625rem] text-text-muted/50">{item.day}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-4">Queue — {QUEUED.length} tasks</p>
              <div className="flex flex-col gap-3 mb-5">
                {QUEUED.map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-2.5 h-2.5 rounded-full border border-border/60" />
                    <span className="text-sm text-text-secondary">{text}</span>
                  </motion.div>
                ))}
              </div>

              <input
                placeholder="Add a task..."
                className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 mb-6 focus:outline-none focus:border-olive placeholder:text-text-muted/40"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-4"
              >
                <Button variant="primary" size="sm" label="Reschedule week" />
                <div className="flex items-center gap-2">
                  <Cat state="thinking" size={20} />
                  <span className="text-xs text-text-muted">I'll fit these into your available slots</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12">
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-4">Completed</p>
              <div className="flex flex-col gap-3">
                {COMPLETED.map((item) => (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${GOAL.color}20` }}>
                      <span className="text-[0.5rem]" style={{ color: GOAL.color }}>✓</span>
                    </div>
                    <span className="text-sm text-text-muted line-through flex-1">{item.text}</span>
                    <span className="text-[0.625rem] text-text-muted/50">{item.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="w-[14rem] shrink-0">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-4">Notes</p>
              <div className="flex flex-col gap-3 mb-5">
                {NOTES.map((note) => (
                  <p key={note} className="text-xs text-text-secondary leading-relaxed border-b border-border/20 pb-3">{note}</p>
                ))}
              </div>
              <input
                placeholder="Add a note..."
                className="w-full text-xs text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/40"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
