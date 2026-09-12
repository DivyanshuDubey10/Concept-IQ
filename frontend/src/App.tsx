import React from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Sparkles, ArrowRight, BrainCircuit, CheckCircle2, XCircle } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-background text-text-main p-8 md:p-16 max-w-6xl mx-auto space-y-16">
      
      <header className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-primary mb-2">
          <BrainCircuit className="w-6 h-6" />
          <span className="font-semibold tracking-wide">CONCEPTIQ</span>
        </div>
        <h1>Design System Foundation</h1>
        <p className="max-w-2xl text-text-muted text-lg">
          This is the foundational layer for the ConceptIQ web app. It embodies 
          simplicity, clarity, and a calm, intelligent aesthetic without the density of 
          typical enterprise dashboards.
        </p>
      </header>

      <section className="space-y-6">
        <h2>Typography & Language</h2>
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="!mb-1">Your progress</h1>
            <p>Confident, large headings using Inter.</p>
          </div>
          <div className="space-y-2">
            <h2 className="!mb-1">Today's revision</h2>
            <p>Clear section dividers.</p>
          </div>
          <div className="space-y-2">
            <h3 className="!mb-1">Learn with AI</h3>
            <p>Sub-headers for card titles and specific components.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2>Interactive Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Actions</CardTitle>
              <CardDescription>Distinct variants for specific user flows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-start">
              <Button className="w-full sm:w-auto">
                Continue learning <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto">
                Practice now
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto">
                Review past sessions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback States</CardTitle>
              <CardDescription>Subtle gradients and glowing shadows for answers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-start">
              <Button variant="success" className="w-full sm:w-auto">
                <CheckCircle2 className="mr-2 w-4 h-4" /> Correct Answer
              </Button>
              <Button variant="error" className="w-full sm:w-auto">
                <XCircle className="mr-2 w-4 h-4" /> Incorrect Answer
              </Button>
              <Button className="w-full sm:w-auto bg-primary text-white border border-primary-hover shadow-[0_0_20px_rgba(100,100,255,0.3)] hover:shadow-[0_0_30px_rgba(100,100,255,0.5)] transition-shadow duration-300">
                <Sparkles className="mr-2 w-4 h-4" /> AI Explanation
              </Button>
            </CardContent>
          </Card>

        </div>
      </section>

      <section className="space-y-6">
        <h2>Mastery Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Concept Badges</CardTitle>
              <CardDescription>Visualizing strength and weakness.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Badge variant="success">Mastered</Badge>
              <Badge variant="default">Improving</Badge>
              <Badge variant="warning">Needs practice</Badge>
              <Badge variant="error">Critical</Badge>
              <Badge variant="secondary">Not started</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Granular Progress</CardTitle>
              <CardDescription>Concept-level mastery tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Inheritance</span>
                  <span className="text-success">82%</span>
                </div>
                <Progress value={82} indicatorClassName="bg-success" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Polymorphism</span>
                  <span className="text-primary">61%</span>
                </div>
                <Progress value={61} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Method Overriding</span>
                  <span className="text-warning">38%</span>
                </div>
                <Progress value={38} indicatorClassName="bg-warning" />
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

    </div>
  )
}

export default App
