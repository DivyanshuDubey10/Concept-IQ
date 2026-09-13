import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, TrendingUp, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Reveal } from './Reveal'

type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Result = 'correct' | 'incorrect'

interface Step {
  difficulty: Difficulty
  result: Result
  next: Difficulty
  insight: string
}

const sequence: Step[] = [
  { difficulty: 'Easy',   result: 'correct',   next: 'Medium', insight: 'Solid grasp — raising the bar' },
  { difficulty: 'Medium', result: 'correct',   next: 'Hard',   insight: 'Keeping up well — time to challenge' },
  { difficulty: 'Hard',   result: 'incorrect', next: 'Medium', insight: 'Concept gap found — stepping back' },
  { difficulty: 'Medium', result: 'correct',   next: 'Hard',   insight: 'Recovered — pushing forward again' },
]

const difficultyConfig: Record<Difficulty, { label: string; pill: string; bar: string }> = {
  Easy:   { label: 'Easy',   pill: 'text-success border-success/30 bg-success/10',  bar: 'bg-success' },
  Medium: { label: 'Medium', pill: 'text-warning border-warning/30 bg-warning/10',  bar: 'bg-warning' },
  Hard:   { label: 'Hard',   pill: 'text-error   border-error/30   bg-error/10',    bar: 'bg-error'   },
}

const difficultyLevel: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 }

function DifficultyDots({ active }: { active: Difficulty }) {
  return (
    <div className="flex items-center gap-1">
      {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
        <div
          key={d}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-400',
            difficultyLevel[d] <= difficultyLevel[active]
              ? difficultyConfig[d].bar
              : 'bg-text-main/10'
          )}
        />
      ))}
    </div>
  )
}

export function AdaptiveLearningSection() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % sequence.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  const current = sequence[activeStep]

  return (
    <section
      id="adaptive"
      className="py-24 md:py-32 px-5 md:px-8"
      aria-labelledby="adaptive-heading"
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left — text */}
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
            Adaptive learning
          </p>
          <h2
            id="adaptive-heading"
            className="text-3xl md:text-[2.5rem] font-bold text-text-main tracking-tight leading-tight !mb-5"
            style={{ letterSpacing: '-0.028em' }}
          >
            Every answer changes what comes next.
          </h2>
          <p className="text-text-muted leading-relaxed !mb-6">
            ConceptIQ doesn't move you through a fixed question list. Your
            performance determines what you see next — so you always practice at
            the right level. Not too easy, not too frustrating.
          </p>

          {/* Insight strip */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-elevated border border-border/50">
            <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-text-main !mb-0.5">Right now for you</p>
              <p className="text-xs text-text-muted !mb-0 leading-relaxed">
                {current.insight}
              </p>
            </div>
            <DifficultyDots active={current.next} />
          </div>
        </Reveal>

        {/* Right — animated sequence */}
        <Reveal delay={120}>
          {/* Active card — prominent */}
          <div className="mb-3 p-5 rounded-2xl border border-border bg-surface-elevated shadow-premium">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                Current question
              </span>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg border', difficultyConfig[current.difficulty].pill)}>
                {current.difficulty}
              </span>
            </div>

            {/* Fake question skeleton */}
            <div className="space-y-2 mb-5">
              <div className="h-3 rounded-full bg-text-main/8 w-full" />
              <div className="h-3 rounded-full bg-text-main/8 w-4/5" />
              <div className="h-3 rounded-full bg-text-main/8 w-2/3" />
            </div>

            {/* Result */}
            <div className={cn(
              'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium',
              current.result === 'correct'
                ? 'bg-success/8 border-success/20 text-success'
                : 'bg-error/8 border-error/20 text-error'
            )}>
              {current.result === 'correct'
                ? <CheckCircle2 className="w-4 h-4" />
                : <XCircle className="w-4 h-4" />
              }
              <span>{current.result === 'correct' ? 'Answered correctly' : 'Needs more practice'}</span>
            </div>

            {/* Next difficulty */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-text-muted">Next question difficulty</span>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg border', difficultyConfig[current.next].pill)}>
                {current.next}
              </span>
            </div>
          </div>

          {/* Past steps — compact trail */}
          <div className="space-y-1.5 pl-1">
            {sequence.map((step, i) => {
              const isPast = i < activeStep
              const isCurrent = i === activeStep
              if (isCurrent) return null
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-500',
                    isPast
                      ? 'text-text-muted/60 opacity-60'
                      : 'text-text-muted/25 opacity-25'
                  )}
                >
                  {step.result === 'correct'
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-success/60" />
                    : <XCircle className="w-3.5 h-3.5 text-error/60" />
                  }
                  <span className={cn('shrink-0 font-semibold', difficultyConfig[step.difficulty].pill.split(' ')[0])}>
                    {step.difficulty}
                  </span>
                  <Minus className="w-3 h-3 text-text-muted/30" />
                  <span className={cn('shrink-0 font-semibold', difficultyConfig[step.next].pill.split(' ')[0])}>
                    {step.next}
                  </span>
                  <span className="text-text-muted/40 truncate">{step.insight}</span>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
