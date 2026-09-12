import { NavLink } from 'react-router-dom'
import { navLinks } from './nav-links'
import { cn } from '../../lib/utils'

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface/90 backdrop-blur-md pb-safe z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center space-y-1 min-w-[64px] p-2 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text-main"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.name}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
