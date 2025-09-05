import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  suggestions?: string[];
}

export const InteractiveChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  if (!isStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-primary mr-3" />
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Try Our AI App Builder</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Experience how our intelligent conversation turns your app idea into a working prototype
          </p>
          <Button 
            onClick={startDemo}
            size="lg" 
            className="bg-gradient-primary hover:scale-105 text-white shadow-glow px-8 py-4 text-lg font-semibold"
          >
            Start Building My App <Sparkles className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No signup required • See results instantly • Takes 2 minutes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-xl">
      <CardContent className="p-0">
        {/* Chat Header */}
        <div className="border-b border-border/20 p-4 bg-gradient-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">AI App Builder</h4>
              <p className="text-sm text-muted-foreground">Online now</p>
            </div>
            <Badge className="ml-auto bg-green-500/10 text-green-600 border-green-500/20">
              Live Demo
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'bot' 
                  ? 'bg-gradient-primary text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {message.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-2xl ${
                  message.sender === 'bot'
                    ? 'bg-muted text-foreground rounded-tl-sm'
                    : 'bg-primary text-primary-foreground rounded-tr-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.sender === 'bot' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs border-primary/20 hover:bg-primary/10"
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
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/20 p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Try the suggestions above or type your own response
          </p>
        </div>
      </CardContent>
    </Card>
  );
};