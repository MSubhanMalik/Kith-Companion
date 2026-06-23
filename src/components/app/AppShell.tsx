import { useState, createContext, useContext, useCallback } from 'react'
import type { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { ChatPanel } from '../chat/ChatPanel'
import { Cat } from '../cat/Cat'
import { motion } from 'framer-motion'
import { useCatStore } from '../../stores/cat'
import { useCatIntelligence } from '../../hooks/useCatIntelligence'
import { useNudgeListener } from '../../hooks/useNudgeListener'

const ChatOpenContext = createContext(false)
const ChatRefreshContext = createContext(0)
export function useChatOpen() { return useContext(ChatOpenContext) }
export function useChatRefresh() { return useContext(ChatRefreshContext) }

interface AppShellProps {
  children: ReactNode
  currentRoute: string
  selectedGoalId?: number | null
  onNavigate: (route: string) => void
}

export function AppShell({ children, currentRoute, selectedGoalId, onNavigate }: AppShellProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatRefresh, setChatRefresh] = useState(0)
  const bumpChatRefresh = useCallback(() => setChatRefresh(c => c + 1), [])
  const catState = useCatStore(s => s.state)
  useCatIntelligence()
  useNudgeListener()

  const pageContext = {
    screen: currentRoute,
    goalId: currentRoute === 'goal' ? selectedGoalId : undefined,
  }

  return (
    <ChatOpenContext.Provider value={chatOpen}>
    <ChatRefreshContext.Provider value={chatRefresh}>
    <div className="min-h-screen bg-page flex flex-col">
      <div className="h-16 shrink-0" />
      <NavBar currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className={`flex-1 w-full mx-auto px-8 py-6 transition-all duration-300 ${chatOpen ? 'max-w-3xl mr-[22rem]' : 'max-w-4xl'}`}>
        {children}
      </main>

      <motion.button
        className={`fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${chatOpen ? 'bg-olive/8' : ''}`}
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Cat state={chatOpen ? 'listening' : catState} size={28} />
      </motion.button>

      <ChatPanel visible={chatOpen} onClose={() => setChatOpen(false)} onMessageComplete={bumpChatRefresh} pageContext={pageContext} />
    </div>
    </ChatRefreshContext.Provider>
    </ChatOpenContext.Provider>
  )
}
