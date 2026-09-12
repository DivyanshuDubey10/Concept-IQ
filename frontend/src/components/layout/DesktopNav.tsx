import { NavLink } from 'react-router-dom'
import { BrainCircuit } from 'lucide-react'
import { navLinks } from './nav-links'
import { cn } from '../../lib/utils'

export function DesktopNav() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface/50 h-screen sticky top-0 px-4 py-8">
      <div className="flex items-center space-x-3 text-primary mb-12 px-2">
        <BrainCircuit className="w-8 h-8" />
        <span className="font-bold text-xl tracking-wide">ConceptIQ</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-white/5 hover:text-text-main"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
