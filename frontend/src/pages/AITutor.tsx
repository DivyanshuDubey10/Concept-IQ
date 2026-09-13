import { useState, useRef, useEffect } from 'react'
import { Send, BrainCircuit, User, Sparkles, Bot } from 'lucide-react'
import { useAuth } from '../lib/contexts/AuthContext'
import { cn } from '../lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AITutor() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your AI Tutor. I can help explain difficult concepts, provide practice problems, or guide you through your curriculum. What would you like to focus on today?`
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate network delay / AI generation
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm currently running in demonstration mode. In a full production environment, this would connect to the NVIDIA NIM API to provide deep, concept-aware tutoring based on your specific curriculum and mastery data."
        }
      ])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto animate-fade-in relative z-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 py-4 md:py-6 border-b border-border/40 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary shrink-0 relative">
          <BrainCircuit className="w-6 h-6 text-text-main" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
            ConceptIQ Tutor <Sparkles className="w-4 h-4 text-primary" />
          </h1>
          <p className="text-sm text-text-muted">Powered by AI · Always online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          return (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full gap-4 max-w-[85%]",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                isUser ? "bg-surface border border-text-main/10" : "bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 text-primary"
              )}>
                {isUser ? <User className="w-4 h-4 text-text-muted" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={cn(
                "px-5 py-4 rounded-[24px] text-[15px] leading-relaxed relative",
                isUser 
                  ? "bg-primary text-text-main rounded-tr-sm shadow-nav-pill" 
                  : "bg-surface/50 border border-text-main/5 text-text-main/90 rounded-tl-sm glass"
              )}>
                {msg.content}
              </div>
            </div>
          )
        })}
        
        {isTyping && (
          <div className="flex w-full gap-4 max-w-[85%] mr-auto animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-5 py-4 rounded-[24px] rounded-tl-sm bg-surface/50 border border-text-main/5 glass flex items-center gap-1.5 h-12 w-20">
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="pt-4 pb-6 shrink-0 bg-background/80 backdrop-blur-xl border-t border-border/40">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a concept..."
            className="w-full pl-5 pr-14 py-4 bg-surface/50 border border-text-main/10 rounded-2xl text-[15px] text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none shadow-sm h-14 overflow-hidden leading-tight glass"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-primary flex items-center justify-center text-text-main disabled:opacity-50 disabled:bg-surface disabled:text-text-muted transition-all hover:bg-primary-hover shadow-glow-primary disabled:shadow-none"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[11px] text-text-muted font-medium">AI can make mistakes. Verify important information.</span>
        </div>
      </div>

    </div>
  )
}
