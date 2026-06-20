import { motion, AnimatePresence } from 'framer-motion'

interface CatEmoteProps {
  visible: boolean
  emoji: string
  text?: string
}

export function CatEmote({ visible, emoji, text }: CatEmoteProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute -top-2 left-1/2"
          initial={{ opacity: 0, y: 8, scale: 0.3 }}
          animate={{
            opacity: 1,
            y: [0, -6, -3],
            scale: 1,
            transition: {
              y: { duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 500, damping: 15 },
            },
          }}
          exit={{ opacity: 0, y: -12, scale: 0.5, transition: { duration: 0.3 } }}
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className={`flex items-center gap-1 ${text ? 'px-2 py-1' : 'p-1'} rounded-full bg-white/92 backdrop-blur-sm shadow-md whitespace-nowrap`}>
            <span className="text-base leading-none">{emoji}</span>
            {text && (
              <span className="text-[0.5625rem] font-semibold text-text-secondary font-sans">
                {text}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
