import { LogOut } from 'lucide-react'
import { useAuth } from '../../lib/contexts/AuthContext'
import { useState } from 'react'
import { LogoutModal } from '../ui/logout-modal'

export function UserProfile() {
  const { logout } = useAuth()
  const [showLogout, setShowLogout] = useState(false)

  return (
    <>
      <button 
        onClick={() => setShowLogout(true)}
        className="flex items-center space-x-3 hover:bg-text-main/5 p-2 rounded-lg transition-colors group"
      >
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30 group-hover:bg-error/20 group-hover:text-error group-hover:border-error/30 transition-colors">
          <LogOut className="w-4 h-4" />
        </div>
      </button>

      <LogoutModal 
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={logout}
      />
    </>
  )
}
