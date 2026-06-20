import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from '../cat/Cat'

interface Message {
  id: string
  from: 'user' | 'kith'
  text: string
}

const SUGGESTIONS = [
  'Reschedule my week',
  'Break down a new goal',
  'What should I focus on?',
]

interface ChatPanelProps {
  visible: boolean
  onClose: () => void
}

export function ChatPanel({ visible, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'kith', text: 'What do you need?' },
  ])
  const [input, setInput] = useState('')

  function send(text?: string) {
    const msg = text || input.trim()
    if (!msg) return
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const responses: Record<string, string> = {
        'reschedule': 'Thursday is heavy — 2 deep tasks back to back. I moved "Test payment flow" to Friday morning. Updated your schedule.',
        'break': 'What\'s the goal? Tell me in one sentence and I\'ll break it into tasks and schedule them.',
        'focus': 'Startup is behind by 4 hours. Your next slot is at 9:30 PM — I\'d put Stripe checkout there. Freelancing is on track.',
      }
      const key = Object.keys(responses).find(k => msg.toLowerCase().includes(k))
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'kith',
        text: key ? responses[key] : 'Got it. Your startup goal is behind by 4 hours this week. Want me to rebalance the schedule?',
      }
      setMessages(prev => [...prev, reply])
    }, 600)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 right-0 z-50 w-[22rem] flex flex-col"
          style={{ height: 'calc(100vh - 4rem)', top: '4rem' }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex-1 flex flex-col bg-page border-l border-border/40 px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cat state="listening" size={20} />
                <span className="text-xs text-text-muted">Kith</span>
              </div>
              <button onClick={onClose} className="text-xs text-text-muted hover:text-text-muted cursor-pointer">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={msg.from === 'user' ? 'ml-6' : ''}
                  >
                    {msg.from === 'kith' ? (
                      <p className="text-sm text-text-primary leading-relaxed">{msg.text}</p>
                    ) : (
                      <p className="text-sm text-text-secondary leading-relaxed rounded-xl rounded-br-sm px-3 py-2" style={{ backgroundColor: '#E8E2D8' }}>
                        {msg.text}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {messages.length <= 1 && (
                <div className="flex flex-col gap-1.5 mt-4">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-left text-xs text-text-muted/50 hover:text-olive border border-border/40 hover:border-olive/20 rounded-lg px-3 py-2 cursor-pointer transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask Kith..."
                className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
              />
              <button onClick={() => send()} className="text-xs font-medium text-olive hover:text-olive-hover cursor-pointer">→</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
