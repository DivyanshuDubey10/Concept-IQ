import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../lib/contexts/AuthContext'
import { Reveal } from './Reveal'


export function FinalCTA() {
  const { user } = useAuth()

  return (
    <section
      id="cta"
      className="py-28 md:py-40 px-5 md:px-8"
      aria-labelledby="cta-heading"
    >
      <Reveal className="max-w-2xl mx-auto text-center">
        <h2
          id="cta-heading"
          className="text-4xl md:text-5xl lg:text-[56px] font-bold text-text-main tracking-tight leading-tight !mb-5"
          style={{ letterSpacing: '-0.03em' }}
        >
          Stop practicing more.<br />
          Start learning better.
        </h2>
        <p className="text-base md:text-lg text-text-muted !mb-10 max-w-md mx-auto leading-relaxed">
          Build understanding one concept at a time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={user ? '/home' : '/signup'}
            className="group inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            id="cta-start-learning"
          >
            Start learning
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center h-12 px-8 rounded-xl text-sm font-medium text-text-muted hover:text-text-main border border-border/60 hover:border-border hover:bg-text-main/5 transition-all duration-200"
              id="cta-log-in"
            >
              Log in
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  )
}
