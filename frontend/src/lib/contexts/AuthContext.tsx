import React, { createContext, useContext, useState, useEffect } from 'react'
import { getMe, User } from '../api/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('conceptiq_token')
      
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await getMe()
        setUser(userData)
      } catch (err) {
        console.error('Failed to authenticate:', err)
        setError('Session expired. Please log in again.')
        localStorage.removeItem('conceptiq_token')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    localStorage.removeItem('conceptiq_token')
    setUser(null)
    // In a real app we might want to navigate to /login here, 
    // but context shouldn't depend directly on react-router if possible,
    // or we can just let protected routes redirect automatically.
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
