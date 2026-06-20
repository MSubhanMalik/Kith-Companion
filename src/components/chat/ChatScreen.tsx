import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import { Cat } from '../cat/Cat'

interface Message {
  id: string
  from: 'user' | 'kith'
  text: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', from: 'kith', text: 'Hey. What do you need?' },
]

const SUGGESTIONS = [
  'Reschedule my week',
  'Break down "Launch MVP" into tasks',
  'What should I focus on today?',
  'Move all freelancing tasks to evening',
]

export function ChatScreen({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  function send() {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const responses: Record<string, string> = {
        'reschedule': 'I looked at your week. Thursday is heavy — 2 deep tasks back to back. I can move "Test payment flow" to Friday morning. Want me to do that?',
        'break': 'For "Launch MVP", here\'s what I\'d suggest:\n\n1. Build auth endpoints (Mon 9 PM, 2h)\n2. Build session management (Tue 9 PM, 2h)\n3. Stripe checkout flow (Wed 9 PM, 2h)\n4. Test payment e2e (Thu 9 PM, 2h)\n5. Fix bugs + deploy (Sat 10 AM, 3h)\n\nWant me to schedule these?',
        'focus': 'You have 2 tasks left today:\n\n1. Stripe checkout (Startup) — 47 min left\n2. LinkedIn post — scheduled at 11:30\n\nFreelancing is your #1 goal and it\'s done for today. Startup needs this checkout flow to stay on pace. Focus here.',
        'move': 'Done. All freelancing tasks moved to 5:30–7:30 PM slots across the week. Your mornings are now free. Want to see the updated schedule?',
      }

      const key = Object.keys(responses).find(k => userMsg.text.toLowerCase().includes(k))
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'kith',
        text: key ? responses[key] : 'Got it. Let me think about that... I\'d suggest looking at your goal priorities first. Your freelancing is on track but startup is behind by 4 hours. Want me to rebalance?',
      }
      setMessages(prev => [...prev, reply])
    }, 800)
  }

  return (
    <PageTransition>
      <div className="pt-6 pb-4 flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
        <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Cat state="listening" size={26} />
          <span className="text-sm text-text-muted">Ask me anything about your goals and schedule</span>
          <button onClick={onBack} className="text-xs text-text-muted/30 hover:text-text-muted ml-auto cursor-pointer">✕</button>
        </motion.div>

        <div className="flex-1 overflow-y-auto mb-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] ${msg.from === 'user' ? 'ml-auto' : ''}`}
              >
                {msg.from === 'kith' && (
                  <div className="flex items-start gap-2.5">
                    <Cat state="idle" size={18} />
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                )}
                {msg.from === 'user' && (
                  <p className="text-sm text-text-secondary leading-relaxed rounded-2xl rounded-br-sm px-4 py-2.5" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                    {msg.text}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {messages.length <= 1 && (
            <motion.div className="flex flex-wrap gap-2 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); setTimeout(() => { setInput(s); send() }, 0) }}
                  className="text-xs text-text-muted/50 hover:text-olive border border-border/20 hover:border-olive/30 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Kith..."
            className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/30 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/25"
          />
          <button onClick={send} className="text-xs font-medium text-olive hover:text-olive-hover cursor-pointer">Send</button>
        </div>
      </div>
    </PageTransition>
  )
}
