import { create } from 'zustand'
import type { CatState } from '../components/cat/types'

interface CatStore {
  state: CatState
  setState: (state: CatState) => void
}

export const useCatStore = create<CatStore>((set) => ({
  state: 'idle',
  setState: (state) => set({ state }),
}))
