import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, LayoutGrid, CheckCircle2, Circle, Loader2, AlertCircle, Activity } from 'lucide-react'
import { getTopicById } from '../lib/api/topics'
import type { Topic } from '../lib/api/topics'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopic() {
      if (!id) return
      try {
        setLoading(true)
        const data = await getTopicById(id)
        setTopic(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load topic')
      } finally {
        setLoading(false)
      }
    }
    fetchTopic()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm">Loading topic...</p>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Topic not found</h2>
          <p className="text-text-muted">{error || 'The topic you are looking for does not exist or has been removed.'}</p>
        </div>
        <Button onClick={() => navigate('/learn')} variant="secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to library
        </Button>
      </div>
    )
  }

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
          {topic.name}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <div className="space-y-2 max-w-sm">
            <div className="text-4xl font-light text-primary">
              {topic.mastery ?? 0}% <span className="text-lg text-text-muted">Mastery</span>
            </div>
            <Progress value={topic.mastery ?? 0} indicatorClassName="bg-primary" className="h-1.5" />
          </div>
          <p className="text-xl text-text-muted md:max-w-md md:ml-auto leading-relaxed">
            "{topic.description || "Master the concepts within this topic."}"
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
                  {topic.recommended_action || "Start learning concepts"}
                </h3>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link to={`/practice?topicId=${topic.topic_id}`} className="w-full">
                  <Button className="w-full group">
                    <Play className="mr-2 w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                    Start Learning
                  </Button>
                </Link>
                <Link to={`/quiz/${topic.topic_id}`} className="w-full">
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
          
          <div className="space-y-3">
            {topic.concepts?.map((concept) => (
              <div 
                key={concept.concept_id} 
                className="flex items-center p-4 rounded-xl border border-border/50 bg-surface/30 hover:bg-surface/50 transition-colors gap-4"
              >
                <div className="flex-shrink-0">
                  <Circle className="w-5 h-5 text-text-muted" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white/90">{concept.name}</h3>
                </div>
                {concept.mastery !== undefined && (
                  <div className="flex items-center gap-4 w-48">
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
                )}
              </div>
            ))}
            {(!topic.concepts || topic.concepts.length === 0) && (
              <div className="text-text-muted py-8 text-center border border-dashed border-border/50 rounded-xl">
                No concepts available for this topic yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
