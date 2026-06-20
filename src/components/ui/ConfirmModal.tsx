import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed mb-7">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="sm" label={cancelLabel} onClick={onClose} />
        <Button variant={variant} size="sm" label={confirmLabel} onClick={onConfirm} />
      </div>
    </Modal>
  )
}
