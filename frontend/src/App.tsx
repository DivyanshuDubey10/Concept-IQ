import { Routes, Route, Navigate } from 'react-router-dom'
import { Shell } from './components/layout/Shell'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'
import AITutor from './pages/AITutor'
import Progress from './pages/Progress'
import Revision from './pages/Revision'
import Settings from './pages/Settings'
import TopicDetail from './pages/TopicDetail'
import Quiz from './pages/Quiz'
import ConceptAnalysis from './pages/ConceptAnalysis'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import { useAuth } from './lib/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute><Shell /></ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/topic/:topicId" element={<TopicDetail />} />
        <Route path="/analysis/:topicId" element={<ConceptAnalysis />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/quiz/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
