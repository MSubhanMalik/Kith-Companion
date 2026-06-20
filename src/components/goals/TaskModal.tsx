import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TaskModalProps {
  visible: boolean
  task: { text: string; day: string; time: string; done: boolean; description?: string; output?: string }
  goalColor: string
  onClose: () => void
  onToggleDone: () => void
  onRemove: () => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function TaskModal({ visible, task, goalColor, onClose, onToggleDone, onRemove }: TaskModalProps) {
  const [desc, setDesc] = useState(task.description || '')
  const [output, setOutput] = useState(task.output || '')

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-page/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-[26rem] mx-6 bg-page rounded-2xl border border-border/40 px-8 py-7 shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                  style={task.done ? { backgroundColor: `${goalColor}18` } : { border: '1.5px solid #D4CCC0' }}
                  onClick={onToggleDone}
                >
                  {task.done && <span className="text-[0.375rem]" style={{ color: goalColor }}>✓</span>}
                </div>
                <span className={`text-xs ${task.done ? 'text-text-muted' : 'text-text-muted/50'}`}>{task.day} · {task.time}</span>
              </div>
              <button onClick={onClose} className="text-sm text-text-muted hover:text-text-muted cursor-pointer">✕</button>
            </div>

            <h2 className={`text-lg font-bold leading-snug mb-6 ${task.done ? 'text-text-muted line-through' : 'text-text-primary'}`} style={{ letterSpacing: '-0.01em' }}>
              {task.text}
            </h2>

            <div className="mb-5">
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-2">Description</p>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Add details, notes, links..."
                rows={3}
                className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive resize-none placeholder:text-text-muted/50"
              />
            </div>

            <div className="mb-5">
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-2">Output — what done means</p>
              <input
                value={output}
                onChange={e => setOutput(e.target.value)}
                placeholder="e.g. Login + register working on staging"
                className="w-full text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
              />
            </div>

            <div className="mb-6">
              <p className="text-[0.625rem] text-text-muted tracking-widest uppercase mb-2">Schedule</p>
              <div className="flex items-center gap-2">
                {DAYS.map(d => (
                  <button key={d}
                    className={`text-[0.625rem] px-2 py-1 rounded cursor-pointer transition-colors ${task.day === d ? 'font-medium' : 'text-text-muted hover:text-text-muted'}`}
                    style={task.day === d ? { color: goalColor } : {}}
                  >{d}</button>
                ))}
                <input type="time" defaultValue="14:00" className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-0.5 focus:outline-none focus:border-olive w-24 ml-auto" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={onRemove} className="text-[0.625rem] text-text-muted/50 hover:text-direction cursor-pointer">remove task</button>
              <button onClick={onClose} className="text-xs font-medium cursor-pointer px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors" style={{ color: goalColor }}>Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
