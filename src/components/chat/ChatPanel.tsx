import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from '../cat/Cat'
import { chatService } from '../../services/ChatService'

interface Message {
  id: string
  from: 'user' | 'kith'
  text: string
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/^[-*]\s/gm, '• ')
    .replace(/`(.*?)`/g, '$1')
}

const SUGGESTIONS = [
  'Reschedule my week',
  'Break down a new goal',
  'What should I focus on?',
]

interface ChatPanelProps {
  visible: boolean
  onClose: () => void
  pageContext?: { screen: string; goalId?: number | null }
}

export function ChatPanel({ visible, onClose, pageContext }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'kith', text: 'What do you need?' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible && !historyLoaded) {
      loadHistory()
    }
  }, [visible])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending])

  async function loadHistory() {
    try {
      const data = await chatService.getHistory() as Array<{ id: number; role: string; content: string }>
      if (data && data.length > 0) {
        const mapped: Message[] = data.map(m => ({
          id: String(m.id),
          from: m.role === 'user' ? 'user' as const : 'kith' as const,
          text: m.content,
        }))
        setMessages(mapped)
      }
      setHistoryLoaded(true)
    } catch {
      setHistoryLoaded(true)
    }
  }

  async function send(text?: string) {
    const msg = text || input.trim()
    if (!msg || sending) return

    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const reply = await chatService.send(msg, pageContext) as { id: number; content: string }
      const kithMsg: Message = {
        id: String(reply.id),
        from: 'kith',
        text: reply.content,
      }
      setMessages(prev => [...prev, kithMsg])
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), from: 'kith', text: 'Something went wrong. Try again.' }])
    }
    setSending(false)
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
          <div className="flex-1 flex flex-col bg-page border-l border-border/40 px-5 py-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Cat state="listening" size={20} />
                <span className="text-xs text-text-muted">Kith</span>
              </div>
              <button onClick={onClose} className="text-xs text-text-muted hover:text-text-muted cursor-pointer">✕</button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 min-h-0">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={msg.from === 'user' ? 'ml-6' : ''}
                  >
                    {msg.from === 'kith' ? (
                      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{stripMarkdown(msg.text)}</p>
                    ) : (
                      <p className="text-sm text-text-secondary leading-relaxed rounded-xl rounded-br-sm px-3 py-2" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                        {msg.text}
                      </p>
                    )}
                  </motion.div>
                ))}
                {sending && (
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-olive/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                )}
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
