import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { Cat } from '../cat/Cat'
import { motion } from 'framer-motion'

export function SettingsScreen() {
  return (
    <PageTransition>
      <div className="max-w-[28rem] mx-auto pb-12 pt-2">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={28} />
          <p className="text-sm text-text-muted">Settings</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-10">
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Goals</p>
          {[
            { label: 'Earn $10K/month from freelancing', color: '#C4745C', hours: '16h/wk' },
            { label: 'Launch MVP with 100 users', color: '#7A9A6D', hours: '10h/wk' },
            { label: 'Build LinkedIn to 10K followers', color: '#B08455', hours: '6h/wk' },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-border/30">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
              <span className="text-sm text-text-primary flex-1">{g.label}</span>
              <span className="text-xs text-text-muted">{g.hours}</span>
            </div>
          ))}
          <button className="text-xs text-text-muted hover:text-olive mt-4 cursor-pointer">+ add goal</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Non-negotiables</p>
          {[
            { label: 'Work', detail: '9 AM – 5 PM · Mon–Fri' },
            { label: 'Gym', detail: '6 PM – 7 PM · Mon–Fri' },
            { label: 'Sleep', detail: '11 PM – 7 AM · Every day' },
          ].map((b, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30">
              <span className="text-sm text-text-primary">{b.label}</span>
              <span className="text-xs text-text-muted">{b.detail}</span>
            </div>
          ))}
          <button className="text-xs text-text-muted hover:text-olive mt-4 cursor-pointer">+ add block</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-10">
          <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-5">Schedule cycle</p>
          <div className="flex gap-3">
            {['Weekly', 'Monthly'].map(opt => (
              <button
                key={opt}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  opt === 'Weekly' ? 'text-olive font-medium' : 'text-text-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <Button variant="secondary" size="sm" label="Reset everything" />
        </motion.div>
      </div>
    </PageTransition>
  )
}
