import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, X } from "lucide-react";
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
            <img src="/favicon.ico" alt="Assistant" className="w-4 h-4" />
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

export const AssistantChat: React.FC<AssistantChatProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('assistant.greeting') || 'How can I help your business?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0 gap-0 glass-card border-primary/20 [&>*:last-child]:hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="w-8 h-8 hover:bg-secondary/50"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-full">
              <img src="/favicon.ico" alt="Assistant" className="w-5 h-5" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent font-semibold">
              AI Assistant
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <form onSubmit={handleSendMessage} className="p-4 pt-0">
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
      </DialogContent>
    </Dialog>
  );
};

// Utility function to reset onboarding (for testing/debugging)
(window as any).resetMateOnboarding = () => {
  localStorage.removeItem('mate_assistant_onboarding_shown');
  console.log('Mate assistant onboarding reset. Refresh the page to see it again.');
};

// Floating Assistant Button Component
export const AssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 w-20 h-20 bg-gradient-primary hover:opacity-90 text-white shadow-glow rounded-full z-40 animate-float"
        style={{
          boxShadow: '0 8px 32px -8px hsl(260 85% 65% / 0.4), 0 0 0 1px hsl(260 85% 65% / 0.2)'
        }}
      >
        <img src="/favicon.ico" alt="Assistant" className="w-12 h-12" />
      </Button>
      
      <OnboardingSpeechBubble
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStartChat={handleStartChatFromOnboarding}
      />
      
      <AssistantChat 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};