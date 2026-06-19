import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OnboardingStep } from '../types'

interface OnboardingStore {
  step: OnboardingStep
  isComplete: boolean
  setStep: (step: OnboardingStep) => void
  complete: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      step: 'welcome',
      isComplete: false,

      setStep: (step) => set({ step }),

      complete: () => set({ isComplete: true }),

      reset: () => set({ step: 'welcome', isComplete: false }),
    }),
    { name: 'kith-onboarding' }
  )
)
