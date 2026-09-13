import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit, Menu, X } from 'lucide-react'
import { useAuth } from '../../lib/contexts/AuthContext'
import { ThemeToggle } from '../ui/theme-toggle'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Learning', href: '#mastery' },
]

export function LandingNavbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/50'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="ConceptIQ home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary">
              <BrainCircuit className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-text-main">ConceptIQ</span>
          </Link>

          {/* Center nav — desktop only */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main rounded-lg hover:bg-text-main/5 transition-all duration-150"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => navigate('/home')}
                className="h-9 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-glow-primary"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="h-9 px-5 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-text-main/5 transition-all flex items-center"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="h-9 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-glow-primary flex items-center"
                >
                  Start learning
                </Link>
              </>
            )}
          </div>

          {/* Right side — mobile */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-main hover:bg-text-main/5 transition-all"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            'absolute top-16 left-0 right-0 bg-surface border-b border-border/50 shadow-premium transition-all duration-300',
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          )}
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="px-4 py-3 text-sm font-medium text-text-muted hover:text-text-main hover:bg-text-main/5 rounded-lg transition-all"
              >
                {item.label}
              </a>
            ))}
            <div className="h-px bg-border/50 my-2" />
            {user ? (
              <button
                onClick={() => { setMobileOpen(false); navigate('/home') }}
                className="px-4 py-3 text-sm font-semibold text-primary text-left hover:bg-primary/5 rounded-lg transition-all"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-text-muted hover:text-text-main hover:bg-text-main/5 rounded-lg transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 px-4 py-3 text-sm font-semibold text-center rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Start learning
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
