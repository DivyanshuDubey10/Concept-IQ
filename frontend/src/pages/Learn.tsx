import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, Loader2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
import { getTopics } from '../lib/api/topics'
import type { Topic } from '../lib/api/topics'
import { Card, CardContent } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

export default function Learn() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchTopics() {
      try {
        const data = await getTopics()
        setTopics(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load topics')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const colors = [
    'from-blue-500 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-orange-400 to-red-500',
    'from-purple-500 to-pink-500',
    'from-amber-400 to-orange-500',
  ]

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="space-y-3 z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-main mb-0">Library</h1>
          <p className="text-text-muted text-lg max-w-xl">
            Explore your curriculum. Master the fundamentals and tackle advanced concepts at your own pace.
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group z-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 bg-surface/50 border border-border/50 rounded-2xl text-[14px] text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm backdrop-blur-md"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-text-muted text-sm font-medium">Syncing library...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-error/10 border border-error/20 rounded-2xl flex items-center text-error max-w-md mx-auto mt-20">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <p className="font-medium text-[14px]">{error}</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-2">
            <BookOpen className="w-8 h-8 text-text-muted opacity-50" />
          </div>
          <p className="text-text-main font-medium text-lg">No topics found.</p>
          <p className="text-text-muted text-[14px]">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, i) => {
            const gradient = colors[i % colors.length]
            const isMastered = (topic.mastery || 0) >= 80
            
            return (
              <Link key={topic.topic_id} to={`/topic/${topic.topic_id}`} className="group block">
                <Card className="h-full border-border/40 bg-surface/30 hover:bg-surface-elevated hover:border-border transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-premium-hover hover:-translate-y-1">
                  
                  {/* Subtle color accent on left edge */}
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-70 group-hover:opacity-100 transition-opacity", gradient)} />
                  
                  <CardContent className="p-6 md:p-8 flex flex-col h-full pl-8 md:pl-10">
                    <div className="mb-auto space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-text-main shadow-md bg-gradient-to-br", 
                          gradient
                        )}>
                          {isMastered ? <Sparkles className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </div>
                        {topic.mastery !== undefined && topic.mastery > 0 && (
                          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-text-main/5 border border-text-main/10 text-text-main flex items-center gap-1.5">
                            {topic.mastery}% <span className="text-text-muted font-medium">Mastery</span>
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors">
                          {topic.name}
                        </h2>
                        <p className="text-[14px] text-text-muted line-clamp-2 leading-relaxed">
                          {topic.description || "Core concepts and fundamental principles."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-border/40 flex items-center justify-between">
                      <div className="flex-1 mr-6">
                        {topic.mastery !== undefined ? (
                          <Progress 
                            value={topic.mastery} 
                            className="h-1.5 bg-background" 
                            indicatorClassName={cn(isMastered ? "bg-success" : "bg-primary")}
                          />
                        ) : (
                          <span className="text-[12px] text-text-muted font-medium uppercase tracking-widest">Not started</span>
                        )}
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-text-main/5 flex items-center justify-center group-hover:bg-primary group-hover:text-text-main text-text-muted transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
