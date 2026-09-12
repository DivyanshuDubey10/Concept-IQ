import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, ArrowRight, TrendingDown, Activity, Loader2, AlertCircle } from 'lucide-react'
import { startQuiz, submitQuizAnswer } from '../lib/api/quizzes'
import type { QuizQuestion, QuizSubmitResponse } from '../lib/api/quizzes'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Practice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const conceptIdParam = searchParams.get('conceptId')
  
  const [realQuizId, setRealQuizId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<QuizSubmitResponse | null>(null)
  
  const [isCompleted, setIsCompleted] = useState(false)
  const [animateKey, setAnimateKey] = useState(0)

  // Track conceptual mastery dynamically
  const [mastery, setMastery] = useState(0)
  const [conceptName, setConceptName] = useState("Adaptive Practice")

  useEffect(() => {
    async function initPractice() {
      if (!topicIdParam) {
        setError('Missing topic ID to start practice.')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const topicId = parseInt(topicIdParam, 10)
        const conceptId = conceptIdParam ? parseInt(conceptIdParam, 10) : undefined
        
        const data = await startQuiz(topicId, conceptId)
        setRealQuizId(data.quiz_id)
        setCurrentQuestion(data.first_question)
      } catch (err: any) {
        console.error('Failed to start practice:', err)
        setError(err.message || 'Failed to start practice session')
      } finally {
        setIsLoading(false)
      }
    }
    initPractice()
  }, [topicIdParam, conceptIdParam])

  const hasSubmitted = submitResult !== null
  const isCorrect = submitResult?.is_correct
  const correctOptionId = submitResult?.correct_option_id
  const hasMoreQuestions = !submitResult?.is_completed && submitResult?.next_question != null

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
      
      // Update mastery organically
      if (result.concept_tested) {
        setMastery(result.concept_tested.new_mastery_percentage)
        setConceptName(result.concept_tested.name)
      }
    } catch (err: any) {
      console.error('Failed to submit answer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (submitResult?.is_completed || !submitResult?.next_question) {
      setIsCompleted(true)
    } else {
      setSubmitResult(null)
      setSelectedOptionId(null)
      setCurrentQuestion(submitResult.next_question)
      setAnimateKey(prev => prev + 1)
    }
  }

  const handleExit = () => {
    navigate('/progress')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-muted">Initializing adaptive practice...</p>
      </div>
    )
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-6 text-center">
        <AlertCircle className="w-12 h-12 text-error" />
        <h2 className="text-2xl font-bold text-white">Could not load session</h2>
        <p className="text-text-muted max-w-md">{error}</p>
        <Button onClick={() => navigate('/learn')} variant="outline">Back to Library</Button>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <Activity className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">Session Complete</h1>
          <p className="text-text-muted text-lg max-w-md mx-auto">
            You've exhausted the question bank for this session. Your mastery has been updated to {mastery}%.
          </p>
        </div>
        <Button onClick={handleExit} className="px-8 text-lg">
          View Progress
        </Button>
      </div>
    )
  }

  // Difficulty colors
  const difficultyColors = {
    1: "text-success bg-success/10", // Easy
    2: "text-warning bg-warning/10", // Medium
    3: "text-error bg-error/10"      // Hard
  }
  
  // Next difficulty prediction (for UI feedback only)
  const nextDifficulty = hasMoreQuestions && submitResult?.next_question 
    ? submitResult.next_question.difficulty 
    : currentQuestion.difficulty

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-surface/30 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <div className="text-white font-medium text-lg">
            {conceptName}
          </div>
          <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-border/50">
            <span className="text-text-muted text-sm font-medium uppercase tracking-widest">Mastery</span>
            <div className="w-32 flex items-center gap-3">
              <Progress value={mastery} indicatorClassName="bg-primary transition-all duration-700" className="h-1.5" />
              <span className="text-white text-sm font-bold min-w-[2.5rem]">{mastery}%</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost"
          onClick={handleExit}
          className="text-text-muted hover:text-white"
        >
          End Session & View Progress
        </Button>
      </header>

      {/* Main Practice Area */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 pb-32 mt-12 md:mt-16">
        
        {/* Animated Question Container */}
        <div key={animateKey} className="animate-fade-in space-y-8 flex-1">
          
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-text-muted uppercase tracking-widest">Difficulty</span>
            <span className="text-text-muted opacity-50">·</span>
            <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md", difficultyColors[(currentQuestion.difficulty || 1) as keyof typeof difficultyColors])}>
              {currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4 pt-4">
            {currentQuestion.options.map(option => {
              const isSelected = selectedOptionId === option.id
              const isCorrectAnswer = option.id === correctOptionId
              
              let stateClass = "border-border/50 bg-surface/30 hover:border-primary/50 hover:bg-surface"
              let icon = null

              if (hasSubmitted) {
                if (isCorrectAnswer) {
                  stateClass = "border-success bg-success/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                  icon = <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
                } else if (isSelected && !isCorrectAnswer) {
                  stateClass = "border-error/50 bg-error/5 opacity-60"
                  icon = <XCircle className="w-5 h-5 text-error ml-auto" />
                } else {
                  stateClass = "border-border/20 bg-surface/10 opacity-40 cursor-not-allowed"
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
                  <span className={cn("font-medium", hasSubmitted && isCorrectAnswer ? "text-success" : "text-white")}>
                    {option.text}
                  </span>
                  {icon}
                </button>
              )
            })}
          </div>

          {/* Adaptive Feedback */}
          {hasSubmitted && submitResult && (
            <div className="pt-8 animate-slide-up space-y-6">
              
              {/* Algorithm Explanation */}
              <div className={cn(
                "p-6 rounded-xl border flex flex-col md:flex-row gap-6 items-start md:items-center",
                isCorrect ? "bg-success/5 border-success/20" : "bg-warning/5 border-warning/20"
              )}>
                <div className="flex-1 space-y-2">
                  <div className={cn("font-bold text-xl flex items-center", isCorrect ? "text-success" : "text-warning")}>
                    {isCorrect ? <CheckCircle2 className="mr-2 w-6 h-6" /> : <TrendingDown className="mr-2 w-6 h-6" />}
                    {isCorrect ? "Correct" : "Not quite"}
                  </div>
                  <p className="text-white/80 leading-relaxed text-lg">
                    {submitResult.ai_explanation}
                  </p>
                </div>
                
                {/* Visualizing the transition */}
                {hasMoreQuestions && nextDifficulty && (
                  <div className="bg-background/80 backdrop-blur rounded-lg p-4 border border-border/50 min-w-[200px]">
                    <div className="text-sm font-medium text-text-muted mb-2">
                      {isCorrect ? "You're ready for something harder." : "Let's try one at the next level."}
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-sm">
                      <span className={difficultyColors[(currentQuestion.difficulty || 1) as keyof typeof difficultyColors] + " px-2 py-0.5 rounded"}>
                        {currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-muted" />
                      <span className={difficultyColors[nextDifficulty as keyof typeof difficultyColors] + " px-2 py-0.5 rounded"}>
                        {nextDifficulty === 1 ? 'Easy' : nextDifficulty === 2 ? 'Medium' : 'Hard'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border z-50">
        <div className="max-w-3xl mx-auto flex justify-end items-center">
          {!hasSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedOptionId || isSubmitting}
              className="w-full md:w-64 text-lg py-6"
            >
              {isSubmitting ? <><Loader2 className="mr-2 w-5 h-5 animate-spin"/> Submitting</> : 'Check Answer'}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="w-full md:w-64 text-lg py-6 bg-white text-background hover:bg-white/90 group"
            >
              {hasMoreQuestions ? 'Next Question' : 'Complete Session'} <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
