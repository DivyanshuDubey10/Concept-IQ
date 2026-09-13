import { useState, useEffect } from 'react'
import { CalendarSync, CheckCircle2, Clock, Brain, Loader2, Play } from 'lucide-react'
import { getTodayRevision, completeRevision } from '../lib/api/revision'
import type { RevisionItem } from '../lib/api/revision'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Revision() {
  const [items, setItems] = useState<RevisionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodayRevision()
        setItems(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleComplete = async (conceptId: number) => {
    try {
      setCompletingId(conceptId)
      await completeRevision(conceptId)
      // Optimistically remove from list with a slight delay for animation
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.concept_id !== conceptId))
        setCompletingId(null)
      }, 500)
    } catch (err) {
      console.error(err)
      setCompletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading your revision schedule...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="space-y-4 relative z-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest shadow-glow-primary">
          <CalendarSync className="w-4 h-4" /> Spaced Repetition
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-main mb-0">Daily Review</h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto md:mx-0">
          Concepts fading from memory are queued here. Review them at the optimal time to maximize long-term retention.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="border-0 bg-transparent relative overflow-hidden group mt-10">
          <div className="absolute inset-0 bg-gradient-surface rounded-[32px] border border-text-main/5 shadow-premium glass-elevated" />
          <CardContent className="p-16 relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center shadow-glow-success">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-text-main">All caught up!</h2>
              <p className="text-text-muted text-lg max-w-sm mx-auto">
                You've completed all scheduled reviews for today. Great job maintaining your neural pathways.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Due Today
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-text-main/10 text-text-main">
              {items.length} Remaining
            </span>
          </div>

          {items.map(item => {
            const isCompleting = completingId === item.concept_id
            
            return (
              <Card 
                key={item.concept_id} 
                className={cn(
                  "border-text-main/5 bg-surface/30 backdrop-blur-md hover:bg-surface-elevated transition-all duration-300 rounded-[20px] overflow-hidden",
                  isCompleting && "opacity-50 scale-[0.98] blur-[2px]"
                )}
              >
                {/* Shimmer effect for lowest mastery items to draw attention */}
                {item.current_mastery < 50 && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-error/50 to-transparent animate-shimmer" />
                )}
                
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-text-main/5 border border-text-main/10 text-text-muted flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left min-w-0 w-full">
                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">
                      {item.topic_name || "General"}
                    </div>
                    <h3 className="text-xl font-bold text-text-main truncate mb-4">{item.name}</h3>
                    
                    <div className="flex items-center gap-4 max-w-sm mx-auto md:mx-0">
                      <Progress 
                        value={item.current_mastery} 
                        className="h-1.5 bg-background flex-1"
                        indicatorClassName={
                          item.current_mastery >= 80 ? "bg-success" : 
                          item.current_mastery >= 50 ? "bg-primary" : "bg-error"
                        }
                      />
                      <span className="text-sm font-mono font-medium text-text-muted w-10 text-right">
                        {item.current_mastery}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <div className="w-full md:w-auto mt-4 md:mt-0 shrink-0">
                    <Button 
                      onClick={() => handleComplete(item.concept_id)}
                      disabled={isCompleting}
                      className={cn(
                        "w-full md:w-40 h-12 rounded-xl font-semibold transition-all shadow-glow-primary",
                        isCompleting ? "bg-success hover:bg-success text-text-main" : ""
                      )}
                    >
                      {isCompleting ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Done
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 fill-current" />
                          Review Now
                        </>
                      )}
                    </Button>
                  </div>
                  
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
