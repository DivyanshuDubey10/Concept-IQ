import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { changePassword } from '../../lib/api/auth'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const resetAndClose = () => {
    setError(null)
    setSuccess(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-surface-elevated p-8 shadow-premium border border-text-main/10 animate-scale-in">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-glow-primary">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="mb-2 text-2xl font-bold text-text-main tracking-tight text-center">Change Password</h3>
        <p className="mb-8 text-sm text-text-muted leading-relaxed text-center">
          Ensure your account uses a strong, unique password.
        </p>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-success animate-bounce" />
            <p className="text-text-main font-medium">Password updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-4 h-12 bg-background/20 border border-text-main/10 rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 h-12 bg-background/20 border border-text-main/10 rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 h-12 bg-background/20 border border-text-main/10 rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="secondary" 
                onClick={resetAndClose}
                className="flex-1 rounded-xl bg-text-main/5 border border-text-main/10 hover:bg-text-main/10 text-text-main"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl bg-primary hover:bg-primary-hover text-text-main shadow-glow-primary border-none"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Update"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
