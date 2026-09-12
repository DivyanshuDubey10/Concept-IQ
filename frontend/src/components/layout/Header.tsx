import { BrainCircuit } from 'lucide-react'
import { UserProfile } from './UserProfile'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between md:justify-end">
      {/* Mobile Brand */}
      <div className="flex md:hidden items-center space-x-2 text-primary">
        <BrainCircuit className="w-6 h-6" />
        <span className="font-bold text-lg tracking-wide">ConceptIQ</span>
      </div>
      
      <UserProfile />
    </header>
  )
}
