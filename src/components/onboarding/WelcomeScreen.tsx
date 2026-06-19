import { motion } from 'framer-motion'
import { Cat } from '../cat/Cat'
import { Button } from '../ui/Button'

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-8">
      <motion.div
        className="flex flex-col items-center text-center"
        style={{ maxWidth: '26rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mb-12">
          <Cat state="idle" size={80} />
        </div>

        <h1
          className="text-3xl font-bold text-text-primary mb-4"
          style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}
        >
          Tell me your goals.
          <br />
          I'll build your week.
        </h1>

        <p className="text-text-secondary mb-12 leading-relaxed">
          You set the destination. I handle the schedule,
          the reminders, and the gentle nudges.
        </p>

        <Button variant="primary" size="lg" onClick={onNext} label="Let's go" />
      </motion.div>
    </div>
  )
}
