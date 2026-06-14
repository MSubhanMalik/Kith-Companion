import { useState, useRef, useEffect, useCallback } from 'react'
import { Cat } from './components/cat/Cat'
import { Robot } from './components/robot/Robot'
import { Avatar } from './components/avatar/Avatar'
import { Boss } from './components/boss/Boss'
import { MessageWindow } from './MessageWindow'
import type { BubbleType } from './components/cat/CatBubble'
import { useCatStore } from './stores/cat'
import { usePetStore } from './stores/pet'
import { playMeow, playNom, playDisgust, playPurr } from './lib/sounds'


declare global {
  interface Window {
    electronAPI?: {
      showMessage: (data: Record<string, unknown>) => void
      hideMessage: () => void
      onMessageAction: (cb: (action: string) => void) => void
    }
  }
}

const READABLE_EXTENSIONS = new Set([
  'md', 'txt', 'pdf', 'doc', 'docx', 'rtf', 'tex', 'csv', 'json',
  'html', 'htm', 'xml', 'epub', 'odt', 'pages', 'log', 'rst', 'adoc',
])

function getExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

function isReadableFile(filename: string): boolean {
  return READABLE_EXTENSIONS.has(getExtension(filename))
}

const EMOTES: Array<{ emoji: string; text?: string }> = [
  { emoji: '🍕', text: 'feed me' },
  { emoji: '📄', text: 'got docs?' },
  { emoji: '🥺' },
  { emoji: '📚', text: 'hungry' },
  { emoji: '😿' },
  { emoji: '🧠', text: 'need food' },
  { emoji: '👀' },
  { emoji: '💤', text: 'bored...' },
]

const DEMO_BUBBLES: Array<{ type: BubbleType; label: string; message: string; primary: string; secondary: string }> = [
  {
    type: 'hook',
    label: 'I noticed something',
    message: 'This paper challenges what you believed last week about sparse firing.',
    primary: 'Show me',
    secondary: 'Later',
  },
  {
    type: 'connection',
    label: 'these connect',
    message: "This is the same idea as your energy-efficiency note from 3 days ago — opposite angle.",
    primary: 'See link',
    secondary: 'Dismiss',
  },
  {
    type: 'fetch',
    label: 'I found the answer you were missing',
    message: 'Backprop-free learning in SNNs — answers your April question.',
    primary: 'Read together',
    secondary: 'Save for later',
  },
  {
    type: 'direction',
    label: 'just checking in',
    message: 'Your last few reads have been about transformers, not neuromorphic. Is this a detour, or are we changing course?',
    primary: 'Just a detour',
    secondary: 'Changing course',
  },
]

function getRoute() {
  return window.location.hash
}

function PetApp() {
  const { pet, toggle } = usePetStore()
  const { state, setState } = useCatStore()
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [bubbleIndex, setBubbleIndex] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const didDrag = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const prevState = useRef(state)
  const reactionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    window.electronAPI?.onMessageAction((action) => {
      setBubbleVisible(false)
      window.electronAPI?.hideMessage()
      setState('idle')
      console.log('action:', action)
    })
  }, [setState])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      didDrag.current = false
      dragStart.current = { x: e.screenX, y: e.screenY }
      offset.current = { x: e.screenX - window.screenX, y: e.screenY - window.screenY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = Math.abs(e.screenX - dragStart.current.x)
      const dy = Math.abs(e.screenY - dragStart.current.y)
      if (dx > 3 || dy > 3) didDrag.current = true
      window.moveTo(e.screenX - offset.current.x, e.screenY - offset.current.y)
    }

    const onMouseUp = () => {
      isDragging.current = false
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const reactThenIdle = useCallback((reactionState: 'eating' | 'disgusted', duration: number) => {
    setState(reactionState)
    if (reactionTimeout.current) clearTimeout(reactionTimeout.current)
    reactionTimeout.current = setTimeout(() => {
      setState('idle')
    }, duration)
  }, [setState])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dragOver) {
      setDragOver(true)
      setBubbleVisible(false)
      window.electronAPI?.hideMessage()
      setState('eating')
    }
  }, [dragOver, setState])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    setState('idle')
  }, [setState])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.electronAPI?.hideMessage()

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) {
      setDragOver(false)
      reactThenIdle('disgusted', 2000)
      return
    }

    const hasReadable = files.some((f) => isReadableFile(f.name))
    setDragOver(false)
    if (hasReadable) {
      playNom(pet)
      reactThenIdle('eating', 2000)
    } else {
      playDisgust(pet)
      reactThenIdle('disgusted', 2000)
    }
  }, [reactThenIdle])

  useEffect(() => {
    const timer = setInterval(() => {
      if (bubbleVisible || dragOver || state === 'eating' || state === 'disgusted' || state === 'hungry') return
      const pick = EMOTES[Math.floor(Math.random() * EMOTES.length)]
      setState('hungry')
      playMeow(pet)
      window.electronAPI?.showMessage({ kind: 'emote', emoji: pick.emoji, emoteText: pick.text })

      setTimeout(() => {
        window.electronAPI?.hideMessage()
        setState('idle')
      }, 3000)
    }, 60000)

    return () => clearInterval(timer)
  }, [bubbleVisible, dragOver, state, setState])

  const handleClick = useCallback(() => {
    if (didDrag.current) return
    if (state === 'eating' || state === 'disgusted') return

    if (state === 'hungry') {
      window.electronAPI?.hideMessage()
      setState('idle')
      return
    }

    if (bubbleVisible) {
      setBubbleVisible(false)
      window.electronAPI?.hideMessage()
      setState('idle')
    } else {
      const idx = (bubbleIndex + 1) % DEMO_BUBBLES.length
      setBubbleIndex(idx)
      setBubbleVisible(true)
      setState('alert')
      const b = DEMO_BUBBLES[idx]
      window.electronAPI?.showMessage({
        kind: 'bubble',
        type: b.type,
        label: b.label,
        message: b.message,
        primaryAction: b.primary,
        secondaryAction: b.secondary,
      })
    }
  }, [bubbleVisible, setState, state, bubbleIndex])

  const handleMouseEnter = () => {
    if (bubbleVisible || state === 'eating' || state === 'disgusted' || state === 'hungry') return
    prevState.current = state
    setState('happy')
    playPurr(pet)
  }

  const handleMouseLeave = () => {
    if (bubbleVisible || state === 'eating' || state === 'disgusted' || state === 'hungry') return
    setState(prevState.current === 'happy' ? 'idle' : prevState.current)
  }

  return (
    <div
      className="flex items-center justify-center w-screen h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onContextMenu={(e) => { e.preventDefault(); toggle() }}
      style={{ cursor: 'url(/paw.svg) 16 16, pointer' }}
    >
      {pet === 'cat' && <Cat state={state} size={90} />}
        {pet === 'robot' && <Robot state={state} size={90} />}
        {pet === 'avatar' && <Avatar state={state} size={90} />}
        {pet === 'boss' && <Boss state={state} size={90} />}
    </div>
  )
}

function App() {
  const route = getRoute()
  if (route === '#message') return <MessageWindow />
  if (route === '#pet' || route === '#cat') return <PetApp />
  return <PetApp />
}

export default App
