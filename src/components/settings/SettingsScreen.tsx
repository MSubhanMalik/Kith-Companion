import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'
import { motion } from 'framer-motion'

export function SettingsScreen() {
  return (
    <PageTransition>
      <div className="pt-6 pb-12 max-w-[26rem]">
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Cat state="idle" size={26} />
          <span className="text-sm text-text-muted">Settings</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-12">
          <p className="text-xs text-text-muted/40 mb-4">goals</p>
          {[
            { label: 'Earn $10K/month from freelancing', color: '#C4745C', hours: '16h' },
            { label: 'Launch MVP with 100 users', color: '#7A9A6D', hours: '10h' },
            { label: 'Build LinkedIn to 10K', color: '#B08455', hours: '6h' },
          ].map((g, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-text-primary">{g.label}</span>
              <span className="text-xs text-text-muted/40">{g.hours}/wk</span>
            </div>
          ))}
          <button className="text-xs text-text-muted/30 hover:text-olive mt-2 cursor-pointer">+ add</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <p className="text-xs text-text-muted/40 mb-4">non-negotiables</p>
          {[
            { label: 'Work', detail: '9–5 · Mon–Fri' },
            { label: 'Gym', detail: '6–7 PM · Mon–Fri' },
            { label: 'Sleep', detail: '11 PM–7 AM' },
          ].map((b, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-text-primary">{b.label}</span>
              <span className="text-xs text-text-muted/40">{b.detail}</span>
            </div>
          ))}
          <button className="text-xs text-text-muted/30 hover:text-olive mt-2 cursor-pointer">+ add</button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <button className="text-xs text-text-muted/30 hover:text-direction cursor-pointer">Reset everything</button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
