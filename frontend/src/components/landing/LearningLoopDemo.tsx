import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, XCircle, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/utils'

// ─── State Machine ───────────────────────────────────────────────────────────
type Stage =
  | 'question'
  | 'wrong-answer'
  | 'concept-identified'
  | 'explanation'
  | 'practice'
  | 'mastery-update'

interface StageConfig {
  stage: Stage
  duration: number // ms before auto-advancing
}

const STAGES: StageConfig[] = [
  { stage: 'question', duration: 3200 },
  { stage: 'wrong-answer', duration: 2000 },
  { stage: 'concept-identified', duration: 2400 },
  { stage: 'explanation', duration: 3600 },
  { stage: 'practice', duration: 2800 },
  { stage: 'mastery-update', duration: 3000 },
]

// ─── Sub-components ──────────────────────────────────────────────────────────
function DemoShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-surface rounded-2xl border border-border/60 shadow-premium overflow-hidden', className)}>
      {/* Fake browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/40 bg-background/50">
        <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        <div className="flex-1 mx-3 h-5 rounded bg-text-main/5 border border-border/40 flex items-center justify-center">
          <span className="text-[10px] text-text-muted/50 font-mono">conceptiq.app</span>
        </div>
      </div>
      <div className="p-6 md:p-8 min-h-[320px] flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

function Fade({ visible, children, className }: { visible: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'transition-all duration-500 w-full',
        visible
          ? 'opacity-100 translate-y-0 relative'
          : 'opacity-0 translate-y-3 absolute inset-0 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Stages ──────────────────────────────────────────────────────────────────
const options = [
  { id: 'a', text: 'It raises an error and the program crashes' },
  { id: 'b', text: 'The function returns and the call stack unwinds', correct: true },
  { id: 'c', text: 'The function calls itself one more time' },
  { id: 'd', text: 'Nothing happens; the recursion pauses' },
]

function QuestionStage({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="w-full max-w-xl space-y-5">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Question 3 of 8</span>
        <h3 className="mt-2 text-lg md:text-xl font-semibold text-text-main leading-snug">
          What happens when a recursive function reaches its base case?
        </h3>
      </div>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150',
              selectedId === opt.id
                ? 'border-primary bg-primary/10 text-text-main'
                : 'border-border/50 bg-background/50 text-text-muted hover:border-border hover:text-text-main hover:bg-text-main/5'
            )}
          >
            <span className="font-semibold text-text-muted mr-2">{opt.id.toUpperCase()}.</span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}

function WrongAnswerStage() {
  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-error/8 border border-error/20">
        <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-main">Not quite right</p>
          <p className="text-sm text-text-muted mt-0.5">
            You selected: "It raises an error and the program crashes"
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-text-muted">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-xs font-medium">Analysing your response…</span>
        <div className="h-px flex-1 bg-border/40" />
      </div>
      <div className="flex gap-2">
        {['topic context', 'answer pattern', 'weak signal'].map((label, i) => (
          <div
            key={label}
            className="flex-1 h-1.5 rounded-full bg-primary/20 overflow-hidden"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="h-full bg-primary rounded-full animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ConceptIdentifiedStage() {
  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Concept identified</span>
      </div>
      <div className="p-5 rounded-xl bg-surface-elevated border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-text-main text-lg">Base Cases</span>
          <span className="text-2xl font-bold text-warning">32%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-background overflow-hidden">
          <div className="h-full w-[32%] bg-warning rounded-full" />
        </div>
        <p className="mt-3 text-sm text-text-muted">
          Your current mastery of this concept needs attention.
        </p>
      </div>
      <p className="text-sm font-medium text-primary flex items-center gap-1.5">
        Let's strengthen this concept <ChevronRight className="w-4 h-4" />
      </p>
    </div>
  )
}

function ExplanationStage() {
  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-text-main">ConceptIQ Tutor</span>
      </div>
      <div className="p-4 rounded-xl bg-surface-elevated border border-border/50 text-sm text-text-muted leading-relaxed">
        Think of the <span className="text-text-main font-medium">base case</span> as the point where the
        function finally has enough information to{' '}
        <span className="text-primary font-medium">stop calling itself</span> and return
        a concrete value. Without it, the function would recurse infinitely—the call stack
        keeps growing until memory runs out.
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['Base Case', 'Call Stack', 'Return Value'].map((concept) => (
          <div
            key={concept}
            className="text-center px-2 py-2 rounded-lg bg-primary/8 border border-primary/15 text-xs font-medium text-primary"
          >
            {concept}
          </div>
        ))}
      </div>
    </div>
  )
}

function PracticeStage() {
  return (
    <div className="w-full max-w-xl space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Targeted Practice</span>
        <span className="text-xs text-text-muted bg-text-main/5 border border-border/50 px-2 py-1 rounded-md">Base Cases</span>
      </div>
      <h3 className="text-lg font-semibold text-text-main leading-snug">
        In the Fibonacci sequence, <code className="text-primary text-sm font-mono px-1.5 py-0.5 rounded bg-primary/10">fib(0) = 0</code> and{' '}
        <code className="text-primary text-sm font-mono px-1.5 py-0.5 rounded bg-primary/10">fib(1) = 1</code>.
        These represent which part of a recursive function?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {['Recursive case', 'Base case', 'Return type', 'Exit condition'].map((opt) => (
          <button
            key={opt}
            className={cn(
              'text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150',
              opt === 'Base case'
                ? 'border-success bg-success/10 text-text-main'
                : 'border-border/50 bg-background/50 text-text-muted hover:border-border hover:text-text-main'
            )}
          >
            {opt}
            {opt === 'Base case' && (
              <CheckCircle2 className="w-4 h-4 text-success inline-block ml-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function MasteryUpdateStage() {
  return (
    <div className="w-full max-w-xl space-y-5">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <TrendingUp className="w-4 h-4 text-success" />
        <span>Mastery updated</span>
      </div>
      <div className="p-5 rounded-xl bg-surface-elevated border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-text-main">Base Cases</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-text-muted line-through decoration-text-muted/50">32%</span>
            <ChevronRight className="w-4 h-4 text-success" />
            <span className="text-2xl font-bold text-success">41%</span>
          </div>
        </div>
        {/* Before → After bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 rounded-full bg-background overflow-hidden">
            <div className="h-full rounded-full bg-success transition-all duration-1000" style={{ width: '41%' }} />
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>0%</span>
            <span className="text-success font-medium">+9 points this session</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-text-muted">
        Keep practicing to reach{' '}
        <span className="text-text-main font-medium">80% mastery</span> — your next milestone.
      </p>
    </div>
  )
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-4" role="status" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === current
              ? 'w-5 h-1.5 bg-primary'
              : i < current
              ? 'w-1.5 h-1.5 bg-primary/40'
              : 'w-1.5 h-1.5 bg-text-main/15'
          )}
        />
      ))}
    </div>
  )
}

// ─── Stage labels ─────────────────────────────────────────────────────────────
const stageLabels: Record<Stage, string> = {
  'question': 'Answer a question',
  'wrong-answer': 'Analysing your response',
  'concept-identified': 'Weak concept detected',
  'explanation': 'Personalised explanation',
  'practice': 'Targeted practice',
  'mastery-update': 'Mastery updated',
}

// ─── Main component ───────────────────────────────────────────────────────────
export function LearningLoopDemo() {
  const [stageIndex, setStageIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [key, setKey] = useState(0) // remount on cycle restart

  const currentStage = STAGES[stageIndex].stage

  const advance = useCallback(() => {
    setStageIndex((prev) => {
      if (prev >= STAGES.length - 1) {
        // Restart
        setSelectedOption(null)
        setKey((k) => k + 1)
        return 0
      }
      return prev + 1
    })
  }, [])

  // Auto-advance timer
  useEffect(() => {
    const timeout = setTimeout(advance, STAGES[stageIndex].duration)
    return () => clearTimeout(timeout)
  }, [stageIndex, advance])

  const handleOptionSelect = (id: string) => {
    if (currentStage !== 'question') return
    setSelectedOption(id)
    // After a short pause, advance
    setTimeout(advance, 600)
  }

  return (
    <div className="select-none" key={key}>
      {/* Stage label strip */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-xs font-medium text-text-muted">{stageLabels[currentStage]}</span>
      </div>

      <DemoShell>
        <div className="relative w-full">
          <Fade visible={currentStage === 'question'}>
            <QuestionStage selectedId={selectedOption} onSelect={handleOptionSelect} />
          </Fade>
          <Fade visible={currentStage === 'wrong-answer'}>
            <WrongAnswerStage />
          </Fade>
          <Fade visible={currentStage === 'concept-identified'}>
            <ConceptIdentifiedStage />
          </Fade>
          <Fade visible={currentStage === 'explanation'}>
            <ExplanationStage />
          </Fade>
          <Fade visible={currentStage === 'practice'}>
            <PracticeStage />
          </Fade>
          <Fade visible={currentStage === 'mastery-update'}>
            <MasteryUpdateStage />
          </Fade>
        </div>
      </DemoShell>

      <ProgressDots current={stageIndex} total={STAGES.length} />
    </div>
  )
}
