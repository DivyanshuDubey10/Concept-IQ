import { NavLink, useNavigate } from 'react-router-dom'
import { BrainCircuit, LogOut } from 'lucide-react'
import { navLinks } from './nav-links'
import { cn } from '../../lib/utils'
import { useAuth } from '../../lib/contexts/AuthContext'
import { useState } from 'react'
import { LogoutModal } from '../ui/logout-modal'
import { ThemeToggle } from '../ui/theme-toggle'

export function DesktopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside className="hidden md:flex flex-col w-[220px] border-r border-border/40 bg-surface/30 h-screen sticky top-0 px-3 py-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8 px-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary shrink-0">
            <BrainCircuit className="w-4.5 h-4.5 text-text-main" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-text-main">ConceptIQ</span>
        </div>
        
        <ThemeToggle />
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-text-muted hover:text-text-main hover:bg-text-main/4'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-4.5 h-4.5 shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-main'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User profile pinned at bottom */}
      <div className="border-t border-border/40 pt-4 mt-4 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-purple-500/80 flex items-center justify-center text-text-main text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-text-main truncate">{user?.name ?? 'User'}</div>
            <div className="text-[11px] text-text-muted truncate">{user?.email ?? ''}</div>
          </div>
        </div>
        <button
          onClick={() => setShowLogout(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-text-muted hover:text-error hover:bg-error/8 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 shrink-0 transition-colors group-hover:text-error" strokeWidth={2} />
          Sign out
        </button>
      </div>

      <LogoutModal 
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={logout}
      />
    </aside>
  )
}
