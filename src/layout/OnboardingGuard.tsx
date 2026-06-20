import { AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import { useOnboardingStore } from '../stores/onboarding'
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen'
import { SetupScreen } from '../components/onboarding/SetupScreen'
import { SchedulePreviewScreen } from '../components/onboarding/SchedulePreviewScreen'

interface OnboardingGuardProps {
  children: ReactNode
  onComplete: () => void
}

export function OnboardingGuard({ children, onComplete }: OnboardingGuardProps) {
  const { isComplete, step, setStep, complete } = useOnboardingStore()

  if (isComplete) {
    return <>{children}</>
  }

  function handleLockIn() {
    complete()
    onComplete()
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'welcome' && <WelcomeScreen key="w" onNext={() => setStep('setup')} />}
      {step === 'setup' && <SetupScreen key="s" onNext={() => setStep('preview')} onBack={() => setStep('welcome')} />}
      {step === 'preview' && <SchedulePreviewScreen key="p" onLockIn={handleLockIn} onBack={() => setStep('setup')} />}
    </AnimatePresence>
  )
}
