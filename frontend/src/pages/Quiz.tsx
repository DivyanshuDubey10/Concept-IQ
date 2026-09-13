import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, CheckCircle2, XCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { startQuiz, submitQuizAnswer } from '../lib/api/quizzes'
import type { QuizQuestion, QuizSubmitResponse } from '../lib/api/quizzes'
import { Button } from '../components/ui/button'
import ReactMarkdown from 'react-markdown'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Quiz() {
  const navigate = useNavigate()
  const { quizId: topicIdParam } = useParams<{ quizId: string }>()
  
  const [realQuizId, setRealQuizId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [currentIndex, setCurrentIndex] = useState(0) // Just for visual progress
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<QuizSubmitResponse | null>(null)
  
  const [isCompleted, setIsCompleted] = useState(false)
  const [animateKey, setAnimateKey] = useState(0)

  useEffect(() => {
    async function initQuiz() {
      if (!topicIdParam) return
      try {
        setIsLoading(true)
        // Treat the URL param as the topic ID for the diagnostic start
        const topicId = parseInt(topicIdParam, 10)
        const data = await startQuiz(topicId)
        setRealQuizId(data.quiz_id)
        setCurrentQuestion(data.first_question)
      } catch (err: any) {
        console.error('Failed to start quiz:', err)
        setError(err.message || 'Failed to start quiz')
      } finally {
        setIsLoading(false)
      }
    }
    initQuiz()
  }, [topicIdParam])

  const hasSubmitted = submitResult !== null
  const isCorrect = submitResult?.is_correct
  const correctOptionId = submitResult?.correct_option_id

  const handleSelect = (id: number) => {
    if (!hasSubmitted && !isSubmitting) {
      setSelectedOptionId(id)
    }
  }

  const handleSubmit = async () => {
    if (!selectedOptionId || !realQuizId || !currentQuestion) return
    try {
      setIsSubmitting(true)
      const result = await submitQuizAnswer(realQuizId, currentQuestion.question_id, selectedOptionId)
      setSubmitResult(result)
    } catch (err: any) {
      console.error('Failed to submit answer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (submitResult?.is_completed) {
      setIsCompleted(true)
    } else if (submitResult?.next_question) {
      setSubmitResult(null)
      setSelectedOptionId(null)
      setCurrentQuestion(submitResult.next_question)
      setCurrentIndex(prev => prev + 1)
      setAnimateKey(prev => prev + 1)
    }
  }

  const handleExit = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-muted">Preparing your session...</p>
      </div>
    )
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-6 text-center">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="text-2xl font-bold text-text-main">Could not load session</h2>
        <p className="text-text-muted max-w-md">{error}</p>
          <Button onClick={() => navigate('/learn')} variant="secondary">Back to Library</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-6 flex items-center justify-between">
        <div className="text-text-muted font-medium tracking-wide">
          <span className="text-text-main">Diagnostic Session</span>
        </div>
        <button 
          onClick={handleExit}
          className="p-2 text-text-muted hover:text-text-main hover:bg-text-main/5 rounded-full transition-colors"
          title="Exit Session"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Main Quiz Area */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 pb-24 mt-8 md:mt-16">
        
        {/* Subtle Progress */}
        <div className="mb-12 space-y-3">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">
            Question {currentIndex + 1}
          </div>
          <Progress value={((currentIndex) / 5) * 100} className="h-1" /> {/* Mocking total of 5 for visual progress */}
        </div>

        {/* Question & Options (Animated wrapper) */}
        <div key={animateKey} className="animate-fade-in space-y-10 flex-1">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-main leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map(option => {
              const isSelected = selectedOptionId === option.id
              const isCorrectAnswer = option.id === correctOptionId
              
              let stateClass = "border-border/50 bg-surface/50 hover:border-primary/50 hover:bg-surface"
              let icon = null

              if (hasSubmitted) {
                if (isCorrectAnswer) {
                  stateClass = "border-success bg-success/10 text-success"
                  icon = <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
                } else if (isSelected && !isCorrectAnswer) {
                  stateClass = "border-error bg-error/10 text-error opacity-75"
                  icon = <XCircle className="w-5 h-5 text-error ml-auto" />
                } else {
                  stateClass = "border-border/20 bg-surface/20 opacity-50 cursor-not-allowed"
                }
              } else if (isSelected) {
                stateClass = "border-primary bg-primary/10 shadow-[0_0_15px_rgba(100,100,255,0.15)]"
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={hasSubmitted || isSubmitting}
                  className={cn(
                    "w-full text-left p-6 rounded-xl border-2 transition-all duration-300 flex items-center text-lg",
                    stateClass,
                    !hasSubmitted && !isSubmitting && "cursor-pointer"
                  )}
                >
                  <span className={cn("font-medium", hasSubmitted && isCorrectAnswer ? "text-success" : "text-text-main")}>
                    {option.text}
                  </span>
                  {icon}
                </button>
              )
            })}
          </div>

          {/* Feedback Area */}
          {hasSubmitted && submitResult && (
            <div className={cn(
              "p-6 rounded-xl animate-slide-up mt-8",
              isCorrect ? "bg-success/10 border border-success/20 text-success" : "bg-error/10 border border-error/20 text-error"
            )}>
              <h3 className="font-semibold text-lg flex items-center mb-2">
                {isCorrect ? <><CheckCircle2 className="mr-2 w-5 h-5" /> Correct</> : <><XCircle className="mr-2 w-5 h-5" /> Incorrect</>}
              </h3>
              <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-black/10 prose-headings:text-current prose-strong:text-current prose-a:text-current">
                <ReactMarkdown>{submitResult.ai_explanation}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={handleExit} className="text-text-muted hover:text-text-main">
            Exit
          </Button>
          
          {!hasSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedOptionId || isSubmitting}
              className="w-48 text-lg"
            >
              {isSubmitting ? <><Loader2 className="mr-2 w-5 h-5 animate-spin"/> Submitting</> : 'Submit Answer'}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="w-48 text-lg bg-text-main text-background hover:bg-text-main/90"
            >
              {!submitResult?.is_completed ? 'Next Question' : 'Complete Session'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Completion Modal / Overlay */}
      {isCompleted && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in text-center space-y-6">
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-text-main tracking-tight">Session Complete</h1>
          <p className="text-text-muted text-lg max-w-md">
            Great job! Your mastery metrics have been updated based on your performance.
          </p>
          <Button onClick={() => navigate(`/analysis/${topicIdParam}`)} className="mt-8 px-8 group">
            View Analysis <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
