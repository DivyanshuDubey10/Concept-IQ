import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface Step {
  difficulty: Difficulty
  result: 'correct' | 'incorrect'
  next: Difficulty
}

const sequence: Step[] = [
  { difficulty: 'Easy', result: 'correct', next: 'Medium' },
  { difficulty: 'Medium', result: 'correct', next: 'Hard' },
  { difficulty: 'Hard', result: 'incorrect', next: 'Medium' },
  { difficulty: 'Medium', result: 'correct', next: 'Hard' },
]

const difficultyColors: Record<Difficulty, string> = {
  Easy: 'text-success border-success/30 bg-success/8',
  Medium: 'text-warning border-warning/30 bg-warning/8',
  Hard: 'text-error border-error/30 bg-error/8',
}

export function AdaptiveLearningSection() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % sequence.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="adaptive"
      className="py-24 md:py-32 px-5 md:px-8 bg-surface/30"
      aria-labelledby="adaptive-heading"
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left — text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Adaptive learning</p>
          <h2
            id="adaptive-heading"
            className="text-3xl md:text-4xl font-bold text-text-main tracking-tight leading-tight !mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            Every answer changes what comes next.
          </h2>
          <p className="text-text-muted leading-relaxed !mb-0">
            ConceptIQ doesn't move you through a fixed question list. Your performance
            determines what you see next — so you always practice at the right level,
            not too easy, not too frustrating.
          </p>
        </div>

        {/* Right — animated sequence */}
        <div className="space-y-2" role="presentation" aria-label="Adaptive difficulty demonstration">
          {sequence.map((step, i) => {
            const isActive = i === activeStep
            const isPast = i < activeStep

            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border transition-all duration-500',
                  isActive
                    ? 'border-border bg-surface-elevated shadow-premium'
                    : isPast
                    ? 'border-border/30 bg-transparent opacity-50'
                    : 'border-border/20 bg-transparent opacity-30'
                )}
              >
                {/* Difficulty badge */}
                <span
                  className={cn(
                    'shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border',
                    difficultyColors[step.difficulty]
                  )}
                >
                  {step.difficulty}
                </span>

                {/* Result icon */}
                {step.result === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-error shrink-0" />
                )}

                <span className="text-sm text-text-muted">
                  {step.result === 'correct' ? 'Answered correctly' : 'Needs more practice'}
                </span>

                {/* Arrow + next */}
                <div className="ml-auto flex items-center gap-1.5 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted/40" />
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-md border',
                      difficultyColors[step.next]
                    )}
                  >
                    {step.next}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
