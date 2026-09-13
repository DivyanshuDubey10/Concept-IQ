import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles, TrendingUp, AlertCircle, Play, Loader2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { useAuth } from '../lib/contexts/AuthContext'
import { getProgress } from '../lib/api/progress'
import { getTodayRevision } from '../lib/api/revision'
import type { ProgressResponse } from '../lib/api/progress'
import type { RevisionItem } from '../lib/api/revision'

export default function Home() {
  const { user } = useAuth()
  const [progressData, setProgressData] = useState<ProgressResponse | null>(null)
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [prog, rev] = await Promise.all([getProgress(), getTodayRevision()])
        setProgressData(prog)
        setRevisionItems(rev)
      } catch {
        // API not yet available — graceful empty state
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Derive values from real API data
  const allConcepts = progressData?.topics.flatMap(t => t.concepts) ?? []
  const totalMastery = allConcepts.length > 0
    ? Math.round(allConcepts.reduce((sum, c) => sum + c.mastery, 0) / allConcepts.length)
    : 0

  // Weak concepts: mastery < 50%, sorted ascending
  const weakConcepts = allConcepts
    .filter(c => c.mastery < 50)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3)

  // Current focus: weakest concept, with its parent topic
  const currentFocusConcept = weakConcepts[0]
  const currentFocusTopic = currentFocusConcept
    ? progressData?.topics.find(t => t.concepts.some(c => c.name === currentFocusConcept.name))
    : progressData?.topics[0]

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-4xl">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="!mb-0">Good morning, {firstName}.</h1>
        <p className="text-xl text-text-muted">Here is what you should focus on today.</p>
      </div>

      {/* Hero: Continue Learning */}
      {currentFocusConcept ? (
        <section className="space-y-4">
          <h2 className="text-xl text-text-muted font-normal tracking-wide">Continue learning</h2>
          <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
            <CardContent className="p-8 md:p-12 space-y-8 relative z-10">
              <div className="space-y-2">
                <div className="text-sm font-medium tracking-widest uppercase text-primary/80">
                  {currentFocusTopic?.topic_name}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {currentFocusConcept.name}
                </h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="space-y-2 flex-1 max-w-xs">
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-light text-white">
                      {currentFocusConcept.mastery}% <span className="text-lg text-text-muted">mastery</span>
                    </span>
                  </div>
                  <Progress value={currentFocusConcept.mastery} indicatorClassName="bg-warning" className="h-1.5" />
                  <p className="text-text-muted">Let's strengthen this concept.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 md:ml-auto">
                  <Button variant="secondary" className="group">
                    <Sparkles className="mr-2 w-4 h-4 text-primary group-hover:text-primary-hover transition-colors" />
                    Ask AI Tutor
                  </Button>
                  <Button className="group">
                    Continue Practice
                    <Play className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="space-y-4">
          <h2 className="text-xl text-text-muted font-normal tracking-wide">Get started</h2>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 md:p-12 text-center space-y-4">
              <p className="text-text-muted text-lg">No active topic yet. Head to the Learn page to pick one!</p>
              <Button className="group">
                Browse Topics
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Overall Progress */}
        <section className="space-y-4">
          <h2 className="text-xl text-text-muted font-normal tracking-wide">Your progress</h2>
          <Card className="h-[200px] flex flex-col justify-center border-border/50">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-5xl font-light text-white tracking-tight mb-2">
                    {totalMastery}%
                  </div>
                  {allConcepts.length > 0 && (
                    <div className="inline-flex items-center text-success text-sm font-medium bg-success/10 px-2.5 py-1 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                      Overall mastery
                    </div>
                  )}
                </div>
              </div>
              <Progress value={totalMastery} indicatorClassName="bg-primary" className="h-1" />
            </CardContent>
          </Card>
        </section>

        <div className="space-y-12">
          {/* Needs Attention */}
          {weakConcepts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl text-text-muted font-normal tracking-wide">Needs your attention</h2>
              <div className="space-y-3">
                {weakConcepts.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-surface border border-border/50 hover:border-border transition-colors group cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <span className="font-medium text-white">{item.name}</span>
                    </div>
                    <span className="text-warning font-semibold">{item.mastery}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Today's Revision */}
          {revisionItems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl text-text-muted font-normal tracking-wide">Today's revision</h2>
              <div className="space-y-3">
                {revisionItems.map((item) => (
                  <div key={item.concept_id} className="flex justify-between items-center p-4 rounded-xl bg-surface border border-border/50 hover:border-border transition-colors group cursor-pointer">
                    <div className="space-y-1">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-text-muted">Due today</div>
                    </div>
                    <Button variant="ghost" className="text-primary hover:text-primary-hover px-4">
                      Review <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {weakConcepts.length === 0 && revisionItems.length === 0 && !isLoading && allConcepts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl text-text-muted font-normal tracking-wide">All caught up!</h2>
              <Card className="border-success/20 bg-success/5">
                <CardContent className="p-6 text-center">
                  <p className="text-text-muted">No weak concepts or revision due. Great work!</p>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
