import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCircle2, XCircle, ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { dashboardData } from '../lib/mock-data'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Practice() {
  const navigate = useNavigate()
  const { adaptivePracticeData } = dashboardData
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mastery, setMastery] = useState(adaptivePracticeData.initialMastery)
  const [animateKey, setAnimateKey] = useState(0)

  const question = adaptivePracticeData.questions[currentIndex]
  const isCorrect = selectedOptionId === question?.correctOptionId
  const hasMoreQuestions = currentIndex < adaptivePracticeData.questions.length - 1

  const handleSelect = (id: string) => {
    if (!hasSubmitted) {
      setSelectedOptionId(id)
    }
  }

  const handleSubmit = () => {
    if (!selectedOptionId) return
    setHasSubmitted(true)
    
    // Simulate algorithm: increase/decrease mastery visually
    if (selectedOptionId === question.correctOptionId) {
      setMastery(prev => Math.min(prev + 12, 100))
    } else {
      setMastery(prev => Math.max(prev - 5, 0))
    }
  }

  const handleNext = () => {
    if (hasMoreQuestions) {
      setHasSubmitted(false)
      setSelectedOptionId(null)
      setCurrentIndex(prev => prev + 1)
      setAnimateKey(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handleExit = () => {
    navigate('/analysis/t1')
  }

  if (isCompleted || !question) {
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
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-error bg-error/10"
  }
  
  // Next difficulty prediction (for UI feedback only)
  const nextDifficulty = hasMoreQuestions ? adaptivePracticeData.questions[currentIndex + 1].difficulty : question.difficulty

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-surface/30 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <div className="text-white font-medium text-lg">
            {adaptivePracticeData.conceptName}
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
            <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md", difficultyColors[question.difficulty as keyof typeof difficultyColors])}>
              {question.difficulty}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            {question.text}
          </h2>

          <div className="space-y-4 pt-4">
            {question.options.map(option => {
              const isSelected = selectedOptionId === option.id
              const isCorrectAnswer = option.id === question.correctOptionId
              
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

          {/* Adaptive Feedback */}
          {hasSubmitted && (
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
                    {question.explanation}
                  </p>
                </div>
                
                {/* Visualizing the transition */}
                {hasMoreQuestions && (
                  <div className="bg-background/80 backdrop-blur rounded-lg p-4 border border-border/50 min-w-[200px]">
                    <div className="text-sm font-medium text-text-muted mb-2">
                      {isCorrect ? "You're ready for something harder." : "Let's try one at the next level."}
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-sm">
                      <span className={difficultyColors[question.difficulty as keyof typeof difficultyColors] + " px-2 py-0.5 rounded"}>
                        {question.difficulty}
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-muted" />
                      <span className={difficultyColors[nextDifficulty as keyof typeof difficultyColors] + " px-2 py-0.5 rounded"}>
                        {nextDifficulty}
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
              disabled={!selectedOptionId}
              className="w-full md:w-64 text-lg py-6"
            >
              Check Answer
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
