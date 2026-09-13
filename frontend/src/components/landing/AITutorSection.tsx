import { Sparkles, ChevronRight } from 'lucide-react'

export function AITutorSection() {
  return (
    <section
      id="ai-tutor"
      className="py-24 md:py-32 px-5 md:px-8"
      aria-labelledby="tutor-heading"
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left — demo conversation */}
        <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden shadow-premium">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-background/50">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main leading-none">ConceptIQ Tutor</p>
              <p className="text-xs text-text-muted mt-0.5">Topic: Recursion · Base Cases</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
              <span className="text-xs text-text-muted">Active</span>
            </div>
          </div>

          {/* Conversation */}
          <div className="p-5 space-y-4">
            {/* Student */}
            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[75%] bg-primary/10 border border-primary/15 rounded-2xl rounded-br-sm px-4 py-3">
                <p className="text-sm text-text-main leading-relaxed !mb-0">
                  I don't understand why the base case stops the recursion.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-text-main/10 border border-border/50 flex items-center justify-center text-xs font-bold text-text-muted shrink-0">
                S
              </div>
            </div>

            {/* Tutor */}
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="max-w-[80%] bg-surface-elevated border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 space-y-2">
                <p className="text-sm text-text-muted leading-relaxed !mb-0">
                  Think of the base case as the point where the function finally has enough
                  information to{' '}
                  <span className="text-text-main font-medium">stop calling itself</span> and
                  return a concrete value.
                </p>
                <p className="text-sm text-text-muted leading-relaxed !mb-0">
                  Without a base case, each call would create another call — and the call stack
                  would grow until memory runs out.
                </p>
              </div>
            </div>
          </div>

          {/* Context bar */}
          <div className="px-5 pb-5">
            <div className="p-3.5 rounded-xl bg-background border border-border/40 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-muted mb-0.5">Related concept</p>
                <p className="text-sm font-medium text-text-main truncate">Recursive Calls</p>
              </div>
              <div className="h-8 w-px bg-border/40 shrink-0" />
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-text-muted mb-0.5">Mastery</p>
                <p className="text-sm font-bold text-warning">65%</p>
              </div>
              <div className="h-8 w-px bg-border/40 shrink-0" />
              <div className="shrink-0">
                <p className="text-xs font-semibold text-text-muted mb-0.5">Next</p>
                <p className="text-xs font-medium text-primary flex items-center gap-0.5">
                  Concept check <ChevronRight className="w-3 h-3" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — text */}
        <div className="md:pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">AI Tutor</p>
          <h2
            id="tutor-heading"
            className="text-3xl md:text-4xl font-bold text-text-main tracking-tight leading-tight !mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            Learning in context, not in a vacuum.
          </h2>
          <p className="text-text-muted leading-relaxed !mb-4">
            ConceptIQ's tutor isn't a general chatbot. It knows your current topic, the concept
            you're working on, your mastery level, and what caused your last mistake.
          </p>
          <p className="text-text-muted leading-relaxed !mb-0">
            Every explanation is grounded in where you are in the learning process — so the
            help you get is relevant, not generic.
          </p>
        </div>
      </div>
    </section>
  )
}
