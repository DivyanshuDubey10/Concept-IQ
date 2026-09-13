import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Reveal } from './Reveal'

const timeline = [
  { label: 'Today', days: 0, active: true },
  { label: 'Tomorrow', days: 1, active: false },
  { label: '3 days', days: 3, active: false },
  { label: '7 days', days: 7, active: false },
]

const dueItems = [
  { concept: 'Base Cases', topic: 'Recursion', mastery: 32, days: 0 },
  { concept: 'Call Stack', topic: 'Recursion', mastery: 65, days: 1 },
  { concept: 'Memoization', topic: 'Dynamic Programming', mastery: 44, days: 3 },
]

function masteryColor(mastery: number): string {
  if (mastery >= 80) return 'text-success'
  if (mastery >= 50) return 'text-warning'
  return 'text-error'
}

export function RevisionSection() {
  return (
    <section
      id="revision"
      className="py-24 md:py-32 px-5 md:px-8"
      aria-labelledby="revision-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Spaced repetition</p>
            <h2
              id="revision-heading"
              className="text-3xl md:text-4xl font-bold text-text-main tracking-tight leading-tight !mb-5"
              style={{ letterSpacing: '-0.025em' }}
            >
              Remember it when it matters.
            </h2>
            <p className="text-text-muted leading-relaxed !mb-4">
              Learning doesn't stop when the practice session ends. ConceptIQ schedules
              revision based on how well you know each concept, bringing them back at the
              right time — before they fade.
            </p>
            <p className="text-text-muted leading-relaxed !mb-0">
              The stronger your grasp, the longer the interval. The weaker, the sooner
              you'll see it again.
            </p>
          </Reveal>

          {/* Timeline + items */}
          <Reveal delay={100} className="space-y-5">
            {/* Timeline strip */}
            <div className="flex items-center gap-0">
              {timeline.map((t, i) => (
                <div key={t.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2 transition-colors',
                        t.active
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border'
                      )}
                    />
                    <span className={cn(
                      'text-xs font-medium whitespace-nowrap',
                      t.active ? 'text-primary' : 'text-text-muted'
                    )}>
                      {t.label}
                    </span>
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="flex-1 h-px bg-border/50 mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Due items */}
            <div className="space-y-2.5">
              {dueItems.map((item) => (
                <div
                  key={item.concept}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-surface hover:bg-surface-elevated transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-main truncate">{item.concept}</p>
                    <p className="text-xs text-text-muted">{item.topic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('text-sm font-bold', masteryColor(item.mastery))}>
                      {item.mastery}%
                    </p>
                    <p className="text-xs text-text-muted">
                      {item.days === 0 ? 'Due today' : `In ${item.days} day${item.days > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted/40 shrink-0" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
