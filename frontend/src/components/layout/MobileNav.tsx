import { NavLink } from 'react-router-dom'
import { navLinks } from './nav-links'
import { cn } from '../../lib/utils'

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      {/* iOS-style floating pill */}
      <nav className="flex items-center gap-1 px-3 py-2.5 rounded-2xl glass shadow-nav-pill border border-text-main/8">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 min-w-[52px]',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-text-muted hover:text-text-main'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn('w-5 h-5 transition-all', isActive ? 'text-primary scale-105' : '')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[10px] font-medium leading-none">{link.name}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
