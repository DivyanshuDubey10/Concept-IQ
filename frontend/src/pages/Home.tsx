import { ArrowRight, Sparkles, TrendingUp, AlertCircle, Play } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { dashboardData } from '../lib/mock-data'

export default function Home() {
  const { user, currentFocus, overallProgress, needsAttention, todaysRevision } = dashboardData;

  return (
    <div className="space-y-12 max-w-4xl">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="!mb-0">Good morning, {user.firstName}.</h1>
        <p className="text-xl text-text-muted">Here is what you should focus on today.</p>
      </div>

      {/* Hero: Continue Learning */}
      <section className="space-y-4">
        <h2 className="text-xl text-text-muted font-normal tracking-wide">Continue learning</h2>
        <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          
          <CardContent className="p-8 md:p-12 space-y-8 relative z-10">
            <div className="space-y-2">
              <div className="text-sm font-medium tracking-widest uppercase text-primary/80">
                {currentFocus.topic} / {currentFocus.subtopic}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {currentFocus.concept}
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="space-y-2 flex-1 max-w-xs">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-light text-white">{currentFocus.mastery}% <span className="text-lg text-text-muted">mastery</span></span>
                </div>
                <Progress value={currentFocus.mastery} indicatorClassName="bg-warning" className="h-1.5" />
                <p className="text-text-muted">{currentFocus.message}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Your Progress */}
        <section className="space-y-4">
          <h2 className="text-xl text-text-muted font-normal tracking-wide">Your progress</h2>
          <Card className="h-[200px] flex flex-col justify-center border-border/50">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-5xl font-light text-white tracking-tight mb-2">
                    {overallProgress.percentage}%
                  </div>
                  <div className="inline-flex items-center text-success text-sm font-medium bg-success/10 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    +{overallProgress.changeThisWeek}% this week
                  </div>
                </div>
              </div>
              <Progress value={overallProgress.percentage} indicatorClassName="bg-primary" className="h-1" />
            </CardContent>
          </Card>
        </section>

        {/* Needs Attention & Today's Revision */}
        <div className="space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-xl text-text-muted font-normal tracking-wide">Needs your attention</h2>
            <div className="space-y-3">
              {needsAttention.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-surface border border-border/50 hover:border-border transition-colors group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="font-medium text-white">{item.name}</span>
                  </div>
                  <span className="text-warning font-semibold">{item.mastery}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl text-text-muted font-normal tracking-wide">Today's revision</h2>
            <div className="space-y-3">
              {todaysRevision.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-surface border border-border/50 hover:border-border transition-colors group cursor-pointer">
                  <div className="space-y-1">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-sm text-text-muted">{item.dueStatus}</div>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-primary-hover px-4">
                    Review <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

    </div>
  )
}
