import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Send, Bot, User, Sparkles, Zap, Maximize2, Minimize2, X, MoreHorizontal, Figma, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChatWindow } from '@/contexts/ChatWindowContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  suggestions?: string[];
}

// Session storage keys for InteractiveChatDemo
const DEMO_MESSAGES_KEY = 'demo_chat_messages';
const DEMO_EXPANDED_KEY = 'demo_chat_expanded';
const DEMO_STARTED_KEY = 'demo_chat_started';
const DEMO_STEP_KEY = 'demo_chat_step';

export const InteractiveChatDemo = () => {
  const { isChatExpanded, isChatMinimized, setIsChatExpanded, setIsChatMinimized } = useChatWindow();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(() => {
    return sessionStorage.getItem(DEMO_EXPANDED_KEY) === 'true';
  });
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem(DEMO_MESSAGES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem(DEMO_STEP_KEY);
    return saved ? parseInt(saved) : 0;
  });
  const [isStarted, setIsStarted] = useState(() => {
    return sessionStorage.getItem(DEMO_STARTED_KEY) === 'true';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollPreventionActive = useRef(false);

  const conversationFlow = [
    {
      botMessage: "Hi! I'm here to help you turn your app idea into a working prototype. What kind of app are you thinking about building?",
      suggestions: [
        "A social media app for athletes",
        "An expense tracker for small businesses", 
        "A marketplace for handmade goods",
        "A fitness tracking app"
      ]
    },
    {
      botMessage: "That's a great idea! Who would be your main users? Tell me about the people who would use this app daily.",
      suggestions: [
        "Small business owners",
        "Busy professionals",
        "College students", 
        "Parents with young kids"
      ]
    },
    {
      botMessage: "Perfect! What's the main problem this app solves for them? What frustrates them right now?",
      suggestions: [
        "Too much manual work",
        "Hard to find what they need",
        "Expensive existing solutions",
        "No mobile-friendly options"
      ]
    },
    {
      botMessage: "Excellent! Based on what you've told me, I can see this solving a real problem. Would you like authentication in your app, or should users be able to use it without signing up?",
      suggestions: [
        "Users need accounts for personalization",
        "Keep it simple - no login required",
        "Optional signup with benefits",
        "I'm not sure what's better"
      ]
    },
    {
      botMessage: "Perfect! I now have enough to create your complete package: professional PRD documents, system architecture, AND a working prototype you can actually click through and test. You'll know exactly what your app costs and looks like before building. Ready to see the magic?",
      suggestions: [
        "Yes, create my prototype! ✨",
        "What exactly will I get?",
        "Show me cost & timeline",
        "Can I see examples first?"
      ]
    }
  ];

  // Save state to session storage
  useEffect(() => {
    sessionStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(DEMO_EXPANDED_KEY, isExpanded.toString());
  }, [isExpanded]);

  useEffect(() => {
    sessionStorage.setItem(DEMO_STARTED_KEY, isStarted.toString());
  }, [isStarted]);

  useEffect(() => {
    sessionStorage.setItem(DEMO_STEP_KEY, currentStep.toString());
  }, [currentStep]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleExpand = () => {
    // Since we removed the regular view, this should always expand to fullscreen
    enableScrollPrevention();
    setIsExpanded(true);
    setIsChatExpanded(true);
    setIsChatMinimized(false);
  };

  const handleMinimize = () => {
    setIsExpanded(false);
    setIsChatMinimized(true);
    setIsChatExpanded(false);
    disableScrollPrevention();
  };

  const handleRestore = () => {
    setIsExpanded(true);
    setIsChatMinimized(false);
    setIsChatExpanded(true);
    enableScrollPrevention();
  };

  const preventDefault = (e: Event) => {
    // Only prevent scrolling if scroll prevention is active
    if (scrollPreventionActive.current) {
      e.preventDefault();
    }
  };

  const preventArrowKeys = (e: KeyboardEvent) => {
    // Only prevent arrow keys if scroll prevention is active
    if (scrollPreventionActive.current && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const enableScrollPrevention = () => {
    if (!scrollPreventionActive.current) {
      scrollPreventionActive.current = true;
      setSavedScrollPosition(window.scrollY);
      document.body.classList.add('chat-modal-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      document.addEventListener('wheel', preventDefault, { passive: false });
      document.addEventListener('touchmove', preventDefault, { passive: false });
      document.addEventListener('keydown', preventArrowKeys, false);
    }
  };

  const disableScrollPrevention = () => {
    if (scrollPreventionActive.current) {
      scrollPreventionActive.current = false;
      document.body.classList.remove('chat-modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, savedScrollPosition);
      
      document.removeEventListener('wheel', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('keydown', preventArrowKeys);
    }
  };

  const handleClose = () => {
    disableScrollPrevention();
    setIsStarted(false);
    setIsExpanded(false);
    setIsChatExpanded(false);
    setIsChatMinimized(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableScrollPrevention();
    };
  }, []);

  // Ensure scroll prevention is properly managed based on chat state
  useEffect(() => {
    if (isChatExpanded && !isChatMinimized) {
      enableScrollPrevention();
    } else {
      disableScrollPrevention();
    }
  }, [isChatExpanded, isChatMinimized]);

  const startDemo = () => {
    setIsStarted(true);
    const botMessage: Message = {
      id: '1',
      content: conversationFlow[0].botMessage,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: conversationFlow[0].suggestions
    };
    setMessages([botMessage]);
    
    // Expand to fullscreen immediately
    setIsExpanded(true);
    setIsChatExpanded(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const nextStep = currentStep + 1;
      
      if (nextStep < conversationFlow.length) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: conversationFlow[nextStep].botMessage,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: conversationFlow[nextStep].suggestions
        };
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentStep(nextStep);
      } else {
        // Final message - CTA
        const finalMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "🎉 Perfect! I have everything needed to create your complete package: PRD docs, architecture diagrams, working prototype you can test, AND accurate cost estimate. Ready to see your idea come to life?",
          sender: 'bot',
          timestamp: new Date(),
          suggestions: ["Get My Complete Package!", "What exactly do I get?", "Show me pricing", "See example prototypes"]
        };
        setMessages(prev => [...prev, finalMessage]);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMenuAction = (action: 'figma' | 'upload') => {
    toast({
      title: "Demo Feature",
      description: "This feature is only available for subscribed members. This is a demo version.",
      variant: "default",
    });
  };

  if (!isStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-cyan-500/30 shadow-2xl bg-black/20 backdrop-blur-xl">
        <CardContent className="p-8 text-center relative overflow-hidden">
          {/* Neon grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          {/* Floating neon bot avatar */}
          <div className="flex items-center justify-center mb-6 relative">
            <div className="relative animate-float">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-pulse">
                <Bot className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              {/* Orbital rings */}
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin-slow" style={{ animation: 'spin 8s linear infinite' }} />
              <div className="absolute inset-2 border border-purple-400/30 rounded-full" style={{ animation: 'spin 6s linear infinite reverse' }} />
              {/* Floating particles */}
              <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-cyan-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <Zap className="absolute -bottom-1 -left-2 h-3 w-3 text-purple-400 animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('app_builder.chat.demo_title')}
          </h3>
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            {t('app_builder.chat.demo_subtitle')}
          </p>
          
          {/* Process Steps */}
          <div className="mb-8 space-y-4 text-left">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 rounded-lg border border-cyan-500/40 backdrop-blur-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                1
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-cyan-300 mb-1">{t('app_builder.chat.step1_title')}</h4>
                <p className="text-gray-300 text-sm">{t('app_builder.chat.step1_description')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border border-purple-500/40 backdrop-blur-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                2
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-purple-300 mb-1">{t('app_builder.chat.step2_title')}</h4>
                <p className="text-gray-300 text-sm">{t('app_builder.chat.step2_description')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-900/40 to-cyan-900/40 rounded-lg border border-pink-500/40 backdrop-blur-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                3
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-pink-300 mb-1">{t('app_builder.chat.step3_title')}</h4>
                <p className="text-gray-300 text-sm">{t('app_builder.chat.step3_description')}</p>
              </div>
            </div>
          </div>
          
          {/* Neon CTA Button */}
          <Button 
            onClick={startDemo}
            size="lg" 
            className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 py-4 text-lg border-0 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all duration-300 group overflow-hidden"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
            <span className="relative z-10 flex items-center">
              Start Building My App 
              <Sparkles className="ml-2 h-5 w-5 animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
            </span>
          </Button>
          
          {/* Neon indicators */}
          <div className="flex justify-start space-x-6 mt-6">
            {['No signup required', 'Get PRD + POC', 'Book development meeting'].map((text, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" style={{ animationDelay: `${index * 0.5}s` }} />
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Minimized state - floating window bar
  if (isChatMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] animate-slide-up">
        <Card className="w-80 border-cyan-500/30 shadow-2xl bg-black/40 backdrop-blur-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300">
          <CardContent className="p-0">
            <div className="border-b border-cyan-500/20 p-3 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse">
                    <Bot className="h-3 w-3 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI App Builder</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse" />
                      <p className="text-xs text-gray-400">Minimized</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleRestore}
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6 hover:bg-cyan-400/20 text-cyan-400 hover:text-cyan-300 transition-all duration-200"
                    title="Restore"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={handleClose}
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-slate-900/20 to-slate-800/20">
              <p className="text-xs text-gray-400 text-center">
                Chat minimized - Click restore to continue
              </p>
              <div className="flex justify-center mt-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50" />
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce shadow-sm shadow-pink-400/50" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isChatExpanded) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-sm animate-fade-in">
        <div className="fixed inset-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl overflow-hidden chat-container border border-cyan-500/20 rounded-xl animate-scale-in">
          <div className="flex flex-col h-full">
            {/* Modern Neon Header */}
            <div className="border-b border-cyan-500/30 p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 relative flex items-center justify-between shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">AI App Builder</h4>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50" />
                    <p className="text-sm text-cyan-300">Online</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  onClick={handleMinimize}
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 transition-all duration-200"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleClose}
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages - Full Height with Neon styling */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
              {messages.map((message, msgIndex) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.sender === 'bot' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/30' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/30'
                  }`}>
                    {message.sender === 'bot' ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-2xl backdrop-blur-sm shadow-lg ${
                      message.sender === 'bot'
                        ? 'bg-slate-800/60 border border-cyan-500/30 rounded-tl-sm shadow-cyan-500/20'
                        : 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white rounded-tr-sm shadow-purple-500/20'
                    }`}>
                      <p className={`text-sm leading-relaxed ${message.sender === 'bot' ? 'text-gray-100' : 'text-white'}`}>{message.content}</p>
                    </div>
                    
                    {message.suggestions && message.sender === 'bot' && (
                      <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs border-cyan-400/40 bg-slate-800/60 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-slate-800/60 border border-cyan-500/30 p-4 rounded-2xl rounded-tl-sm backdrop-blur-sm shadow-lg shadow-cyan-500/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input - Fixed at bottom with Neon styling and tablet responsive */}
            <div className="border-t border-cyan-500/30 p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
              <div className="flex gap-3 max-w-4xl mx-auto">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="bg-slate-800/60 border border-cyan-500/30 text-gray-100 placeholder:text-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 rounded-lg backdrop-blur-sm shadow-lg focus:shadow-cyan-500/20"
                    disabled={isTyping}
                  />
                </div>
                
                {/* Menu Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-10 h-10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50"
                      title="More options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-slate-800/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl"
                  >
                    <DropdownMenuItem 
                      onClick={() => handleMenuAction('figma')}
                      className="text-gray-100 hover:bg-purple-500/20 hover:text-purple-300 focus:bg-purple-500/20 focus:text-purple-300 cursor-pointer"
                    >
                      <Figma className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Integrate with Figma</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleMenuAction('upload')}
                      className="text-gray-100 hover:bg-purple-500/20 hover:text-purple-300 focus:bg-purple-500/20 focus:text-purple-300 cursor-pointer"
                    >
                      <Upload className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Upload File</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-cyan-300 mt-3 text-center max-w-4xl mx-auto">
                Try the suggestions above or type your own response
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add debug function for clearing demo memory
  (window as any).clearDemoMemory = () => {
    sessionStorage.removeItem(DEMO_MESSAGES_KEY);
    sessionStorage.removeItem(DEMO_EXPANDED_KEY);
    sessionStorage.removeItem(DEMO_STARTED_KEY);
    sessionStorage.removeItem(DEMO_STEP_KEY);
    console.log('Demo chat memory cleared. Refresh to reset the demo.');
  };

  // This should never be reached since we only have initial, expanded, and minimized states
  return null;
};