import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../lib/contexts/ThemeContext'
import { cn } from '../../lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button 
      onClick={toggleTheme}
      className={cn(
        "w-9 h-9 rounded-full bg-text-main/5 hover:bg-text-main/10 flex items-center justify-center transition-all duration-500 overflow-hidden relative border border-text-main/10 shadow-sm shrink-0 group",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-500",
        isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-180 opacity-0 scale-50"
      )}>
        <Moon className="w-4 h-4 text-text-main group-hover:text-primary transition-colors" />
      </div>
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-500",
        isDark ? "rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
      )}>
        <Sun className="w-4 h-4 text-yellow-500" />
      </div>
    </button>
  )
}
