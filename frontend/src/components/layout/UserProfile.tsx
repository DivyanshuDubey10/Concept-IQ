import { User } from 'lucide-react'

export function UserProfile() {
  return (
    <button className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
        <User className="w-5 h-5" />
      </div>
      <div className="hidden md:flex flex-col items-start">
        <span className="text-sm font-medium leading-none">Student</span>
        <span className="text-xs text-text-muted mt-1">Free Plan</span>
      </div>
    </button>
  )
}
