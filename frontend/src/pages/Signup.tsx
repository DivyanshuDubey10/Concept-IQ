import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { register } from '../lib/api/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setStatus('error')
      setErrorMessage('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setStatus('error')
      setErrorMessage('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setStatus('error')
      setErrorMessage('Password must be at least 8 characters')
      return
    }

    try {
      setStatus('loading')
      setErrorMessage('')
      
      const response = await register(name, email, password)
      
      // Store token
      localStorage.setItem('conceptiq_token', response.access_token)
      
      setStatus('success')
      // Small delay before redirecting
      setTimeout(() => navigate('/'), 800)
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'An error occurred during registration')
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
          Create an account
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="bg-surface/30 backdrop-blur-sm border border-border/50 py-8 px-4 sm:rounded-2xl sm:px-10">
          
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
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
                <p className="text-sm text-success/90">Account created successfully. Redirecting...</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full rounded-xl border border-border/50 bg-surface/50 py-3 px-4 text-white placeholder-text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 sm:text-sm transition-colors disabled:opacity-50"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm password
              </label>
              <div className="mt-2 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full rounded-xl border border-border/50 bg-surface/50 py-3 pl-4 pr-12 text-white placeholder-text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 sm:text-sm transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full py-6 text-base"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...</>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
