import { useState, useRef, useEffect } from 'react'
import { Send, BrainCircuit, User, Sparkles, Bot, AlertCircle, Plus, MessageSquare, Trash2, Menu, X, MoreHorizontal, Copy, Edit2, Trash } from 'lucide-react'
import { useAuth } from '../lib/contexts/AuthContext'
import { cn } from '../lib/utils'
import { sendChatMessage, getChatSessions, getChatMessages, deleteChatSession, type ChatMessage, type ChatSession } from '../lib/api/tutor'
import ReactMarkdown from 'react-markdown'
import { Button } from '../components/ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
}

export default function AITutor() {
  const { user } = useAuth()
  
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [sessionMenuId, setSessionMenuId] = useState<number | null>(null)
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null)
  const [editTitleValue, setEditTitleValue] = useState('')

  // Chat State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    const closeMenus = () => {
      setOpenMenuId(null)
      setSessionMenuId(null)
    }
    window.addEventListener('click', closeMenus)
    return () => window.removeEventListener('click', closeMenus)
  }, [])

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    setOpenMenuId(null)
  }

  const handleDeleteMessage = (id: string) => {
    // In a real app, you would delete from the backend here.
    // For now, we'll just remove it from local state.
    setMessages(prev => prev.filter(m => m.id !== id))
    setOpenMenuId(null)
  }

  const handleEditMessage = (id: string, content: string) => {
    // Basic local edit behavior: copy to input, remove message and its replies.
    // In a real app, you'd branch the conversation or PUT to an endpoint.
    setInput(content)
    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === id)
      if (idx === -1) return prev
      return prev.slice(0, idx)
    })
    setOpenMenuId(null)
  }

  const defaultGreeting: Message = {
    id: 'default-1',
    role: 'assistant',
    content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your AI Tutor. I can help explain difficult concepts, provide practice problems, or guide you through your curriculum. What would you like to focus on today?`
  }

  // Load Sessions on Mount
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true)
      const data = await getChatSessions()
      setSessions(data)
    } catch (err) {
      console.error("Failed to load sessions:", err)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  // Load Messages when Active Session Changes
  useEffect(() => {
    if (activeSessionId) {
      loadMessagesForSession(activeSessionId)
    } else {
      setMessages([defaultGreeting])
    }
  }, [activeSessionId])

  const loadMessagesForSession = async (id: number) => {
    try {
      setIsTyping(true)
      const data = await getChatMessages(id)
      if (data.length === 0) {
        setMessages([defaultGreeting])
      } else {
        setMessages(data.map(m => ({
          id: m.id?.toString() || Math.random().toString(),
          role: m.role,
          content: m.content
        })))
      }
    } catch (err) {
      console.error("Failed to load messages:", err)
      setMessages([{ id: 'err', role: 'assistant', content: 'Failed to load chat history.', isError: true }])
    } finally {
      setIsTyping(false)
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleNewChat = () => {
    setActiveSessionId(null)
    setMessages([defaultGreeting])
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  const handleDeleteSession = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this chat?")) return
    try {
      await deleteChatSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
      if (activeSessionId === id) {
        handleNewChat()
      }
    } catch (err) {
      console.error("Failed to delete session", err)
    }
  }

  const handleSelectSession = (id: number) => {
    if (editingSessionId === id) return // Don't select if currently editing
    setActiveSessionId(id)
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation()
    setEditingSessionId(session.id)
    setEditTitleValue(session.title)
    setSessionMenuId(null)
  }

  const handleSaveRename = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation()
    if (editingSessionId && editTitleValue.trim()) {
      setSessions(prev => prev.map(s => s.id === editingSessionId ? { ...s, title: editTitleValue.trim() } : s))
    }
    setEditingSessionId(null)
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userText = input.trim()
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      // Build the chat history payload (strip out internal UI fields like id and isError)
      // Only send the current message if it's a new chat, the backend will construct it properly.
      // Wait, the API takes the *latest* list of messages to append. Actually, we can just send the new message and history.
      const historyPayload: ChatMessage[] = messages
        .filter(m => !m.isError && m.id !== 'default-1') // don't send the hardcoded local default greeting
        .map(m => ({ role: m.role, content: m.content }));
      
      // Append the new user message
      historyPayload.push({ role: 'user', content: userText });

      // Call the backend API
      const response = await sendChatMessage(historyPayload, activeSessionId);

      // If this was a new session, update the active ID and refresh session list
      if (!activeSessionId) {
        setActiveSessionId(response.session_id)
        fetchSessions() // Refresh sidebar
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.reply
        }
      ])
    } catch (error: any) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I am having trouble connecting right now. Please try again later.',
          isError: true
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex overflow-hidden bg-background relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border/40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-full",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-border/40 flex justify-between items-center shrink-0">
          <Button 
            onClick={handleNewChat} 
            className="w-full flex items-center justify-start gap-2 h-11 text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border-none shadow-none"
          >
            <Plus className="w-4 h-4" /> New Chat
          </Button>
          <button className="md:hidden ml-2 p-2 text-text-muted" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-2 mt-2">History</h3>
          
          {isLoadingSessions ? (
            <div className="px-2 text-sm text-text-muted">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="px-2 text-sm text-text-muted">No past chats.</div>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={cn(
                  "group relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm",
                  activeSessionId === session.id 
                    ? "bg-primary/20 text-text-main" 
                    : "text-text-muted hover:bg-surface-elevated hover:text-text-main"
                )}
              >
                {editingSessionId === session.id ? (
                  <input
                    autoFocus
                    value={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    onBlur={() => handleSaveRename()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(e)
                      if (e.key === 'Escape') setEditingSessionId(null)
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-full bg-surface border border-primary/50 rounded px-2 py-1 text-text-main focus:outline-none text-sm"
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-3 overflow-hidden pr-6">
                      <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                      <span className="truncate">{session.title}</span>
                    </div>
                    
                    <div className={cn(
                      "absolute right-2 transition-opacity",
                      "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                      sessionMenuId === session.id && "!opacity-100"
                    )}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSessionMenuId(sessionMenuId === session.id ? null : session.id); }}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-surface-elevated transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {sessionMenuId === session.id && (
                        <div 
                          className="absolute top-full right-0 mt-1 w-36 bg-surface border border-border/50 rounded-xl shadow-xl py-1 z-50 flex flex-col overflow-hidden"
                          onClick={e => e.stopPropagation()}
                        >
                          <button onClick={(e) => handleStartRename(e, session)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-main hover:bg-surface-elevated transition-colors text-left">
                            <Edit2 className="w-3.5 h-3.5 shrink-0" /> Rename
                          </button>
                          <div className="h-px bg-border/40 mx-2" />
                          <button onClick={(e) => { setSessionMenuId(null); handleDeleteSession(e, session.id); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-error hover:bg-error/10 transition-colors text-left">
                            <Trash className="w-3.5 h-3.5 shrink-0" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 py-4 px-4 md:px-8 border-b border-border/40 shrink-0 bg-background/80 backdrop-blur-xl z-20">
          <button 
            className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-main"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary shrink-0 relative">
            <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-text-main" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
              ConceptIQ Tutor <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs md:text-sm text-text-muted">Powered by AI · Always online</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'
              return (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex w-full gap-4 max-w-[95%] md:max-w-[85%]",
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                    isUser ? "bg-surface border border-text-main/10" : msg.isError ? "bg-red-500/20 border border-red-500/20 text-red-500" : "bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 text-primary"
                  )}>
                    {isUser ? <User className="w-4 h-4 text-text-muted" /> : msg.isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={cn(
                    "px-4 md:px-5 py-3 md:py-4 rounded-[24px] text-[14px] md:text-[15px] leading-relaxed relative group/msg transition-all",
                    isUser 
                      ? "bg-primary text-text-main rounded-tr-sm shadow-nav-pill" 
                      : msg.isError
                      ? "bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-sm glass"
                      : "bg-surface/50 border border-text-main/5 text-text-main/90 rounded-tl-sm glass"
                  )}>
                    {!isUser && !msg.isError ? (
                      <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-surface-elevated prose-pre:border prose-pre:border-border prose-headings:text-text-main prose-strong:text-text-main prose-a:text-primary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}

                    {/* 3-Dot Menu */}
                    {msg.id !== 'default-1' && (
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 md:opacity-0 group-hover/msg:opacity-100 transition-opacity z-10",
                        isUser ? "-left-10" : "-right-10",
                        openMenuId === msg.id ? "opacity-100" : "opacity-0 md:opacity-0"
                      )}>
                        <button 
                          className={cn(
                            "p-1.5 rounded-full hover:bg-surface-elevated transition-colors",
                            isUser ? "text-text-muted hover:text-text-main" : "text-text-muted hover:text-primary"
                          )}
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === msg.id ? null : msg.id); }}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown menu */}
                        {openMenuId === msg.id && (
                          <div 
                            className={cn(
                              "absolute top-full mt-1 w-32 bg-surface border border-border/50 rounded-xl shadow-xl py-1 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200",
                              isUser ? "right-0 origin-top-right" : "left-0 origin-top-left"
                            )}
                            onClick={e => e.stopPropagation()}
                          >
                            <button onClick={() => handleCopyMessage(msg.content)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-main hover:bg-surface-elevated transition-colors text-left">
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </button>
                            {isUser && (
                              <button onClick={() => handleEditMessage(msg.id, msg.content)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-main hover:bg-surface-elevated transition-colors text-left">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                              </button>
                            )}
                            <button onClick={() => handleDeleteMessage(msg.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error/10 transition-colors text-left">
                              <Trash className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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
        </div>

        {/* Input Area */}
        <div className="pt-2 pb-4 md:pb-6 px-4 md:px-6 shrink-0 bg-background/80 backdrop-blur-xl border-t border-border/40 z-20">
          <div className="max-w-4xl mx-auto relative group">
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
    </div>
  )
}
