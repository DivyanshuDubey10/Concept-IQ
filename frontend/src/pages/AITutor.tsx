import { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, Sparkles, User, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

type Message = {
  id: string
  role: 'ai' | 'user'
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'ai',
    content: "I noticed you're reviewing **Base Cases** in Recursion. A base case is the condition that stops the recursive function from calling itself infinitely. Would you like to review how they work in practice?"
  }
]

const SUGGESTED_ACTIONS = [
  "Explain simpler",
  "Show an example",
  "Give me a hint",
  "Quiz me"
]

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, newUserMsg])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "That's a great question about base cases. Essentially, you always want to check for the simplest possible input (like n == 0) and return immediately without recursing further."
      
      if (text === "Show an example") {
        aiResponse = "Sure! Here is a classic example using Factorial:\n\n```python\ndef factorial(n):\n    # This is the base case\n    if n == 1:\n        return 1\n    # This is the recursive step\n    return n * factorial(n - 1)\n```\n\nNotice how the function stops calling itself when `n` reaches 1."
      } else if (text === "Explain simpler") {
        aiResponse = "Think of a base case like hitting the bottom of a swimming pool. If you keep diving without knowing where the bottom is, you'll never stop. The base case is the bottom—it tells the function 'you've gone deep enough, time to head back up'."
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: aiResponse }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto -mt-6">
      
      {/* Context Header */}
      <header className="py-6 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2 text-sm font-medium tracking-wide">
          <span className="text-text-muted">Python</span>
          <ChevronRight className="w-4 h-4 text-border" />
          <span className="text-text-muted">Recursion</span>
          <ChevronRight className="w-4 h-4 text-border" />
          <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">Base Cases</span>
        </div>
        <div className="flex items-center text-xs text-text-muted font-medium bg-surface/50 px-3 py-1.5 rounded-full border border-border/50">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
          AI Tutor Active
        </div>
      </header>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto py-8 space-y-8 scrollbar-hide">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex gap-6 max-w-3xl",
              msg.role === 'user' ? "ml-auto" : ""
            )}
          >
            {msg.role === 'ai' && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <BrainCircuit className="w-4 h-4 text-primary" />
                </div>
              </div>
            )}
            
            <div className={cn(
              "prose prose-invert prose-p:leading-relaxed max-w-none text-[1.05rem]",
              msg.role === 'user' ? "bg-surface/60 border border-border/50 px-6 py-4 rounded-2xl rounded-tr-sm text-white" : "text-white/90 pt-1.5"
            )}>
              {/* Very basic markdown simulation for the example code block */}
              {msg.content.includes("```") ? (
                <div>
                  <p>{msg.content.split("```")[0]}</p>
                  <pre className="bg-[#0d1117] p-4 rounded-xl border border-border/50 my-4 text-sm font-mono text-primary-hover overflow-x-auto">
                    <code>{msg.content.split("```")[1].replace("python\n", "")}</code>
                  </pre>
                  <p>{msg.content.split("```")[2]}</p>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            
            {msg.role === 'user' && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-surface border border-border/50 flex items-center justify-center">
                  <User className="w-4 h-4 text-text-muted" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Thinking State */}
        {isTyping && (
          <div className="flex gap-6 max-w-3xl animate-fade-in">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-primary/50" />
              </div>
            </div>
            <div className="pt-2.5 flex space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="pt-4 pb-8 bg-background">
        {/* Suggested Actions */}
        {!isTyping && messages[messages.length - 1].role === 'ai' && (
          <div className="flex flex-wrap gap-3 mb-6 animate-slide-up">
            {SUGGESTED_ACTIONS.map(action => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="text-sm font-medium px-4 py-2 rounded-full bg-surface/50 border border-border/50 text-text-muted hover:text-white hover:bg-surface hover:border-primary/50 transition-all"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Base Cases..."
            className="w-full bg-surface/30 border border-border/50 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:bg-surface/50 transition-all text-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-3 p-2.5 rounded-xl bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-xs text-text-muted/60">ConceptIQ AI can make mistakes. Verify important technical details.</span>
        </div>
      </div>
    </div>
  )
}
