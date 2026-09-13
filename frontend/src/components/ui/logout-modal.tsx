import { LogOut } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Button } from './button'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-surface-elevated p-6 text-center shadow-premium border border-text-main/10 animate-scale-in">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <LogOut className="h-6 w-6 text-red-500" />
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-text-main tracking-tight">Ready to leave?</h3>
        <p className="mb-8 text-sm text-text-muted leading-relaxed">
          Are you sure you want to log out of your ConceptIQ account?
        </p>
        
        <div className="flex gap-3 w-full">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="flex-1 rounded-xl bg-text-main/5 border border-text-main/10 hover:bg-text-main/10 text-text-main"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-[#ffffff] shadow-glow-error border-none"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
