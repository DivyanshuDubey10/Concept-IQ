import { Progress } from '../ui/progress'

const concepts = [
  { name: 'Recursive Calls', mastery: 78, color: 'bg-success' },
  { name: 'Call Stack', mastery: 65, color: 'bg-primary' },
  { name: 'Base Cases', mastery: 32, color: 'bg-warning' },
]

function MasteryBar({ name, mastery, color }: { name: string; mastery: number; color: string }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-main">{name}</span>
        <span className="text-sm font-bold text-text-muted tabular-nums">{mastery}%</span>
      </div>
      <Progress
        value={mastery}
        className="h-2 bg-background"
        indicatorClassName={color}
      />
    </div>
  )
}

export function MasterySection() {
  return (
    <section
      id="mastery"
      className="py-24 md:py-32 px-5 md:px-8 bg-surface/30"
      aria-labelledby="mastery-heading"
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left — text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Concept mastery</p>
          <h2
            id="mastery-heading"
            className="text-3xl md:text-4xl font-bold text-text-main tracking-tight leading-tight !mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            See what you actually understand.
          </h2>
          <p className="text-text-muted leading-relaxed !mb-4">
            Instead of reducing a topic to a single score, ConceptIQ shows where your
            understanding is strong and where it still needs work.
          </p>
          <p className="text-text-muted leading-relaxed !mb-0">
            Each topic is broken down to its constituent concepts. You see progress at
            that level — not as an average that hides the details.
          </p>
        </div>

        {/* Right — mastery visualization */}
        <div className="rounded-2xl border border-border/60 bg-surface shadow-premium overflow-hidden">
          {/* Topic header */}
          <div className="px-6 py-5 border-b border-border/40 bg-background/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Topic</p>
                <h3 className="text-lg font-semibold text-text-main !mb-0">Recursion</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted mb-0.5">Overall</p>
                <p className="text-2xl font-bold text-text-main tabular-nums">58%</p>
              </div>
            </div>
            {/* Overall bar */}
            <div className="mt-3 w-full h-1.5 rounded-full bg-border/50 overflow-hidden">
              <div className="h-full w-[58%] bg-primary rounded-full" />
            </div>
          </div>

          {/* Concepts */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted !mb-0">Concepts</p>
            {concepts.map((c) => (
              <MasteryBar key={c.name} {...c} />
            ))}
          </div>

          {/* Footer insight */}
          <div className="px-6 pb-6">
            <div className="p-3.5 rounded-xl bg-warning/8 border border-warning/20">
              <p className="text-xs text-warning font-medium !mb-0">
                📌 <strong>Base Cases</strong> needs attention — start here in your next session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
