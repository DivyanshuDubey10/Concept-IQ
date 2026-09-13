import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useAuth } from '../../lib/contexts/AuthContext'
import { LearningLoopDemo } from './LearningLoopDemo'

export function HeroSection() {
  const { user } = useAuth()
  const primaryHref = user ? '/home' : '/signup'

  return (
    <section
      id="product"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-5 md:px-8 overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background accent — two-layer depth, no blob ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 70% 55% at 50% -5%, hsl(250 82% 55% / 0.13), transparent 75%)',
            'radial-gradient(ellipse 45% 35% at 15% 60%, hsl(270 75% 60% / 0.07), transparent 70%)',
            'radial-gradient(ellipse 35% 30% at 85% 70%, hsl(230 80% 65% / 0.06), transparent 70%)',
          ].join(', '),
        }}
      />

      {/* ── Content ── */}
      <div className="relative max-w-4xl mx-auto text-center">

        {/* Label — entrance: fade in */}
        <p
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-8 animate-[fadeUp_0.6s_ease_both]"
          style={{ animationDelay: '0.05s' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          Adaptive learning
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        </p>

        {/* Headline — entrance: fade up, delayed */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold tracking-tight text-text-main leading-[1.04] mb-6 animate-[fadeUp_0.7s_ease_both]"
          style={{ letterSpacing: '-0.035em', animationDelay: '0.15s' }}
        >
          From knowing the answer
          <br />
          <span className="text-gradient">to mastering the concept.</span>
        </h1>

        {/* Subtext — entrance: fade up, further delayed */}
        <p
          className="max-w-[520px] mx-auto text-base md:text-lg text-text-muted leading-relaxed mb-10 animate-[fadeUp_0.7s_ease_both]"
          style={{ animationDelay: '0.28s' }}
        >
          ConceptIQ turns every answer into a learning signal — helping you
          understand what you know, what needs work, and what to practice next.
        </p>

        {/* CTAs — entrance: fade up, last */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-[fadeUp_0.7s_ease_both]"
          style={{ animationDelay: '0.38s' }}
        >
          <Link
            to={primaryHref}
            className="group inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            id="hero-start-learning"
          >
            Start learning
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-medium text-text-muted hover:text-text-main border border-border/70 hover:border-border hover:bg-text-main/5 transition-all duration-200"
            id="hero-see-how"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* ── Product visual ── */}
      <div
        className="relative w-full max-w-3xl mx-auto mt-16 md:mt-20 animate-[fadeUp_0.8s_ease_both]"
        style={{ animationDelay: '0.5s' }}
      >
        {/* Ambient glow behind the frame */}
        <div
          className="absolute -inset-6 rounded-3xl opacity-40 dark:opacity-25 blur-2xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, hsl(250 82% 55% / 0.3), transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Demo frame — glass treatment */}
        <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_-8px_hsl(var(--text-main)/0.22),0_0_0_1px_hsl(var(--border)/0.6),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <LearningLoopDemo />
        </div>

        {/* Bottom fade — blends demo into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none rounded-b-2xl"
          style={{
            background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Scroll nudge ── */}
      <a
        href="#problem"
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('#problem')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-muted/40 hover:text-text-muted transition-colors group"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-5 h-5 animate-[bounce_2s_ease-in-out_infinite] group-hover:text-primary transition-colors" />
      </a>
    </section>
  )
}
