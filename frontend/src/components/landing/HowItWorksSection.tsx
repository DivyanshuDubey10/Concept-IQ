import { Reveal } from './Reveal'

const steps = [
  {
    number: '01',
    title: 'Choose',
    description:
      'Pick a topic you want to learn. ConceptIQ organises your curriculum from broad subjects down to individual concepts.',
  },
  {
    number: '02',
    title: 'Diagnose',
    description:
      'Work through an initial set of questions. Your answers reveal which concepts need attention — and which you already understand well.',
  },
  {
    number: '03',
    title: 'Understand',
    description:
      'Get a personalised explanation of the concept that caused the mistake. Contextual, concise, and tied to your specific answer.',
  },
  {
    number: '04',
    title: 'Practice',
    description:
      'Work on questions that target exactly what needs improvement. Not random questions — targeted ones, calibrated to your level.',
  },
  {
    number: '05',
    title: 'Master',
    description:
      'Watch your mastery score move at the concept level. See clearly where you are strong and where you still have room to grow.',
  },
  {
    number: '06',
    title: 'Revisit',
    description:
      'Concepts fade without reinforcement. ConceptIQ schedules spaced repetition to bring important concepts back at the right time.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 px-5 md:px-8 bg-surface/30"
      aria-labelledby="how-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Reveal className="max-w-xl mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            How it works
          </p>
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-bold text-text-main tracking-tight leading-tight !mb-4"
            style={{ letterSpacing: '-0.025em' }}
          >
            Your learning path adapts as you do.
          </h2>
          <p className="text-text-muted leading-relaxed !mb-0">
            Every session builds on the last. ConceptIQ maps where you are and
            adjusts what comes next.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 60}>
              <div className="flex gap-5 group">
                {/* Large number — more visible now */}
                <div className="shrink-0 pt-0.5 w-12 text-right">
                  <span
                    className="text-3xl font-bold tabular-nums leading-none"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)/0.4), hsl(var(--primary)/0.15))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {step.number}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-semibold text-text-main !mb-1.5 group-hover:text-primary transition-colors duration-150">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed !mb-0">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
