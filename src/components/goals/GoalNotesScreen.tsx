import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'

const GOAL = {
  label: 'Build LinkedIn audience to 10K followers',
  color: '#B08455',
}

const NOTES = [
  {
    id: '1',
    text: 'Post idea: "How I automated my outreach with 3 tools" — show the actual workflow, not theory',
    created: 'Jun 17',
  },
  {
    id: '2',
    text: 'Research: best posting times are Tue/Thu 8-10 AM. Schedule accordingly.',
    created: 'Jun 16',
  },
  {
    id: '3',
    text: 'Draft: weekly wins recap format — 3 bullets, 1 lesson, 1 question to the audience',
    created: 'Jun 15',
  },
  {
    id: '4',
    text: 'Engage 10 posts/day from target audience before posting. Builds visibility.',
    created: 'Jun 14',
  },
]

const LISTS = [
  {
    title: 'Post drafts',
    items: [
      { text: 'How I automate outreach', done: true },
      { text: 'Why I build in public', done: false },
      { text: 'Weekly wins recap', done: false },
    ],
  },
  {
    title: 'Content ideas',
    items: [
      { text: '5 tools I use daily as a solo dev', done: false },
      { text: 'How I schedule my week with Kith', done: false },
      { text: 'Client acquisition breakdown (numbers)', done: false },
      { text: 'Before/after: my daily routine', done: false },
    ],
  },
]

interface GoalNotesScreenProps {
  onBack: () => void
}

export function GoalNotesScreen({ onBack }: GoalNotesScreenProps) {
  return (
    <PageTransition>
      <div className="pb-8">
        <button onClick={onBack} className="text-sm text-text-muted hover:text-text-primary cursor-pointer mb-8">← back</button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GOAL.color }} />
            <h1 className="text-xl font-bold text-text-primary" style={{ letterSpacing: '-0.01em' }}>
              {GOAL.label}
            </h1>
          </div>
        </motion.div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-4">Notes</p>

              <div className="flex flex-col gap-3 mb-4">
                {NOTES.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                    className="border-b border-border/30 pb-3"
                  >
                    <p className="text-sm text-text-primary leading-relaxed">{note.text}</p>
                    <p className="text-[0.625rem] text-text-muted/50 mt-1">{note.created}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  placeholder="Add a note..."
                  className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/40"
                />
              </div>
            </motion.div>
          </div>

          <div className="w-[16rem] shrink-0">
            {LISTS.map((list, li) => (
              <motion.div
                key={list.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + li * 0.08 }}
                className="mb-8"
              >
                <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-3">{list.title}</p>
                <div className="flex flex-col gap-2">
                  {list.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center cursor-pointer ${
                        item.done ? '' : 'border border-border/60'
                      }`} style={item.done ? { backgroundColor: `${GOAL.color}20` } : {}}>
                        {item.done && <span className="text-[0.5rem]" style={{ color: GOAL.color }}>✓</span>}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="text-xs text-text-muted hover:text-olive mt-2 cursor-pointer">+ add</button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
