import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2, BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react'
import { login, register } from '../lib/api/auth'

/* -----------------------------------------------------------------------
   Auth — sliding panel design, faithful to reference implementation.
   The animation mechanism lives in index.css (.auth-container, etc.)
   so the mid-keyframe z-index flip works correctly.
----------------------------------------------------------------------- */

// Input field shared styling — dark glassy, consistent with design system
const inputClass =
  'w-full px-4 py-3 rounded-xl bg-background/70 border border-text-main/10 text-text-main placeholder-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors'

// Ghost outline button for the overlay panels
const ghostBtnClass =
  'mt-4 px-10 py-3 rounded-full border border-text-main text-text-main text-xs font-semibold uppercase tracking-widest bg-transparent hover:bg-text-main/10 active:scale-95 transition-all duration-200 cursor-pointer'

// Solid primary button
const solidBtnClass =
  'w-full py-3 rounded-full bg-primary text-text-main text-xs font-bold uppercase tracking-widest hover:bg-primary-hover active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup')

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup')
  }, [location.pathname])

  const toggle = (toSignUp: boolean) => {
    setIsSignUp(toSignUp)
    navigate(toSignUp ? '/signup' : '/login', { replace: true })
  }

  // ── Login state ───────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [loginError, setLoginError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) { setLoginStatus('error'); setLoginError('Please fill in all fields'); return }
    try {
      setLoginStatus('loading'); setLoginError('')
      const res = await login(loginEmail, loginPassword)
      localStorage.setItem('conceptiq_token', res.access_token)
      setLoginStatus('success')
      setTimeout(() => { window.location.href = '/' }, 700)
    } catch (err: any) {
      setLoginStatus('error')
      setLoginError(err?.response?.data?.detail || err.message || 'Incorrect email or password')
    }
  }

  // ── Signup state ──────────────────────────────────────────────────────
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPwd, setSignupPwd] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [showSignupPwd, setShowSignupPwd] = useState(false)
  const [showSignupConfirm, setShowSignupConfirm] = useState(false)
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [signupError, setSignupError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupName || !signupEmail || !signupPwd || !signupConfirm) { setSignupStatus('error'); setSignupError('Please fill in all fields'); return }
    if (signupPwd !== signupConfirm) { setSignupStatus('error'); setSignupError('Passwords do not match'); return }
    if (signupPwd.length < 8) { setSignupStatus('error'); setSignupError('Password must be at least 8 characters'); return }
    try {
      setSignupStatus('loading'); setSignupError('')
      const res = await register(signupName, signupEmail, signupPwd)
      localStorage.setItem('conceptiq_token', res.access_token)
      setSignupStatus('success')
      setTimeout(() => { window.location.href = '/' }, 700)
    } catch (err: any) {
      setSignupStatus('error')
      setSignupError(err?.response?.data?.detail || err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8">
        <BrainCircuit className="w-7 h-7 text-primary" />
        <span className="text-xl font-bold tracking-tight text-text-main">ConceptIQ</span>
      </div>

      {/* ── The Card ── */}
      <div className={`auth-container shadow-2xl ${isSignUp ? 'signup-active' : ''}`}>

        {/* ── Sign Up Form (hidden by default, revealed on signup) ─────── */}
        <div className="auth-form-container auth-sign-up">
          <form className="flex flex-col items-center gap-2 w-full px-10 py-6" onSubmit={handleSignup} noValidate>
            <h1 className="!text-2xl font-bold text-text-main !mb-0">Create Account</h1>

            {signupStatus === 'error' && (
              <div className="w-full flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}
            {signupStatus === 'success' && (
              <div className="w-full flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Account created. Redirecting…</span>
              </div>
            )}

            <input type="text" className={inputClass} placeholder="Name" value={signupName} onChange={e => setSignupName(e.target.value)} disabled={signupStatus === 'loading' || signupStatus === 'success'} />
            <input type="email" className={inputClass} placeholder="Email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} disabled={signupStatus === 'loading' || signupStatus === 'success'} />

            <div className="relative w-full">
              <input type={showSignupPwd ? 'text' : 'password'} className={inputClass + ' pr-11'} placeholder="Password" value={signupPwd} onChange={e => setSignupPwd(e.target.value)} disabled={signupStatus === 'loading' || signupStatus === 'success'} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-text-main/80 transition-colors" onClick={() => setShowSignupPwd(v => !v)}>
                {showSignupPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative w-full">
              <input type={showSignupConfirm ? 'text' : 'password'} className={inputClass + ' pr-11'} placeholder="Confirm Password" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} disabled={signupStatus === 'loading' || signupStatus === 'success'} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-text-main/80 transition-colors" onClick={() => setShowSignupConfirm(v => !v)}>
                {showSignupConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button type="submit" className={solidBtnClass + ' mt-1'} disabled={signupStatus === 'loading' || signupStatus === 'success'}>
              {signupStatus === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : 'Sign Up'}
            </button>

            {/* Mobile-only toggle */}
            <p className="text-xs text-text-main/40 mt-2 md:hidden">
              Already have an account?{' '}
              <button type="button" className="text-primary underline" onClick={() => toggle(false)}>Sign in</button>
            </p>
          </form>
        </div>

        {/* ── Sign In Form (visible by default) ───────────────────────── */}
        <div className="auth-form-container auth-sign-in">
          <form className="flex flex-col items-center gap-3 w-full px-10 py-8" onSubmit={handleLogin} noValidate>
            <h1 className="!text-2xl font-bold text-text-main !mb-0">Sign in</h1>

            {loginStatus === 'error' && (
              <div className="w-full flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            {loginStatus === 'success' && (
              <div className="w-full flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Signed in. Redirecting…</span>
              </div>
            )}

            <input type="email" className={inputClass} placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} disabled={loginStatus === 'loading' || loginStatus === 'success'} />

            <div className="relative w-full">
              <input type={showLoginPwd ? 'text' : 'password'} className={inputClass + ' pr-11'} placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} disabled={loginStatus === 'loading' || loginStatus === 'success'} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-text-main/80 transition-colors" onClick={() => setShowLoginPwd(v => !v)}>
                {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Link to="/forgot-password" className="text-xs text-text-main/40 hover:text-text-main/70 transition-colors self-end !mb-0">Forgot your password?</Link>

            <button type="submit" className={solidBtnClass} disabled={loginStatus === 'loading' || loginStatus === 'success'}>
              {loginStatus === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
            </button>

            {/* Mobile-only toggle */}
            <p className="text-xs text-text-main/40 mt-2 md:hidden">
              Don't have an account?{' '}
              <button type="button" className="text-primary underline" onClick={() => toggle(true)}>Sign up</button>
            </p>
          </form>
        </div>

        {/* ── Overlay (hidden on mobile, full sliding panel on desktop) ── */}
        <div className="auth-overlay-container hidden md:block">
          <div className="auth-overlay">

            {/* Left panel — visible when signup is active, invites user to Sign In */}
            <div className="auth-overlay-panel auth-overlay-left">
              <BrainCircuit className="w-10 h-10 text-text-main/80 mb-4" />
              <h1 className="!text-2xl font-bold text-text-main !mb-2">Welcome back!</h1>
              <p className="text-sm text-text-main/80 leading-relaxed !mb-0">
                Already have an account? Sign in and pick up right where you left off.
              </p>
              <button className={ghostBtnClass} type="button" onClick={() => toggle(false)}>Sign In</button>
            </div>

            {/* Right panel — visible by default, invites user to Sign Up */}
            <div className="auth-overlay-panel auth-overlay-right">
              <BrainCircuit className="w-10 h-10 text-text-main/80 mb-4" />
              <h1 className="!text-2xl font-bold text-text-main !mb-2">Hello, friend!</h1>
              <p className="text-sm text-text-main/80 leading-relaxed !mb-0">
                Enter your details and start your personalised learning journey today.
              </p>
              <button className={ghostBtnClass} type="button" onClick={() => toggle(true)}>Sign Up</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
