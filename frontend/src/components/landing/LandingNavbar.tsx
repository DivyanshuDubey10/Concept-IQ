import { useState, useEffect, useRef } from 'react'
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

// Section IDs we track for active-state highlighting
const SECTION_IDS = ['product', 'problem', 'how-it-works', 'adaptive', 'ai-tutor', 'mastery', 'revision', 'cta']

// Map section → which nav item it belongs to
const SECTION_NAV_MAP: Record<string, string> = {
  product: '#product',
  problem: '#product',
  'how-it-works': '#how-it-works',
  adaptive: '#how-it-works',
  'ai-tutor': '#mastery',
  mastery: '#mastery',
  revision: '#mastery',
  cta: '#mastery',
}

export function LandingNavbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('#product')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // ── Scroll shadow ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Active section via IntersectionObserver ────────────────────────────────
  useEffect(() => {
    const visible = new Set<string>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        })

        // The first visible section (in document order) wins
        const ordered = SECTION_IDS.filter((id) => visible.has(id))
        if (ordered.length > 0) {
          const navHref = SECTION_NAV_MAP[ordered[0]]
          if (navHref) setActiveSection(navHref)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  // ── Body scroll-lock when mobile menu open ─────────────────────────────────
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ── Close on desktop resize ────────────────────────────────────────────────
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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/88 backdrop-blur-2xl shadow-[0_1px_0_0_hsl(var(--border)/0.7),0_4px_24px_0_hsl(var(--text-main)/0.04)]'
            : 'bg-transparent'
        )}
      >
        <nav
          className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="ConceptIQ — go to home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary transition-transform duration-200 group-hover:scale-105">
              <BrainCircuit className="w-[18px] h-[18px] text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-text-main">ConceptIQ</span>
          </Link>

          {/* Center nav — desktop */}
          <ul className="hidden md:flex items-center gap-0.5" role="list">
            {navItems.map((item) => {
              const isActive = activeSection === item.href
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150',
                      'before:absolute before:bottom-0.5 before:left-4 before:right-4 before:h-px',
                      'before:rounded-full before:transition-all before:duration-300',
                      isActive
                        ? 'text-text-main before:bg-primary before:opacity-100'
                        : 'text-text-muted hover:text-text-main hover:bg-text-main/5 before:opacity-0'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => navigate('/home')}
                className="h-9 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-150 shadow-glow-primary hover:scale-[1.02] active:scale-[0.98]"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="h-9 px-4 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-text-main/6 transition-all duration-150 flex items-center"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="h-9 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-150 shadow-glow-primary flex items-center hover:scale-[1.02] active:scale-[0.98]"
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
              aria-controls="mobile-nav"
            >
              <span
                className={cn(
                  'absolute transition-all duration-200',
                  mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
                )}
              >
                <X className="w-5 h-5" />
              </span>
              <span
                className={cn(
                  'absolute transition-all duration-200',
                  mobileOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
                )}
              >
                <Menu className="w-5 h-5" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-nav"
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            'absolute top-16 left-0 right-0 bg-surface/98 backdrop-blur-xl border-b border-border/50',
            'shadow-[0_16px_48px_-8px_hsl(var(--text-main)/0.12)]',
            'transition-all duration-300 origin-top',
            mobileOpen ? 'translate-y-0 opacity-100 scale-y-100' : '-translate-y-3 opacity-0 scale-y-95'
          )}
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-lg transition-all',
                    isActive
                      ? 'text-primary bg-primary/8'
                      : 'text-text-muted hover:text-text-main hover:bg-text-main/5'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              )
            })}

            <div className="h-px bg-border/50 my-2" />

            {user ? (
              <button
                onClick={() => { setMobileOpen(false); navigate('/home') }}
                className="px-4 py-3 text-sm font-semibold text-primary text-left hover:bg-primary/6 rounded-lg transition-all"
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
                  className="mt-1 px-4 py-3 text-sm font-semibold text-center rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-glow-primary"
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
