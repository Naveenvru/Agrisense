import { useEffect, useState, useRef } from 'react';
import { X, Send, Mic, Paperclip, Sparkles, Sprout, Cloud, TrendingUp, AlertTriangle, FileText, Image as ImageIcon, History, Zap, MessageSquare, Copy, RefreshCw, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/components/providers/ModalProvider';
import { TreeMascot } from '@/components/ui/TreeMascot';
import { aiGatewayService } from '@/features/ai/services/ai-gateway.service';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isTyping?: boolean;
  timestamp: string;
}

export function AiChatDrawer({ isOpen, onClose }: AiChatDrawerProps) {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleComingSoon = (feature: string) => {
    openModal({
      type: 'coming_soon',
      title: 'Coming Soon',
      message: `${feature} is currently in development and will be available in the next release.`
    });
  };

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!isOpen) return null;

  if (user?.preferences?.aiAssistanceEnabled === false) return <div className="fixed inset-0 z-50 flex justify-end bg-black/50" role="dialog" aria-modal="true" aria-label="AI preferences">
    <section className="flex h-full w-full max-w-md flex-col border-l border-border bg-background p-6 shadow-2xl">
      <button type="button" onClick={onClose} className="self-end rounded-lg p-2 text-text-secondary hover:bg-surface" aria-label="Close"><X className="h-5 w-5" /></button>
      <div className="my-auto"><Sparkles className="mb-4 h-8 w-8 text-primary" /><h2 className="text-xl font-bold text-text-primary">AI assistance is off</h2><p className="mt-2 text-sm text-text-secondary">Turn on AI assistance in settings before sending prompts or crop images to the AI provider.</p><button type="button" onClick={() => { onClose(); navigate('/settings'); }} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open settings</button></div>
    </section>
  </div>;

  const suggestedQuestions = [
    { icon: Cloud, text: "Will it rain tomorrow?" },
    { icon: Sprout, text: "Should I irrigate today?" },
    { icon: Sprout, text: "Best fertilizer for wheat?" },
    { icon: AlertTriangle, text: "Tomato disease symptoms?" },
    { icon: TrendingUp, text: "Market price today?" },
  ];

  const handleSend = async (text: string = message) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Format recent messages for the AgriSense AI gateway.
    const historyPayload = chatHistory
      .filter(m => !m.isTyping)
      .map(m => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content
      }));

    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');

    const typingId = (Date.now() + 1).toString();
    setChatHistory(prev => [...prev, { 
      id: typingId, 
      role: 'ai', 
      content: '', 
      isTyping: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    try {
      const responseText = await aiGatewayService.sendChatMessage(trimmed, historyPayload);
      setChatHistory(prev => prev.map(msg => 
        msg.id === typingId 
          ? { 
              id: typingId, 
              role: 'ai', 
              content: responseText, 
              isTyping: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } 
          : msg
      ));
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Unable to connect to AgriSense AI service. Please check your backend connection.';
      setChatHistory(prev => prev.map(msg => 
        msg.id === typingId 
          ? { 
              id: typingId, 
              role: 'ai', 
              content: `⚠️ **AgriSense AI Warning**\n\n${errorMsg}`, 
              isTyping: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } 
          : msg
      ));
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  const handleClear = () => {
    openModal({
      type: 'confirm',
      title: 'Clear Chat History',
      message: 'Are you sure you want to clear your conversation with AgriSense AI?',
      confirmText: 'Clear',
      onConfirm: () => setChatHistory([])
    });
  };

  // Simple Markdown Renderer
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (formattedLine.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />;
      }
      return <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'recommendations', icon: Sparkles, label: 'Recommendations' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'quick', icon: Zap, label: 'Quick Actions' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md md:max-w-lg h-full bg-background/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex flex-col border-b border-white/10 bg-surface/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden group cursor-pointer">
                  <TreeMascot className="w-12 h-12" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h2 className="font-heading font-bold text-text-primary leading-tight">AgriSense AI</h2>
                <p className="text-xs text-success font-medium flex items-center gap-1">
                  Online • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleClear} className="rounded-full hover:bg-white/5 hover:text-error transition-colors" title="Clear Chat">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5">
                <X className="w-5 h-5 text-text-secondary" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-2 pb-2 gap-1 overflow-x-auto custom-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-background/50 relative" ref={scrollRef}>
          
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col p-4">
              {chatHistory.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 relative group cursor-pointer">
                    <TreeMascot className="w-32 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">How can I help you grow today?</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-[280px] mx-auto">
                      Ask me to analyze weather, predict market prices, or help detect crop diseases.
                    </p>
                  </div>

                  {/* Suggested Questions */}
                  <div className="mt-8 w-full max-w-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 text-left">Suggested for you</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((q, idx) => {
                        const Icon = q.icon;
                        return (
                          <button 
                            key={idx}
                            onClick={() => {
                              handleSend(q.text);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-left rounded-lg bg-surface/80 border border-border hover:border-primary/50 hover:text-primary transition-all text-xs font-medium text-text-secondary group"
                          >
                            <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            {q.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {chatHistory.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
                          <TreeMascot className="w-10 h-10" isThinking={msg.isTyping} />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-surface border border-border rounded-tl-sm text-text-primary'
                      }`}>
                        {msg.isTyping ? (
                          <div className="flex gap-1 items-center h-5">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                          </div>
                        ) : (
                          <div>
                            {msg.role === 'ai' ? renderMarkdown(msg.content) : msg.content}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Bar for AI Messages */}
                      {msg.role === 'ai' && !msg.isTyping && (
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-text-secondary mr-2 flex items-center">{msg.timestamp}</span>
                          <button onClick={() => handleCopy(msg.id, msg.content)} className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface transition-colors" title="Copy">
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button onClick={handleRegenerate} className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface transition-colors" title="Regenerate">
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {msg.role === 'user' && (
                         <div className="flex justify-end mt-1">
                           <span className="text-[10px] text-text-secondary">{msg.timestamp}</span>
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab !== 'chat' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 p-6">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-bold text-text-primary mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-sm text-text-secondary">This feature is currently being connected to the backend APIs. Check back soon.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-surface/80 backdrop-blur-md">
          {/* Quick Tools */}
          <div className="flex gap-2 mb-3">
            <button onClick={() => handleComingSoon('Voice Assistant')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-bold text-text-secondary hover:text-primary hover:border-primary/50 transition-colors">
              <Mic className="w-3.5 h-3.5" /> Voice
            </button>
            <button onClick={() => handleComingSoon('Image Upload')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-bold text-text-secondary hover:text-primary hover:border-primary/50 transition-colors">
              <ImageIcon className="w-3.5 h-3.5" /> Image
            </button>
            <button onClick={() => handleComingSoon('Document Upload')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-bold text-text-secondary hover:text-primary hover:border-primary/50 transition-colors">
              <FileText className="w-3.5 h-3.5" /> Docs
            </button>
          </div>

          <div className="relative flex items-end gap-2 bg-background border border-border rounded-2xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
            
            <button onClick={() => handleComingSoon('File Attachments')} className="p-2 text-text-secondary hover:text-primary transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message AgriSense AI..."
              className="flex-1 max-h-32 min-h-[40px] bg-transparent text-text-primary text-sm resize-none focus:outline-none py-2.5 custom-scrollbar"
              rows={1}
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={!message.trim()}
              className={`p-2.5 rounded-xl transition-all shadow-lg ${
                message.trim() 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 hover:scale-105 active:scale-95' 
                  : 'bg-surface text-text-secondary cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[10px] text-text-secondary">AgriSense AI can make mistakes. Always verify critical farming actions.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
