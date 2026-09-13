import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrainCircuit, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '../lib/api/api'

/*
  Forgot Password
  ─────────────────────────────────────────────
  Sends a reset link to the provided email.
  API: POST /api/auth/forgot-password  { email }
  When the backend is ready, remove the mock delay below.
*/
async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/api/auth/forgot-password', { email })
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setStatus('error'); setError('Please enter your email address'); return }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setStatus('error'); setError('Please enter a valid email address'); return }

    try {
      setStatus('loading')
      setError('')
      await requestPasswordReset(email)
      setStatus('success')
    } catch {
      // Treat any error as success — do not leak whether an email exists
      setStatus('success')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">

      {/* Brand */}
      <div className="flex items-center gap-2 mb-10">
        <BrainCircuit className="w-7 h-7 text-primary" />
        <span className="text-xl font-bold tracking-tight text-white">ConceptIQ</span>
      </div>

      <div className="w-full max-w-sm">

        {status === 'success' ? (
          /* ── Success State ─────────────────────────────────────────── */
          <div className="flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="!text-2xl font-bold text-white !mb-2">Check your inbox</h1>
              <p className="text-sm text-white/50 leading-relaxed !mb-0">
                If <span className="text-white/80 font-medium">{email}</span> is registered,
                we've sent a link to reset your password. Check your spam folder if it doesn't arrive.
              </p>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>

        ) : (
          /* ── Request Form ──────────────────────────────────────────── */
          <>
            <div className="mb-8 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h1 className="!text-2xl font-bold text-white !mb-2">Forgot your password?</h1>
              <p className="text-sm text-white/50 leading-relaxed !mb-0">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>

              {status === 'error' && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <input
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-hover active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {status === 'loading'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  : 'Send reset link'}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </form>
          </>
        )}

      </div>
    </div>
  )
}
