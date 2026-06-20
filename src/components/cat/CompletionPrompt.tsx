import { Modal } from '../ui/Modal'
import { Cat } from './Cat'

interface CompletionPromptProps {
  visible: boolean
  task: string
  goal: string
  goalColor: string
  onYes: () => void
  onNo: () => void
}

export function CompletionPrompt({ visible, task, goal, goalColor, onYes, onNo }: CompletionPromptProps) {
  return (
    <Modal visible={visible} onClose={onNo}>
      <div className="text-center">
        <div className="mb-6">
          <Cat state="nudge" size={48} />
        </div>

        <p className="text-xs mb-3" style={{ color: goalColor }}>{goal}</p>

        <h2 className="text-xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
          Did you finish?
        </h2>

        <p className="text-sm text-text-secondary mb-8">{task}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onYes}
            className="px-8 py-2.5 rounded-xl text-sm font-medium text-olive bg-olive/8 hover:bg-olive/15 cursor-pointer transition-colors"
          >
            Yes, done
          </button>
          <button
            onClick={onNo}
            className="px-8 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
          >
            Not yet
          </button>
        </div>
      </div>
    </Modal>
  )
}
