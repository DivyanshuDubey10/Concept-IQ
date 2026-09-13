import { cn } from '../../lib/utils'

const steps = [
  {
    number: '01',
    title: 'Choose',
    description: 'Pick a topic you want to learn. ConceptIQ organises your curriculum from broad subjects down to individual concepts.',
  },
  {
    number: '02',
    title: 'Diagnose',
    description: 'Work through an initial set of questions. Your answers reveal which concepts need attention — and which you already understand well.',
  },
  {
    number: '03',
    title: 'Understand',
    description: 'Get a personalised explanation of the concept that caused the mistake. Contextual, concise, and tied to your specific answer.',
  },
  {
    number: '04',
    title: 'Practice',
    description: 'Work on questions that target exactly what needs improvement. Not random questions — targeted ones, calibrated to your level.',
  },
  {
    number: '05',
    title: 'Master',
    description: 'Watch your mastery score move at the concept level. See clearly where you are strong and where you still have room to grow.',
  },
  {
    number: '06',
    title: 'Revisit',
    description: 'Concepts fade without reinforcement. ConceptIQ schedules spaced repetition to bring important concepts back at the right time.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 px-5 md:px-8"
      aria-labelledby="how-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">How it works</p>
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-bold text-text-main tracking-tight leading-tight !mb-4"
            style={{ letterSpacing: '-0.025em' }}
          >
            Your learning path adapts as you do.
          </h2>
          <p className="text-text-muted leading-relaxed !mb-0">
            Every session builds on the last. ConceptIQ maps where you are and adjusts what comes next.
          </p>
        </div>

        {/* Steps — vertical timeline on mobile, two-column grid on desktop */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px bg-gradient-to-b from-border/0 via-border/60 to-border/0"
            aria-hidden="true"
          />

          <div className="space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={step.number}
                  className={cn(
                    'relative grid md:grid-cols-2 gap-0 md:gap-12 items-center',
                    'pb-10 md:pb-0'
                  )}
                >
                  {/* Left content (even indices on desktop) */}
                  <div
                    className={cn(
                      'md:py-8',
                      isLeft ? 'md:text-right md:pr-8' : 'md:order-2 md:text-left md:pl-8'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-3 mb-2',
                        isLeft ? 'md:justify-end' : 'md:justify-start'
                      )}
                    >
                      <span className="text-4xl md:text-5xl font-bold text-text-main/8 tabular-nums leading-none">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-text-main !mb-0">{step.title}</h3>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xs !mb-0 md:ml-auto md:mr-0">
                      {step.description}
                    </p>
                  </div>

                  {/* Centre dot (desktop) */}
                  <div
                    className={cn(
                      'hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center',
                      'w-3 h-3 rounded-full bg-background border-2 border-primary z-10'
                    )}
                    style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
                    aria-hidden="true"
                  />

                  {/* Placeholder for the other column */}
                  <div className={cn('hidden md:block', isLeft ? 'md:order-2' : '')} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
