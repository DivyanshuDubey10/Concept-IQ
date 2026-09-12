import { useState, useEffect } from 'react'
import { TrendingUp, Award, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { getProgress, ProgressResponse } from '../lib/api/progress'
import { Progress } from '../components/ui/progress'

// Helper component for animating numbers
function AnimatedNumber({ value, duration = 1500 }: { value: number, duration?: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      
      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - Math.min(progress / duration, 1), 4)
      
      setCurrent(Math.floor(easeOut * value))
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCurrent(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{current}</span>
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    async function fetchProgress() {
      try {
        setIsLoading(true)
        const data = await getProgress()
        setProgressData(data)
      } catch (err: any) {
        console.error('Failed to fetch progress:', err)
        setError(err.message || 'Failed to load progress data')
      } finally {
        setIsLoading(false)
        setTimeout(() => setIsMounted(true), 100)
      }
    }
    fetchProgress()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-muted">Loading progress...</p>
      </div>
    )
  }

  if (error || !progressData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 max-w-md">
          <AlertCircle className="w-8 h-8 text-error" />
          <p className="text-error font-medium">{error || "No progress data available"}</p>
        </div>
      </div>
    )
  }

  // Calculate overall mastery
  let totalMastery = 0;
  let conceptCount = 0;
  progressData.topics.forEach(t => {
    t.concepts.forEach(c => {
      totalMastery += c.mastery;
      conceptCount++;
    })
  });
  const overallMastery = conceptCount > 0 ? Math.round(totalMastery / conceptCount) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-3xl font-medium text-text-muted tracking-wide">
          Your mastery
        </h1>
        <div className="flex items-end gap-6">
          <div className="text-8xl md:text-9xl font-light tracking-tighter text-white">
            <AnimatedNumber value={overallMastery} />
            <span className="text-5xl md:text-6xl text-text-muted ml-1">%</span>
          </div>
          <div className="mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-fade-in" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </div>
      </section>

      {/* Topics Breakdown */}
      <section className="space-y-10">
        {progressData.topics.map((topic, topicIdx) => (
          <div key={topicIdx} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white tracking-tight border-b border-border/30 pb-4">
              {topic.topic_name}
            </h2>
            <div className="space-y-2">
              {topic.concepts.map((concept, conceptIdx) => (
                <div 
                  key={conceptIdx} 
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-surface/30 transition-colors group"
                >
                  <span className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                    {concept.name}
                  </span>
                  
                  <div className="flex items-center gap-6 w-full max-w-[200px] sm:max-w-[300px]">
                    <Progress 
                      value={isMounted ? concept.mastery : 0} 
                      className="h-1.5 flex-1"
                      indicatorClassName="bg-primary/80 transition-transform duration-1000 ease-out"
                    />
                    <span className="text-sm font-semibold text-text-muted w-10 text-right">
                      {isMounted ? <AnimatedNumber value={concept.mastery} duration={2000} /> : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

    </div>
  )
}
