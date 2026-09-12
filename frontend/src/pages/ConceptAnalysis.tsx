import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BrainCircuit, Play, ArrowRight, TrendingDown } from 'lucide-react'
import { dashboardData } from '../lib/mock-data'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'

export default function ConceptAnalysis() {
  const { conceptAnalysis } = dashboardData
  
  // Animation state for progress bars
  const [animatedMastery, setAnimatedMastery] = useState({
    primary: 0,
    supporting: conceptAnalysis.supportingConcepts.map(() => 0)
  })

  useEffect(() => {
    // Slight delay to allow layout to settle, then animate to target values
    const timer = setTimeout(() => {
      setAnimatedMastery({
        primary: conceptAnalysis.primaryConcept.mastery,
        supporting: conceptAnalysis.supportingConcepts.map(c => c.mastery)
      })
    }, 150)
    
    return () => clearTimeout(timer)
  }, [conceptAnalysis])

  return (
    <div className="space-y-16 max-w-4xl mx-auto py-8">
      
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          {conceptAnalysis.heading}
        </h1>
        <p className="text-xl text-text-muted leading-relaxed">
          {conceptAnalysis.message}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Primary Concept Analysis (Weak Area) */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card className="border-warning/30 bg-warning/5 relative overflow-hidden group">
            {/* Soft glowing ambient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-warning/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-110" />
            
            <CardContent className="p-8 md:p-10 relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm font-medium uppercase tracking-widest text-warning/80">Primary Focus</div>
                  <h2 className="text-3xl font-semibold text-white tracking-tight">
                    {conceptAnalysis.primaryConcept.name}
                  </h2>
                </div>
                <div className="inline-flex items-center text-warning bg-warning/10 px-3 py-1 rounded-full text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  {conceptAnalysis.primaryConcept.status}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-5xl font-light text-white">
                    {animatedMastery.primary}% <span className="text-lg text-text-muted font-normal tracking-wide">Mastery</span>
                  </span>
                </div>
                {/* Longer duration for the primary progress bar animation */}
                <Progress 
                  value={animatedMastery.primary} 
                  indicatorClassName="bg-warning transition-transform duration-1000 ease-out" 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Supporting Concepts */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg text-text-muted font-medium px-1">Supporting concepts</h3>
            <div className="space-y-3">
              {conceptAnalysis.supportingConcepts.map((concept, idx) => (
                <div key={idx} className="flex justify-between items-center p-5 rounded-xl bg-surface/30 border border-border/30">
                  <span className="font-medium text-white">{concept.name}</span>
                  <div className="flex items-center gap-4 w-48">
                    <Progress 
                      value={animatedMastery.supporting[idx]} 
                      indicatorClassName="bg-success transition-transform duration-1000 ease-out" 
                    />
                    <span className="text-sm text-text-muted w-10 text-right">{animatedMastery.supporting[idx]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <Card className="border-primary/20 bg-surface/50 backdrop-blur-md">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">What to do next</h3>
                  <p className="text-text-muted leading-relaxed">
                    {conceptAnalysis.nextSteps.message}
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <Link to="/practice" className="block">
                    <Button className="w-full group text-base py-6">
                      <Play className="mr-2 w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                      Practice
                    </Button>
                  </Link>
                  <Link to="/ai-tutor" className="block">
                    <Button variant="secondary" className="w-full text-base py-6 group">
                      <BrainCircuit className="mr-2 w-5 h-5 text-primary group-hover:text-primary-hover" />
                      Learn with AI
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-4 text-center">
                  <Link to="/learn" className="text-sm font-medium text-text-muted hover:text-white transition-colors inline-flex items-center">
                    Return to library <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
