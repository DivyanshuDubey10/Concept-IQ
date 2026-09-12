import { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { getTodayRevision, completeRevision, RevisionItem } from '../lib/api/revision'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'
import { Progress } from '../components/ui/progress'

export default function Revision() {
  const [items, setItems] = useState<(RevisionItem & { completed_at?: string })[]>([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchRevision() {
      try {
        setIsLoadingInitial(true)
        const data = await getTodayRevision()
        setItems(data)
      } catch (err: any) {
        console.error('Failed to fetch revision queue:', err)
        setError(err.message || 'Failed to load revision queue')
      } finally {
        setIsLoadingInitial(false)
      }
    }
    fetchRevision()
  }, [])

  const handleReview = async (id: number) => {
    setProcessingId(id)
    try {
      const response = await completeRevision(id)
      setItems(prev => prev.map(item => 
        item.concept_id === id ? { ...item, completed_at: response.next_revision_date } : item
      ))
    } catch (err: any) {
      console.error('Failed to complete revision:', err)
      // Normally we'd show a toast here
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-muted">Loading today's revision queue...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-error font-medium">{error}</p>
      </div>
    )
  }

  const allCompleted = items.length > 0 && items.every(i => i.completed_at != null)
  const noItems = items.length === 0

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-8 animate-fade-in">
      
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Today's revision
        </h1>
        <p className="text-lg text-text-muted">
          A few concepts worth revisiting today.
        </p>
      </div>

      {allCompleted ? (
        <div className="bg-success/5 border border-success/20 rounded-2xl p-10 text-center space-y-6 animate-slide-up">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-success" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">All caught up!</h2>
            <p className="text-text-muted">You've completed all your revision tasks for today.</p>
          </div>
        </div>
      ) : noItems ? (
        <div className="bg-surface/30 border border-border/50 rounded-2xl p-10 text-center space-y-4">
          <Calendar className="w-12 h-12 text-text-muted/50 mx-auto" />
          <h2 className="text-xl font-medium text-white">Nothing to review</h2>
          <p className="text-text-muted">Your spaced repetition queue is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => {
            const isCompleted = item.completed_at != null
            const isProcessing = processingId === item.concept_id

            return (
              <div 
                key={item.concept_id}
                className={cn(
                  "relative overflow-hidden border rounded-2xl p-6 transition-all duration-500",
                  isCompleted ? "bg-surface/10 border-success/20" : "bg-surface/40 border-border/50 hover:border-primary/40",
                  isProcessing ? "opacity-70 pointer-events-none" : ""
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  
                  {/* Left Side: Info */}
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                        {item.topic_name || 'General'}
                      </div>
                      <h3 className={cn("text-xl font-semibold", isCompleted ? "text-white/60 line-through decoration-white/20" : "text-white")}>
                        {item.name}
                      </h3>
                    </div>
                    
                    {!isCompleted && (
                      <div className="flex items-center gap-4 w-48">
                        <Progress value={item.current_mastery} className="h-1.5" />
                        <span className="text-sm font-medium text-text-muted">{item.current_mastery}%</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Status/Action */}
                  <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                    {isCompleted ? (
                      <>
                        <div className="flex items-center text-success font-medium">
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Revision complete
                        </div>
                        <div className="text-sm text-text-muted">
                          Next review <span className="text-white">{item.completed_at}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center text-warning font-medium text-sm bg-warning/10 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Due today
                        </div>
                        <Button 
                          onClick={() => handleReview(item.concept_id)}
                          className="group"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting...</>
                          ) : (
                            <>Review <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /></>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                  
                </div>
                
                {/* Completed subtle glow */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/5 to-transparent animate-shimmer pointer-events-none" />
                )}
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
