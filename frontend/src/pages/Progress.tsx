import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, BookOpen, Target, Loader2, Sparkles, Activity } from 'lucide-react'
import { getProgress } from '../lib/api/progress'
import type { UserProgress } from '../lib/api/progress'
import { Card, CardContent } from '../components/ui/card'
import { Progress as ProgressBar } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Progress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProgress()
        setProgress(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Analyzing performance...</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Activity className="w-12 h-12 text-text-muted opacity-50" />
        <p className="text-text-muted text-lg">No progress data available yet.</p>
      </div>
    )
  }

  const overall = Math.round(progress.overall_mastery)
  const sortedTopics = [...progress.topics].sort((a, b) => b.mastery - a.mastery)

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="space-y-3 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-main mb-0">Progress</h1>
        <p className="text-text-muted text-lg max-w-xl">
          Track your mastery across the curriculum. Consistency is key to long-term retention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Hero Stat */}
        <Card className="md:col-span-8 border-0 bg-transparent relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-surface rounded-[24px] border border-text-main/5 shadow-premium glass-elevated" />
          <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
          
          <CardContent className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative shrink-0">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-background fill-none stroke-[8]" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  className="stroke-primary fill-none stroke-[8]" 
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - overall / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-text-main tracking-tighter">{overall}%</span>
              </div>
            </div>
            
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-text-main/10 border border-text-main/20 text-text-main text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-warning" /> Overall Mastery
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-main leading-tight">
                {overall >= 80 ? "Outstanding performance." : overall >= 50 ? "Solid progress." : "Just getting started."}
              </h2>
              <p className="text-text-muted text-base">
                Your neural pathways are strengthening. Keep practicing to move concepts into long-term memory.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[24px] shadow-sm flex items-center p-6 gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0 shadow-glow-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-text-main tracking-tight">{progress.topics.length}</div>
              <div className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Active Topics</div>
            </div>
          </Card>
          
          <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[24px] shadow-sm flex items-center p-6 gap-5">
            <div className="w-14 h-14 rounded-2xl bg-success/15 text-success flex items-center justify-center shrink-0 shadow-glow-success">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-text-main tracking-tight">
                {progress.topics.flatMap(t => t.concepts).filter(c => c.mastery >= 80).length}
              </div>
              <div className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Concepts Mastered</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-text-main flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Topic Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedTopics.map(topic => {
            const isMastered = topic.mastery >= 80
            
            return (
              <Card key={topic.topic_id} className="border-text-main/5 bg-surface/30 hover:bg-surface-elevated transition-colors rounded-[20px]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isMastered && <Sparkles className="w-4 h-4 text-success" />}
                      <h4 className="font-semibold text-text-main text-lg">{topic.topic_name}</h4>
                    </div>
                    <span className={cn("text-lg font-bold", isMastered ? "text-success" : "text-text-main")}>
                      {Math.round(topic.mastery)}%
                    </span>
                  </div>
                  
                  <ProgressBar 
                    value={topic.mastery} 
                    className="h-2 bg-background mb-6"
                    indicatorClassName={isMastered ? "bg-success" : "bg-primary"} 
                  />
                  
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Concepts</div>
                    {topic.concepts.map((concept, idx) => (
                      <div key={concept.name || idx} className="flex items-center justify-between group">
                        <span className="text-[14px] text-text-muted group-hover:text-text-main transition-colors truncate pr-4">
                          {concept.name}
                        </span>
                        <div className="flex items-center gap-3 w-24 shrink-0">
                          <ProgressBar 
                            value={concept.mastery} 
                            className="h-1 flex-1 bg-background"
                            indicatorClassName={concept.mastery >= 80 ? "bg-success" : concept.mastery >= 50 ? "bg-primary" : "bg-text-muted"} 
                          />
                          <span className="text-[12px] font-mono text-text-muted font-medium w-8 text-right">
                            {Math.round(concept.mastery)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
