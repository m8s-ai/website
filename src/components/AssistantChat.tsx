import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, X } from "lucide-react";
import { WhiteRobotIcon } from "@/components/ui/WhiteRobotIcon";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: () => void;
}

const OnboardingSpeechBubble: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onStartChat }) => {
  const { t } = useLanguage();

  const handleStartChat = () => {
    localStorage.setItem('mate_assistant_onboarding_shown', 'true');
    onClose();
    onStartChat();
  };

  const handleDismiss = () => {
    localStorage.setItem('mate_assistant_onboarding_shown', 'true');
    onClose();
  };

  // Auto-dismiss after 10 seconds if no interaction
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        localStorage.setItem('mate_assistant_onboarding_shown', 'true');
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)] animate-slide-up">
      {/* Speech Bubble */}
      <div className="glass-card border-primary/20 rounded-2xl p-4 relative shadow-glow">
        {/* Close button */}
        <Button
          onClick={handleDismiss}
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-6 w-6 hover:bg-secondary/50"
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Speech bubble tail pointing down-right to button */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gradient-card border-r border-b border-primary/20 rotate-45"></div>
        
        {/* Header with robot icon and name */}
        <div className="flex items-center gap-2 mb-3 pr-6">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-full">
            <WhiteRobotIcon size={16} />
          </div>
          <span className="bg-gradient-primary bg-clip-text text-transparent font-bold text-sm">
            {t('onboarding.title')}
          </span>
        </div>

        {/* Message */}
        <p className="text-foreground text-sm leading-relaxed mb-4">
          {t('onboarding.message')}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleStartChat}
            className="bg-gradient-primary hover:opacity-90 text-white shadow-glow text-xs px-3 py-1 h-auto"
            size="sm"
          >
            {t('onboarding.start_chat')}
          </Button>
          
          <Button 
            onClick={handleDismiss}
            variant="outline" 
            className="border-border/50 hover:bg-secondary/50 text-xs px-3 py-1 h-auto"
            size="sm"
          >
            {t('onboarding.maybe_later')}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Session storage keys
const CHAT_MESSAGES_KEY = 'mate_chat_messages';
const CHAT_EXPANDED_KEY = 'mate_chat_expanded';

export const AssistantChat: React.FC<AssistantChatProps> = ({ isOpen, onClose, isExpanded: propIsExpanded, onToggleExpand }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(() => {
    return propIsExpanded !== undefined ? propIsExpanded : sessionStorage.getItem(CHAT_EXPANDED_KEY) === 'true';
  });
  
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from session storage
    const savedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.warn('Failed to parse saved messages:', e);
      }
    }
    // Default greeting message
    return [{
      id: '1',
      text: t('assistant.greeting') || 'How can I help your business?',
      sender: 'assistant',
      timestamp: new Date()
    }];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Save messages to session storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Save expanded state to session storage
  useEffect(() => {
    sessionStorage.setItem(CHAT_EXPANDED_KEY, isExpanded.toString());
  }, [isExpanded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      // Save current scroll position when expanding
      setSavedScrollPosition(window.scrollY);
      // Prevent body scroll with enhanced CSS classes
      document.body.classList.add('chat-modal-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Prevent wheel and touch events on document
      document.addEventListener('wheel', preventDefault, { passive: false });
      document.addEventListener('touchmove', preventDefault, { passive: false });
      document.addEventListener('keydown', preventArrowKeys, false);
    } else {
      // Restore scroll when minimizing
      document.body.classList.remove('chat-modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, savedScrollPosition);
      
      // Remove event listeners
      document.removeEventListener('wheel', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('keydown', preventArrowKeys);
    }
    
    setIsExpanded(!isExpanded);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  const preventArrowKeys = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getAssistantResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return t('assistant.hello_response') || 'Hello! I\'m here to help you discover how AI automation can transform your business. What challenges are you facing?';
    }
    
    if (input.includes('automation') || input.includes('ai')) {
      return t('assistant.automation_response') || 'AI automation can help streamline your operations, reduce costs, and improve efficiency. Would you like to know more about our solutions for your specific industry?';
    }
    
    if (input.includes('cost') || input.includes('price') || input.includes('budget')) {
      return t('assistant.cost_response') || 'Our solutions are tailored to your specific needs and budget. We offer flexible pricing options starting from $10k. Would you like to schedule a free consultation to discuss your requirements?';
    }
    
    if (input.includes('contact') || input.includes('call') || input.includes('meeting')) {
      return t('assistant.contact_response') || 'I\'d be happy to help you get in touch with our team! You can book a strategy call or reach out directly. What would you prefer?';
    }
    
    return t('assistant.default_response') || 'That\'s a great question! Our AI automation solutions can help with various business challenges. Could you tell me more about your specific needs so I can provide more targeted assistance?';
  };

  // Handle cleanup when chat is closed
  useEffect(() => {
    return () => {
      if (isExpanded) {
        // Restore scroll if component unmounts while expanded
        document.body.classList.remove('chat-modal-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Remove event listeners
        document.removeEventListener('wheel', preventDefault);
        document.removeEventListener('touchmove', preventDefault);
        document.removeEventListener('keydown', preventArrowKeys);
      }
    };
  }, [isExpanded]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
      isExpanded 
        ? 'bg-black/50 backdrop-blur-sm' 
        : 'bg-transparent pointer-events-none'
    }`}>
      <div className={`
        fixed transition-all duration-500 ease-in-out glass-card border border-primary/20 chat-container
        ${isExpanded 
          ? 'inset-4 rounded-2xl shadow-2xl chat-expanded' 
          : 'bottom-6 right-6 w-80 h-96 rounded-2xl shadow-xl chat-minimized'
        }
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 pb-0 bg-gradient-primary rounded-t-2xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                  <WhiteRobotIcon size={20} />
                </div>
                <span className="text-white font-semibold">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleToggleExpand}
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 hover:bg-white/20 text-white"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </Button>
                <Button
                  onClick={onClose}
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 hover:bg-white/20 text-white"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-secondary/50 text-foreground border border-border/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-foreground border border-border/50 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 pt-0 bg-background border-t border-border rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('assistant.input_placeholder') || 'Ask me about AI automation...'}
                className="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Utility function to reset onboarding (for testing/debugging)
(window as any).resetMateOnboarding = () => {
  localStorage.removeItem('mate_assistant_onboarding_shown');
  console.log('Mate assistant onboarding reset. Refresh the page to see it again.');
};

// Clear chat memory function for debugging
(window as any).clearChatMemory = () => {
  sessionStorage.removeItem(CHAT_MESSAGES_KEY);
  sessionStorage.removeItem(CHAT_EXPANDED_KEY);
  console.log('Chat memory cleared. Refresh to reset the chat.');
};

// Floating Assistant Button Component
export const AssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if onboarding has been shown before
    const hasSeenOnboarding = localStorage.getItem('mate_assistant_onboarding_shown');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay when component mounts
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartChatFromOnboarding = () => {
    setIsOpen(true);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 w-20 h-20 bg-gradient-primary hover:opacity-90 text-white shadow-glow rounded-full z-40 animate-float"
          style={{
            boxShadow: '0 8px 32px -8px hsl(260 85% 65% / 0.4), 0 0 0 1px hsl(260 85% 65% / 0.2)'
          }}
        >
          <WhiteRobotIcon size={48} />
        </Button>
      )}
      
      <OnboardingSpeechBubble
        isOpen={showOnboarding && !isOpen}
        onClose={() => setShowOnboarding(false)}
        onStartChat={handleStartChatFromOnboarding}
      />
      
      <AssistantChat 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          setIsExpanded(false);
        }}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
      />
    </>
  );
};