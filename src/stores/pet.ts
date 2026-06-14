import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PetType = 'cat' | 'robot' | 'avatar' | 'boss'

const PET_ORDER: PetType[] = ['cat', 'robot', 'avatar', 'boss']

interface PetStore {
  pet: PetType
  toggle: () => void
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      pet: 'cat',
      toggle: () => set((s) => {
        const idx = PET_ORDER.indexOf(s.pet)
        return { pet: PET_ORDER[(idx + 1) % PET_ORDER.length] }
      }),
    }),
    { name: 'kith-pet' }
  )
)
