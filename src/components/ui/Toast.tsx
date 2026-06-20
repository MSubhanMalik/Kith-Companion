import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  message: string
  type: 'error' | 'success' | 'info'
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = Date.now().toString()
    set({ toasts: [...get().toasts, { id, message, type }] })
    setTimeout(() => get().removeToast(id), 4000)
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) })
  },
}))

const typeStyles = {
  error: 'text-direction',
  success: 'text-connection',
  info: 'text-text-primary',
}

export function ToastContainer() {
  const toasts = useToastStore(s => s.toasts)
  const removeToast = useToastStore(s => s.removeToast)

  return (
    <div className="fixed top-20 right-6 z-[60] flex flex-col gap-2 max-w-[20rem]">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-page border border-border/40 rounded-xl px-4 py-3 shadow-lg cursor-pointer"
            onClick={() => removeToast(toast.id)}
          >
            <p className={`text-sm ${typeStyles[toast.type]}`}>{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
