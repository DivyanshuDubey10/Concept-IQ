import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../lib/contexts/AuthContext'
import { LearningLoopDemo } from './LearningLoopDemo'

export function HeroSection() {
  const { user } = useAuth()
  const primaryHref = user ? '/home' : '/signup'

  return (
    <section
      id="product"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-5 md:px-8 overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle background accent — static, not animated */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 dark:opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(250 82% 55% / 0.25), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Label */}
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-8 !mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          Adaptive learning
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        </p>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-text-main leading-[1.05] !mb-6">
          From knowing the answer<br className="hidden sm:block" />
          <span className="text-gradient"> to mastering the concept.</span>
        </h1>

        {/* Supporting text */}
        <p className="max-w-xl mx-auto text-base md:text-lg text-text-muted leading-relaxed !mb-10">
          ConceptIQ turns every answer into a learning signal, helping you understand
          what you know, what needs work, and what to practice next.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={primaryHref}
            className="group inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            id="hero-start-learning"
          >
            Start learning
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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

      {/* Product visual */}
      <div className="relative w-full max-w-3xl mx-auto mt-16 md:mt-20">
        {/* Subtle frame */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-border/30 to-transparent pointer-events-none -inset-px" aria-hidden="true" />
        <LearningLoopDemo />
      </div>
    </section>
  )
}
