export type CatState =
  | 'idle'
  | 'sleeping'
  | 'alert'
  | 'thinking'
  | 'happy'
  | 'nudge'
  | 'delivering'
  | 'listening'
  | 'eating'
  | 'disgusted'
  | 'hungry'

export interface CatProps {
  state: CatState
  size?: number
}

export interface CatPartProps {
  state: CatState
}
