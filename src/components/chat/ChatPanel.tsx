import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from '../cat/Cat'
import { chatService } from '../../services/ChatService'
import { LoadingWords } from '../ui/LoadingWords'

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
  onMessageComplete?: () => void
  pageContext?: { screen: string; goalId?: number | null }
}

export function ChatPanel({ visible, onClose, onMessageComplete, pageContext }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'kith', text: 'What do you need?' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  async function handleFileSelect(file: File) {
    try {
      if (file.name.match(/\.(xlsx|xls)$/i)) {
        const XLSX = await import('xlsx-js-style')
        const buffer = await file.arrayBuffer()
        const wb = XLSX.read(buffer, { type: 'array' })
        const lines: string[] = []
        for (const sheetName of wb.SheetNames) {
          const ws = wb.Sheets[sheetName]
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][]
          lines.push(`Sheet: ${sheetName}`)
          for (const row of rows.slice(0, 50)) {
            lines.push(row.filter(Boolean).join(' | '))
          }
          if (rows.length > 50) lines.push(`... (${rows.length - 50} more rows)`)
          lines.push('')
        }
        setAttachedFile({ name: file.name, content: lines.join('\n').slice(0, 8000) })
      } else {
        const text = await file.text()
        setAttachedFile({ name: file.name, content: text.slice(0, 8000) })
      }
    } catch {}
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  async function send(text?: string) {
    const msg = text || input.trim()
    if ((!msg && !attachedFile) || sending) return

    let fullMessage = msg
    if (attachedFile) {
      fullMessage = `${msg ? msg + '\n\n' : ''}[File: ${attachedFile.name}]\n${attachedFile.content}`
    }

    const displayText = msg || `Attached: ${attachedFile?.name}`
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: displayText }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setAttachedFile(null)
    setSending(true)

    try {
      const reply = await chatService.send(fullMessage, pageContext) as { id: number; content: string }
      const kithMsg: Message = {
        id: String(reply.id),
        from: 'kith',
        text: reply.content,
      }
      setMessages(prev => [...prev, kithMsg])
      onMessageComplete?.()
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
                {sending && <LoadingWords />}
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

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`transition-colors rounded-lg ${dragOver ? 'bg-olive/5 ring-1 ring-olive/20' : ''}`}
            >
              {attachedFile && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[0.625rem] text-olive bg-olive/10 px-2 py-0.5 rounded">{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="text-[0.625rem] text-text-muted hover:text-direction cursor-pointer">✕</button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="text-text-muted/40 hover:text-olive cursor-pointer shrink-0" title="Attach file">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8.5l-5.5 5.5a3.5 3.5 0 01-5-5L9 3.5a2 2 0 013 3L6.5 12a.5.5 0 01-1-1L11 5.5a1 1 0 00-1.5-1.5L4 9.5a2.5 2.5 0 003.5 3.5L13 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".txt,.md,.csv,.json,.xlsx,.xls,.pdf,.html"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = '' }}
                />
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={attachedFile ? 'Add a message or send...' : 'Ask Kith...'}
                  className="flex-1 text-sm text-text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted/50"
                />
                <button onClick={() => send()} className="text-xs font-medium text-olive hover:text-olive-hover cursor-pointer">→</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
