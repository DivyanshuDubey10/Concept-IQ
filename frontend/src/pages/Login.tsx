import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { login } from '../lib/api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !password) {
      setStatus('error')
      setErrorMessage('Please fill in all fields')
      return
    }

    try {
      setStatus('loading')
      setErrorMessage('')
      
      const response = await login(email, password)
      console.log('Logged in:', response.user)
      
      setStatus('success')
      // Small delay before redirecting to allow user to see success state
      setTimeout(() => navigate('/'), 800)
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'An error occurred during login')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-primary transition-colors">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">ConceptIQ</span>
        </Link>
        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-hover transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="bg-surface/30 backdrop-blur-sm border border-border/50 py-8 px-4 sm:rounded-2xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            
            {/* Error Message */}
            {status === 'error' && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3 animate-slide-up">
                <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                <p className="text-sm text-error/90 leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {status === 'success' && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3 animate-slide-up">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <p className="text-sm text-success/90">Signed in successfully. Redirecting...</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full rounded-xl border border-border/50 bg-surface/50 py-3 px-4 text-white placeholder-text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 sm:text-sm transition-colors disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full rounded-xl border border-border/50 bg-surface/50 py-3 pl-4 pr-12 text-white placeholder-text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 sm:text-sm transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full py-6 text-base mt-2"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...</>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
