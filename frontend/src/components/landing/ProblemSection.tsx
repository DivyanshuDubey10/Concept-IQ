export function ProblemSection() {
  return (
    <section
      id="problem"
      className="py-24 md:py-32 px-5 md:px-8 bg-surface/30"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — editorial text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">The problem</p>
            <h2
              id="problem-heading"
              className="text-3xl md:text-4xl font-bold text-text-main leading-tight tracking-tight !mb-6"
              style={{ letterSpacing: '-0.025em' }}
            >
              Getting the answer right isn't the same as understanding.
            </h2>
            <p className="text-text-muted leading-relaxed !mb-0">
              Most learning platforms stop at correct or incorrect. They move you on to the next
              question without asking what caused the mistake — or whether you're ready.
            </p>
          </div>

          {/* Right — contrast panel */}
          <div className="space-y-4">
            {/* Traditional */}
            <div className="p-5 rounded-2xl border border-border/50 bg-background">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">Traditional approach</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-10 rounded-lg bg-text-main/5 border border-border/40 flex items-center px-3">
                  <span className="text-sm text-text-muted">Your answer</span>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-xs font-semibold text-success">
                  Correct ✓
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-10 rounded-lg bg-text-main/5 border border-border/40 flex items-center px-3">
                  <span className="text-sm text-text-muted">Your answer</span>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-lg bg-error/10 border border-error/20 text-xs font-semibold text-error">
                  Incorrect ✗
                </div>
              </div>
              <p className="mt-4 text-xs text-text-muted/60">Next question →</p>
            </div>

            {/* ConceptIQ */}
            <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">ConceptIQ asks</p>
              <div className="space-y-2.5 text-sm text-text-muted">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  What concept caused the mistake?
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Why did the student struggle?
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  What should they practice next?
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  When should they revisit it?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
