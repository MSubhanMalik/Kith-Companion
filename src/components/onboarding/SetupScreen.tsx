import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { Button } from '../ui/Button'

const MOCK_GOALS = [
  { label: 'Earn $10K/month from freelance clients', date: '2026-12-31', color: '#C4745C', private: false, nickname: '' },
  { label: 'Launch startup MVP with 100 paying users', date: '2027-03-15', color: '#7A9A6D', private: false, nickname: '' },
  { label: 'Talk to girls with confidence', date: '2027-01-01', color: '#B08455', private: true, nickname: 'Social' },
]

const MOCK_BLOCKS = [
  { label: 'Work', time: '9:00 AM – 5:00 PM', days: 'Mon–Fri' },
  { label: 'Gym', time: '6:00 PM – 7:00 PM', days: 'Mon–Fri' },
  { label: 'Sleep', time: '11:00 PM – 7:00 AM', days: 'Every day' },
]

interface SetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function SetupScreen({ onNext, onBack }: SetupScreenProps) {
  return (
    <div className="min-h-screen bg-page px-8 py-12">
      <div className="max-w-[32rem] mx-auto">
        <FadeIn y={12}>
          <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ letterSpacing: '-0.02em' }}>
            Two things I need from you.
          </h1>
          <p className="text-sm text-text-secondary mb-12">
            Your goals and the blocks I can't touch. That's it — I'll handle the rest.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} y={10} className="mb-14">
          <SectionLabel className="mb-5">Your goals · ranked by priority</SectionLabel>

          <div className="flex flex-col gap-6">
            {MOCK_GOALS.map((goal, i) => (
              <FadeIn key={i} delay={0.15 + i * 0.06}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 pt-2">
                    <span className="text-lg font-bold text-text-muted">{i + 1}</span>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        defaultValue={goal.label}
                        className="flex-1 text-text-primary font-medium bg-transparent border-b border-border/50 pb-2 focus:outline-none focus:border-olive placeholder:text-text-muted"
                      />
                      <button
                        className={`text-sm cursor-pointer transition-colors shrink-0 ${
                          goal.private ? 'text-olive' : 'text-text-muted/50 hover:text-text-muted'
                        }`}
                        title={goal.private ? 'Private — using nickname' : 'Make private'}
                      >
                        {goal.private ? '🔒' : '🔓'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[0.625rem] text-text-muted">By</span>
                      <input
                        type="date"
                        defaultValue={goal.date}
                        className="text-xs text-text-secondary bg-transparent border-b border-border/40 pb-1 focus:outline-none focus:border-olive"
                      />

                      {goal.private && (
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-[0.625rem] text-olive">shown as</span>
                          <input
                            defaultValue={goal.nickname}
                            placeholder="nickname"
                            className="text-xs text-olive font-medium bg-transparent border-b border-olive/30 pb-1 focus:outline-none focus:border-olive w-20 placeholder:text-olive/30"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.4} y={0}>
              <Button variant="ghost" size="sm" label="+ add goal" />
            </FadeIn>
          </div>
        </FadeIn>

        <FadeIn delay={0.3} y={10} className="mb-14">
          <SectionLabel className="mb-5">Non-negotiables · I won't schedule over these</SectionLabel>

          <div className="flex flex-col gap-3">
            {MOCK_BLOCKS.map((block, i) => (
              <FadeIn key={i} delay={0.35 + i * 0.05} y={6}
                className="flex items-center justify-between border-b border-border/40 pb-3">
                <div>
                  <span className="text-text-primary font-medium">{block.label}</span>
                  <span className="text-xs text-text-muted ml-3">{block.days}</span>
                </div>
                <span className="text-sm text-text-secondary">{block.time}</span>
              </FadeIn>
            ))}

            <FadeIn delay={0.55} y={0}>
              <Button variant="ghost" size="sm" label="+ add block" />
            </FadeIn>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} y={0} className="flex items-center justify-between">
          <Button variant="ghost" size="sm" label="← back" onClick={onBack} />
          <Button variant="primary" onClick={onNext} label="Build my schedule" />
        </FadeIn>
      </div>
    </div>
  )
}
