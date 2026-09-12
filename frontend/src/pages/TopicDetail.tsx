import { ArrowLeft, Play, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardData } from '../lib/mock-data'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'

export default function TopicDetail() {
  const { topicDetail } = dashboardData

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      
      {/* Back navigation */}
      <Link 
        to="/learn" 
        className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text-main transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to library
      </Link>

      {/* Editorial Header */}
      <div className="space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
          {topicDetail.name}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <div className="space-y-2 max-w-sm">
            <div className="text-4xl font-light text-primary">{topicDetail.mastery}% <span className="text-lg text-text-muted">Mastery</span></div>
            <Progress value={topicDetail.mastery} indicatorClassName="bg-primary" className="h-1.5" />
          </div>
          <p className="text-xl text-text-muted md:max-w-md md:ml-auto leading-relaxed">
            "{topicDetail.message}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-border/50">
        
        {/* Recommended Next - Hero Action */}
        <div className="md:col-span-5 space-y-6">
          <h2 className="text-xl text-text-muted font-normal tracking-wide">Recommended next</h2>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <div className="text-sm font-medium uppercase tracking-widest text-primary/80">Focus Area</div>
                <h3 className="text-2xl font-semibold text-white">
                  {topicDetail.recommendedNext.action}
                </h3>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button className="w-full group">
                  <Play className="mr-2 w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                  Start Learning
                </Button>
                <Link to="/quiz/t1" className="w-full">
                  <Button variant="secondary" className="w-full group">
                    <Activity className="mr-2 w-4 h-4 text-primary group-hover:text-primary-hover" />
                    Take Diagnostic
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Concept Breakdown */}
        <div className="md:col-span-7 space-y-6">
          <h2 className="text-xl text-text-muted font-normal tracking-wide">Your concepts</h2>
          
          <div className="space-y-1">
            {topicDetail.concepts.map((concept) => (
              <div 
                key={concept.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl hover:bg-surface/50 transition-colors gap-4"
              >
                <span className="font-medium text-lg text-white">{concept.name}</span>
                <div className="flex items-center gap-4 w-full sm:w-48">
                  <Progress 
                    value={concept.mastery} 
                    indicatorClassName={
                      concept.mastery >= 80 ? "bg-success" : 
                      concept.mastery >= 50 ? "bg-primary" : "bg-warning"
                    } 
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold w-10 text-right text-text-muted">
                    {concept.mastery}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
