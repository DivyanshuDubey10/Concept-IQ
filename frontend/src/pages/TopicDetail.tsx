import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, CheckCircle2, Circle, Loader2, AlertCircle, Activity } from 'lucide-react'
import { getTopicById } from '../lib/api/topics'
import type { Topic } from '../lib/api/topics'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopic() {
      if (!topicId) return
      try {
        setLoading(true)
        const data = await getTopicById(topicId)
        setTopic(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load topic')
      } finally {
        setLoading(false)
      }
    }
    fetchTopic()
  }, [topicId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading topic...</p>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto shadow-glow-error">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-main">Topic not found</h2>
          <p className="text-text-muted">{error || 'The topic you are looking for does not exist or has been removed.'}</p>
        </div>
        <Button onClick={() => navigate('/learn')} variant="secondary" className="glass-elevated border-text-main/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to library
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-fade-in pb-10">
      
      {/* Back navigation */}
      <button 
        onClick={() => navigate('/learn')}
        className="inline-flex items-center text-[13px] font-semibold tracking-wide text-text-muted hover:text-text-main transition-colors group uppercase"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
        Library
      </button>

      {/* Editorial Header */}
      <div className="space-y-6 relative">
        {/* Glow behind text */}
        <div className="absolute -top-10 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main max-w-3xl relative z-10">
          {topic.name}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6 md:items-end relative z-10">
          <div className="space-y-3 min-w-[200px]">
            <div className="text-5xl font-light text-primary tracking-tighter">
              {topic.mastery ?? 0}% <span className="text-lg text-text-muted tracking-normal font-medium">Mastery</span>
            </div>
            <Progress value={topic.mastery ?? 0} indicatorClassName="bg-gradient-to-r from-primary to-purple-500" className="h-1.5 bg-surface-elevated" />
          </div>
          <p className="text-lg text-text-muted/80 md:max-w-lg md:ml-auto leading-relaxed border-l-2 border-primary/30 pl-6 py-1">
            {topic.description || "Master the core concepts to unlock your true potential in this subject."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-border/40">
        
        {/* Recommended Next - Hero Action */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-[13px] text-text-muted font-bold tracking-widest uppercase">Up Next</h3>
          
          <Card className="border-0 bg-transparent relative overflow-hidden group">
            {/* Glossy gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-purple-500/10 rounded-2xl border border-text-main/10 glass-elevated" />
            
            <CardContent className="p-8 space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest border border-primary/20 shadow-glow-primary">
                  <Play className="w-3 h-3 fill-current" /> Action
                </div>
                <h3 className="text-2xl font-bold text-text-main leading-tight">
                  {topic.recommended_action || "Start learning concepts"}
                </h3>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link to={`/practice?topicId=${topic.topic_id}`} className="w-full">
                  <Button className="w-full h-12 text-[14px] shadow-glow-primary hover:scale-[1.02] transition-transform">
                    Start Learning <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                  </Button>
                </Link>
                <Link to={`/quiz/${topic.topic_id}`} className="w-full">
                  <Button variant="secondary" className="w-full h-12 text-[14px] bg-text-main/5 border border-text-main/10 hover:bg-text-main/10 text-text-main">
                    <Activity className="mr-2 w-4 h-4 text-primary" />
                    Take Diagnostic
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Concept Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] text-text-muted font-bold tracking-widest uppercase">Curriculum</h3>
            <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              {topic.concepts?.length || 0} Modules
            </span>
          </div>
          
          <div className="space-y-3">
            {topic.concepts?.map((concept, idx) => {
              const isMastered = (concept.mastery || 0) >= 80;
              const isLearning = (concept.mastery || 0) > 0 && (concept.mastery || 0) < 80;
              
              return (
                <div 
                  key={concept.concept_id} 
                  className="group flex items-center p-4 md:p-5 rounded-2xl border border-border/50 bg-surface/30 hover:bg-surface-elevated hover:border-border transition-all duration-300 gap-4 cursor-default"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                    isMastered ? "bg-success/10 border-success/30 text-success shadow-glow-success" : 
                    isLearning ? "bg-primary/10 border-primary/30 text-primary shadow-glow-primary" : 
                    "bg-text-main/5 border-text-main/10 text-text-muted"
                  )}>
                    {isMastered ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-[14px]">{idx + 1}</span>}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-text-main/90 truncate group-hover:text-text-main transition-colors">
                      {concept.name}
                    </h3>
                  </div>
                  
                  {concept.mastery !== undefined && (
                    <div className="flex items-center gap-4 w-32 md:w-48 justify-end">
                      <Progress 
                        value={concept.mastery} 
                        indicatorClassName={cn(
                          "transition-all duration-700",
                          isMastered ? "bg-success" : 
                          isLearning ? "bg-primary" : "bg-text-muted"
                        )} 
                        className="hidden md:flex h-1.5 flex-1 bg-background"
                      />
                      <span className={cn(
                        "text-[14px] font-bold w-10 text-right font-mono",
                        isMastered ? "text-success" : "text-text-main"
                      )}>
                        {concept.mastery}%
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
            
            {(!topic.concepts || topic.concepts.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/50 rounded-2xl bg-surface/10">
                <Circle className="w-8 h-8 text-border mb-3" />
                <p className="text-text-muted font-medium">No concepts available for this topic yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
