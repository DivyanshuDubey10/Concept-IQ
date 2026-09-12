import { useState, useEffect } from 'react'
import { TrendingUp, Award, ChevronRight } from 'lucide-react'
import { dashboardData } from '../lib/mock-data'
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
  const { progressData } = dashboardData
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Small delay to trigger CSS transitions after mount
    const t = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-3xl font-medium text-text-muted tracking-wide">
          Your mastery
        </h1>
        <div className="flex items-end gap-6">
          <div className="text-8xl md:text-9xl font-light tracking-tighter text-white">
            <AnimatedNumber value={progressData.overallMastery} />
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
              {topic.name}
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

      {/* Improving Section */}
      <section className="space-y-6 pt-8 border-t border-border/30">
        <div className="flex items-center text-success mb-2">
          <TrendingUp className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-medium tracking-wide uppercase">Improving</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressData.improving.map((item, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-success/10 to-transparent border border-success/20 rounded-2xl p-6 relative overflow-hidden group hover:border-success/40 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                {item.name}
              </h3>
              
              <div className="flex items-center gap-4 text-3xl font-light text-white">
                <span className="text-text-muted">{item.previousMastery}%</span>
                <ChevronRight className="w-6 h-6 text-success/50" />
                <span className="text-success font-medium">
                  {isMounted ? <AnimatedNumber value={item.currentMastery} duration={2000} /> : item.previousMastery}%
                </span>
              </div>
              
              {/* Subtle visual flair */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-success/20 rounded-full blur-[30px] group-hover:scale-150 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
