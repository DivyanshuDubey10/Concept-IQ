import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { dashboardData } from '../lib/mock-data'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Quiz() {
  const navigate = useNavigate()
  const { quizData } = dashboardData
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [animateKey, setAnimateKey] = useState(0) // Used to trigger fade in

  const question = quizData.questions[currentIndex]
  const isCorrect = selectedOptionId === question.correctOptionId
  const total = quizData.questions.length

  const handleSelect = (id: string) => {
    if (!hasSubmitted) {
      setSelectedOptionId(id)
    }
  }

  const handleSubmit = () => {
    if (!selectedOptionId) return
    setHasSubmitted(true)
  }

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setHasSubmitted(false)
      setSelectedOptionId(null)
      setCurrentIndex(prev => prev + 1)
      setAnimateKey(prev => prev + 1) // re-trigger animation
    } else {
      setIsCompleted(true)
    }
  }

  const handleExit = () => {
    navigate(-1)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in text-center space-y-6">
        <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Session Complete</h1>
        <p className="text-text-muted text-lg max-w-md">
          Great job! Your mastery metrics have been updated based on your performance.
        </p>
        <Button onClick={() => navigate('/learn')} className="mt-8 px-8">
          Return to Library
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-6 flex items-center justify-between">
        <div className="text-text-muted font-medium tracking-wide">
          <span className="text-white">{quizData.topicName}</span> <span className="mx-2 opacity-50">·</span> {quizData.conceptName}
        </div>
        <button 
          onClick={handleExit}
          className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-full transition-colors"
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
            Question {currentIndex + 1} of {total}
          </div>
          <Progress value={((currentIndex) / total) * 100} className="h-1" />
        </div>

        {/* Question & Options (Animated wrapper) */}
        <div key={animateKey} className="animate-fade-in space-y-10 flex-1">
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            {question.text}
          </h2>

          <div className="space-y-4">
            {question.options.map(option => {
              const isSelected = selectedOptionId === option.id
              const isCorrectAnswer = option.id === question.correctOptionId
              
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
                  disabled={hasSubmitted}
                  className={cn(
                    "w-full text-left p-6 rounded-xl border-2 transition-all duration-300 flex items-center text-lg",
                    stateClass,
                    !hasSubmitted && "cursor-pointer"
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

          {/* Feedback Area */}
          {hasSubmitted && (
            <div className={cn(
              "p-6 rounded-xl animate-slide-up mt-8",
              isCorrect ? "bg-success/10 border border-success/20 text-success" : "bg-error/10 border border-error/20 text-error"
            )}>
              <h3 className="font-semibold text-lg flex items-center mb-2">
                {isCorrect ? <><CheckCircle2 className="mr-2 w-5 h-5" /> Correct</> : <><XCircle className="mr-2 w-5 h-5" /> Incorrect</>}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={handleExit} className="text-text-muted hover:text-white">
            Exit
          </Button>
          
          {!hasSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedOptionId}
              className="w-48 text-lg"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="w-48 text-lg bg-white text-background hover:bg-white/90"
            >
              {currentIndex < total - 1 ? 'Next Question' : 'Complete Session'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
