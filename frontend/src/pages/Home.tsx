import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Target, Trophy, Clock, ArrowRight, Play, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { useAuth } from '../lib/contexts/AuthContext'
import { getProgress } from '../lib/api/progress'
import type { UserProgress } from '../lib/api/progress'
import { getTodayRevision } from '../lib/api/revision'
import type { RevisionItem } from '../lib/api/revision'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([])
  const [, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [progData, revData] = await Promise.all([
          getProgress(),
          getTodayRevision()
        ])
        setProgress(progData)
        setRevisionItems(revData)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  // Mock streak for UI since it's not in the API yet
  const mockStreak = 12
  const firstName = user?.name ? user.name.split(' ')[0] : 'User'

  // Find a weak concept to recommend for practice
  const needsAttention = (progress?.topics || [])
    .flatMap(t => t.concepts.map(c => ({ ...c, topicId: t.topic_id, topicName: t.topic_name })))
    .filter(c => c.mastery < 80)
    .sort((a, b) => a.mastery - b.mastery)[0]

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-2 tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-text-muted text-lg">
            You're on a <span className="text-primary font-semibold">{mockStreak}-day streak</span>. Let's keep the momentum going.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface/50 rounded-xl border border-border">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Daily Goal: 40 XP</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. Main Action / Hero Cell (Spans 8 cols) */}
        <Card className="md:col-span-8 md:row-span-2 border-0 bg-transparent relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-surface rounded-[24px] border border-text-main/5 shadow-premium glass-elevated" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/30 transition-colors duration-1000" />
          
          <CardContent className="p-8 md:p-12 relative z-10 h-full flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-text-main/10 backdrop-blur-md border border-text-main/20 text-text-main text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Target className="w-3.5 h-3.5" /> Continue Learning
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-text-main leading-[1.1] max-w-xl">
                Dive deeper into {needsAttention ? needsAttention.topicName : "your curriculum"}
              </h2>
              {needsAttention && (
                <p className="mt-4 text-text-muted text-lg max-w-md">
                  Your mastery of <strong>{needsAttention.name}</strong> is currently at {needsAttention.mastery}%. A quick practice session can boost this significantly.
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                onClick={() => navigate(needsAttention ? `/practice?topicId=${needsAttention.topicId}` : '/learn')}
                className="h-14 px-8 rounded-xl text-base font-semibold shadow-glow-primary hover:scale-[1.02] transition-transform"
              >
                <Play className="mr-2 w-5 h-5 fill-current" />
                {needsAttention ? 'Start Practice Session' : 'Browse Topics'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/learn')}
                className="h-14 px-8 rounded-xl text-base font-semibold bg-text-main/5 border border-text-main/10 hover:bg-text-main/10 text-text-main backdrop-blur-md"
              >
                Library
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Stats Mini Cells */}
        <div className="md:col-span-4 md:row-span-1 grid grid-cols-2 gap-5">
          {/* Average Mastery */}
          <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[20px] shadow-sm hover:bg-surface/50 transition-colors">
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-bold text-text-main tracking-tight">
                  {progress?.overall_mastery ? Math.round(progress.overall_mastery) : 0}%
                </div>
                <div className="text-xs text-text-muted font-medium uppercase tracking-widest mt-1">Avg. Mastery</div>
              </div>
            </CardContent>
          </Card>

          {/* Time Spent (Mock) */}
          <Card className="border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[20px] shadow-sm hover:bg-surface/50 transition-colors">
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-bold text-text-main tracking-tight">
                  2.4<span className="text-xl text-text-muted font-medium ml-1">h</span>
                </div>
                <div className="text-xs text-text-muted font-medium uppercase tracking-widest mt-1">This Week</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Today's Revision Cell */}
        <Card className="md:col-span-4 md:row-span-1 border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[24px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-text-main/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-main font-semibold">
              <Sparkles className="w-4 h-4 text-warning" />
              Spaced Repetition
            </div>
            {revisionItems.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-error/10 text-error">
                {revisionItems.length} Due
              </span>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-center">
            {revisionItems.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-text-muted leading-relaxed">
                  You have concepts fading from memory. Review them now to solidify your neural pathways.
                </p>
                <Button 
                  onClick={() => navigate('/revision')}
                  variant="secondary" 
                  className="w-full justify-between group border-text-main/10 hover:bg-text-main/5 bg-transparent"
                >
                  Start Review 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-text-muted" />
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-text-muted">All caught up for today!</p>
              </div>
            )}
          </div>
        </Card>

        {/* 4. Top Topics / Needs Attention */}
        <Card className="md:col-span-12 lg:col-span-12 border-text-main/5 bg-surface/30 backdrop-blur-md rounded-[24px] shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-main flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Curriculum Focus
            </h3>
            <Link to="/progress" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center">
              View full report <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress?.topics.slice(0, 3).map(topic => (
              <div 
                key={topic.topic_id}
                onClick={() => navigate(`/topic/${topic.topic_id}`)}
                className="p-5 rounded-2xl border border-text-main/5 bg-text-main/5 hover:bg-text-main/10 cursor-pointer transition-all duration-300 flex flex-col gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-main truncate pr-4">{topic.topic_name}</h4>
                  <span className="text-sm font-bold text-text-muted">{Math.round(topic.mastery)}%</span>
                </div>
                <Progress 
                  value={topic.mastery} 
                  className="h-1.5 bg-background"
                  indicatorClassName={
                    topic.mastery >= 80 ? "bg-success" : 
                    topic.mastery >= 50 ? "bg-primary" : "bg-warning"
                  } 
                />
              </div>
            ))}
            
            {(!progress?.topics || progress.topics.length === 0) && (
              <div className="col-span-full py-10 text-center border border-dashed border-text-main/10 rounded-2xl">
                <p className="text-text-muted">Start practicing to see your progress here.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
