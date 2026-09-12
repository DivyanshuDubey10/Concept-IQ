import { useState } from 'react'
import { Search, Play, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardData } from '../lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState('')
  const { topics } = dashboardData

  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-12 max-w-5xl">
      
      {/* Header */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="!mb-0">What do you want to learn?</h1>
          <p className="text-xl text-text-muted">Choose a topic and we'll adapt your learning path.</p>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <Card 
            key={topic.id} 
            className="group hover:border-primary/50 hover:shadow-premium-hover transition-all duration-300 flex flex-col"
          >
            <CardHeader>
              <CardTitle className="text-2xl">{topic.name}</CardTitle>
              <CardDescription className="text-base line-clamp-2">
                {topic.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              {topic.mastery > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-text-muted">Mastery</span>
                    <span className="text-white">{topic.mastery}%</span>
                  </div>
                  <Progress value={topic.mastery} indicatorClassName="bg-primary" />
                </div>
              ) : (
                <div className="h-[28px] flex items-end">
                  <span className="text-sm font-medium text-text-muted">Not started</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0">
              <Link to={`/topic/${topic.id}`} className="w-full sm:w-auto">
                <Button 
                  variant={topic.status === 'continue' ? 'default' : 'secondary'} 
                  className="w-full"
                >
                  {topic.status === 'continue' ? (
                    <>Continue <Play className="ml-2 w-4 h-4 fill-current" /></>
                  ) : (
                    <>Start topic <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTopics.length === 0 && (
        <div className="text-center py-20 px-6 border border-dashed border-border rounded-2xl">
          <p className="text-lg text-text-muted">No topics found matching "{searchQuery}".</p>
        </div>
      )}

    </div>
  )
}
