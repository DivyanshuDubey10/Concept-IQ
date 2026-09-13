import { useState } from 'react'
import { useAuth } from '../lib/contexts/AuthContext'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { User, Mail, Shield, Bell, Moon, Sun, Crown, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { ChangePasswordModal } from '../components/ui/change-password-modal'
import { useTheme } from '../lib/contexts/ThemeContext'

export default function Settings() {
  const { user } = useAuth()
  
  const { theme, toggleTheme } = useTheme()
  const darkMode = theme === 'dark'
  
  const [notifications, setNotifications] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-text-main">Settings</h1>
        <p className="text-text-muted text-lg">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Section */}
        <div className="md:col-span-12 space-y-4">
          <h2 className="text-xl font-semibold text-text-main px-1">Profile Information</h2>
          <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md overflow-hidden rounded-[24px]">
            <CardContent className="p-0">
              <div className="p-8 flex items-center gap-6 border-b border-text-main/5">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary shrink-0 relative group cursor-pointer">
                  <span className="text-3xl font-bold text-text-main">{initials}</span>
                  <div className="absolute inset-0 bg-background/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-semibold text-text-main">EDIT</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-main tracking-tight">{user?.name || 'User Name'}</h3>
                  <p className="text-text-muted flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" /> {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-surface/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-main">Free Plan</h4>
                    <p className="text-sm text-text-muted">Upgrade to unlock all premium AI features.</p>
                  </div>
                </div>
                <Button className="rounded-xl px-6 h-11 bg-text-main text-background hover:bg-text-main/90 shadow-glow-primary border-none">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preferences & Security */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-main px-1">Preferences</h2>
            <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[24px]">
              <div className="flex flex-col">
                {/* Theme Toggle */}
                <div className="p-5 flex items-center justify-between border-b border-text-main/5">
                  <div>
                    <div className="font-medium text-text-main">Appearance</div>
                    <div className="text-xs text-text-muted">Toggle application theme</div>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className="w-12 h-12 rounded-full bg-text-main/5 hover:bg-text-main/10 flex items-center justify-center transition-all duration-500 overflow-hidden relative border border-text-main/10 shadow-sm"
                  >
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all duration-500",
                      darkMode ? "rotate-0 opacity-100 scale-100" : "-rotate-180 opacity-0 scale-50"
                    )}>
                      <Moon className="w-5 h-5 text-text-main" />
                    </div>
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all duration-500",
                      darkMode ? "rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
                    )}>
                      <Sun className="w-5 h-5 text-yellow-400" />
                    </div>
                  </button>
                </div>
                
                {/* Notifications Toggle */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-text-main/5 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-text-main" />
                    </div>
                    <div>
                      <div className="font-medium text-text-main">Notifications</div>
                      <div className="text-xs text-text-muted">Study reminders</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      notifications ? "bg-primary" : "bg-text-main/20"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 left-1 w-4 h-4 rounded-full bg-text-main transition-transform",
                      notifications ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-main px-1">Security</h2>
            <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[24px]">
              <div className="flex flex-col">
                <div 
                  onClick={() => setShowPasswordModal(true)}
                  className="p-5 flex items-center justify-between border-b border-text-main/5 cursor-pointer hover:bg-text-main/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-text-main/5 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-text-main" />
                    </div>
                    <div>
                      <div className="font-medium text-text-main">Change Password</div>
                      <div className="text-xs text-text-muted">Update your security key</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </div>
                
                <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-text-main/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-error" />
                    </div>
                    <div>
                      <div className="font-medium text-error">Delete Account</div>
                      <div className="text-xs text-error/70">Permanently remove your data</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>

      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  )
}
