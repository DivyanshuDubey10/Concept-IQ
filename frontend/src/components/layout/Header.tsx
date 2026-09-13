import { BrainCircuit } from 'lucide-react'
import { UserProfile } from './UserProfile'
import { ThemeToggle } from '../ui/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-3 flex items-center justify-between md:hidden">
      {/* Mobile Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary">
          <BrainCircuit className="w-4 h-4 text-text-main" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-[17px] tracking-tight text-text-main">ConceptIQ</span>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserProfile />
      </div>
    </header>
  )
}
