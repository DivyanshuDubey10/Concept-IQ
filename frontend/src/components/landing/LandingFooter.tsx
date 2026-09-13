import { Link } from 'react-router-dom'
import { BrainCircuit } from 'lucide-react'

const footerLinks = [
  {
    heading: 'Product',
    items: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Learning', href: '#mastery' },
      { label: 'AI Tutor', href: '#ai-tutor' },
      { label: 'Adaptive learning', href: '#adaptive' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Log in', href: '/login' },
      { label: 'Sign up', href: '/signup' },
    ],
  },
]

export function LandingFooter() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-border/40 bg-surface/30" role="contentinfo">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary">
                <BrainCircuit className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[17px] tracking-tight text-text-main">ConceptIQ</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-[240px] !mb-0">
              From knowing the answer to mastering the concept.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">{col.heading}</p>
              <ul className="space-y-2.5" role="list">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('#') ? (
                      <a
                        href={item.href}
                        onClick={(e) => handleSmoothScroll(e, item.href)}
                        className="text-sm text-text-muted hover:text-text-main transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-sm text-text-muted hover:text-text-main transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted/60 !mb-0">
            © {new Date().getFullYear()} ConceptIQ. All rights reserved.
          </p>
          <p className="text-xs text-text-muted/40 !mb-0 italic">
            Built to improve understanding, not just scores.
          </p>
        </div>
      </div>
    </footer>
  )
}
