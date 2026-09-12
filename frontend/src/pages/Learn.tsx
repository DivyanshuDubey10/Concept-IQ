import { useState, useEffect } from 'react'
import { Search, Play, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTopics, Topic } from '../lib/api/topics'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Learn() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true)
        const data = await getTopics()
        setTopics(data)
      } catch (err) {
        console.error('Failed to fetch topics:', err)
        setError('Failed to load topics. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTopics()
  }, [])

  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (topic.description && topic.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-muted">Loading topics...</p>
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-error" />
          <p className="text-error font-medium">{error}</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-20 px-6 border border-dashed border-border rounded-2xl">
          <p className="text-lg text-text-muted">
            {topics.length === 0 ? "No topics available at the moment." : `No topics found matching "${searchQuery}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTopics.map((topic) => (
            <Card 
              key={topic.topic_id} 
              className="group hover:border-primary/50 hover:shadow-premium-hover transition-all duration-300 flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-2xl">{topic.name}</CardTitle>
                <CardDescription className="text-base line-clamp-2">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div className="text-sm font-medium text-text-muted">
                  Ready to practice
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Link to={`/topic/${topic.topic_id}`} className="w-full sm:w-auto">
                  <Button variant="default" className="w-full">
                    Start topic <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

    </div>
  )
}
