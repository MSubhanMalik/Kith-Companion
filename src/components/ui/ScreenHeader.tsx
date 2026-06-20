import { Cat } from '../cat/Cat'
import { FadeIn } from './FadeIn'
import type { CatState } from '../cat/types'
import type { ReactNode } from 'react'

interface ScreenHeaderProps {
  catState?: CatState
  message: string
  right?: ReactNode
}

export function ScreenHeader({ catState = 'idle', message, right }: ScreenHeaderProps) {
  return (
    <FadeIn className="flex items-center gap-3 mb-8" delay={0}>
      <Cat state={catState} size={26} />
      <span className="text-sm text-text-muted">{message}</span>
      {right && <div className="ml-auto flex items-center gap-3">{right}</div>}
    </FadeIn>
  )
}
