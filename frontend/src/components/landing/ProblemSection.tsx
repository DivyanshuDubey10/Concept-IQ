import { ArrowRight, X, Check } from 'lucide-react'
import { Reveal } from './Reveal'

const traditionalItems = [
  { answer: 'It raises an error and crashes', verdict: 'Incorrect' as const },
  { answer: 'The function returns a value', verdict: 'Correct' as const },
]

const conceptiqItems = [
  'What concept caused this mistake?',
  'Why did the student struggle here?',
  'What should they practice next?',
  'When should they revisit it?',
]

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="py-24 md:py-32 px-5 md:px-8"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left — editorial text */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
              The problem
            </p>
            <h2
              id="problem-heading"
              className="text-3xl md:text-[2.5rem] font-bold text-text-main leading-tight !mb-6"
              style={{ letterSpacing: '-0.028em' }}
            >
              Getting the answer right isn't the same as understanding.
            </h2>
            <p className="text-text-muted leading-relaxed !mb-8">
              Most learning platforms stop at correct or incorrect. They move you on
              to the next question without asking what caused the mistake — or whether
              you're actually ready.
            </p>

            {/* Callout */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/6 border border-primary/15">
              <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-text-muted !mb-0 leading-relaxed">
                ConceptIQ turns every answer — right or wrong — into a learning
                signal that shapes your entire session.
              </p>
            </div>
          </Reveal>

          {/* Right — contrast cards */}
          <Reveal delay={120} className="space-y-4">

            {/* Traditional — deliberately flat, greyed out */}
            <div className="p-5 rounded-2xl border border-border/40 bg-surface/60">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted/60 mb-4">
                Traditional approach
              </p>
              <div className="space-y-2">
                {traditionalItems.map((item) => (
                  <div key={item.verdict} className="flex items-center gap-3">
                    <div className="flex-1 h-10 rounded-lg bg-background border border-border/50 flex items-center px-3">
                      <span className="text-sm text-text-muted/60">{item.answer}</span>
                    </div>
                    <div
                      className={
                        item.verdict === 'Correct'
                          ? 'shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success/10 border border-success/20 text-xs font-semibold text-success'
                          : 'shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-error/10 border border-error/20 text-xs font-semibold text-error'
                      }
                    >
                      {item.verdict === 'Correct'
                        ? <Check className="w-3 h-3" />
                        : <X className="w-3 h-3" />
                      }
                      {item.verdict}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-muted/40 flex items-center gap-1">
                Next question <ArrowRight className="w-3 h-3" />
              </p>
            </div>

            {/* ConceptIQ — elevated, vibrant */}
            <div className="p-5 rounded-2xl border border-primary/25 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.1),0_8px_24px_-4px_hsl(var(--primary)/0.12)]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                  ConceptIQ asks
                </p>
                <span className="text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                  After every answer
                </span>
              </div>
              <div className="space-y-2.5">
                {conceptiqItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </Reveal>
        </div>
      </div>
    </section>
  )
}
