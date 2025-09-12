import { BaseBotStrategy, type BotStrategyProps } from './BaseBotStrategy';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { analyticsManager } from '@/utils/analyticsManager';
import type { BotMode, Question, N8nWebhookResponse } from '@/types/conversation';

export class QABotStrategy extends BaseBotStrategy {
  private n8nWebhook: ReturnType<typeof useN8nWebhook>;
  private exchangeCount: number = 0;
  private currentResponse: N8nWebhookResponse | null = null;

  constructor(props: BotStrategyProps, n8nWebhook: ReturnType<typeof useN8nWebhook>) {
    super(props);
    this.n8nWebhook = n8nWebhook;
  }

  getBotMode(): BotMode {
    return 'qa';
  }

  getBotName(): string {
    return 'Business Q&A Assistant';
  }

  getBotDescription(): string {
    return 'Ask questions about m8s, our services, methodologies, and how we can help your business. Get instant answers from our knowledge base.';
  }

  getIcon(): string {
    return '🧠';
  }

  async initialize(): Promise<void> {
    await this.playSound('selection');
    
    // Set initial suggested questions for Q&A mode
    this.setSuggestedQuestions([
      "What services does m8s offer?",
      "How does your project validation process work?",
      "What technologies do you specialize in?",
      "How much do your services cost?",
      "What's your typical project timeline?",
      "Do you work with startups or enterprises?"
    ]);

    // Add welcome message to conversation (always in English/LTR)
    this.addToConversationHistory('bot', 
      `Hi! I'm your Business Q&A Assistant. I have access to comprehensive information about m8s, our services, methodologies, and capabilities. Feel free to ask me anything about how we can help your business!

You can ask specific questions or choose from the suggested topics below.`
    );

    analyticsManager.trackTerminalEvent('qa_bot_initialized', {
      conversation_id: this.conversationId,
      bot_type: 'qa'
    });
  }

  async handleUserInput(input: string): Promise<void> {
    if (!input.trim() || this.state.isGenerating) {
      return;
    }

    await this.playSound('selection');
    this.setGenerating(true);

    // Add user message to history
    const newHistory = this.addToConversationHistory('user', input);
    this.exchangeCount++;

    analyticsManager.trackTerminalEvent('qa_question_asked', {
      question: input,
      exchange_count: this.exchangeCount,
      conversation_id: this.conversationId,
      bot_type: 'qa'
    });

    try {
      // Primary: Try N8N webhook first
      const response = await this.n8nWebhook.sendQAMessage(
        input,
        newHistory,
        this.conversationId,
        this.exchangeCount
      );

      if (response) {
        this.currentResponse = response;
        
        // Add bot response to history
        this.addToConversationHistory('bot', response.text);
        
        // Update suggested questions from N8N response
        this.setSuggestedQuestions(response.suggestedQuestions || this.getContextualSuggestions(input));

        // Track successful response
        analyticsManager.trackTerminalEvent('qa_response_received', {
          question: input,
          response_length: response.text.length,
          has_suggestions: (response.suggestedQuestions?.length || 0) > 0,
          exchange_count: this.exchangeCount,
          conversation_id: this.conversationId,
          bot_type: 'qa',
          source: 'n8n_webhook'
        });
      } else {
        // N8N returned null/empty - use fallback
        this.handleFallbackResponse(input);
      }
    } catch (error) {
      console.error('N8N webhook error in Q&A Bot:', error);
      
      // Fallback: Use local contextual response when N8N is unavailable
      this.handleFallbackResponse(input);

      analyticsManager.trackTerminalEvent('qa_fallback_used', {
        question: input,
        error: error instanceof Error ? error.message : 'Unknown error',
        exchange_count: this.exchangeCount,
        conversation_id: this.conversationId,
        bot_type: 'qa',
        source: 'fallback_method'
      });
    } finally {
      this.setGenerating(false);
    }
  }

  async handleSuggestedQuestion(question: string): Promise<void> {
    await this.playSound('selection');
    
    analyticsManager.trackTerminalEvent('qa_suggested_question_clicked', {
      question,
      exchange_count: this.exchangeCount,
      conversation_id: this.conversationId,
      bot_type: 'qa'
    });
    
    // Handle as regular user input
    await this.handleUserInput(question);
  }

  getCurrentQuestion(): Question | null {
    // Q&A mode doesn't have structured questions
    return null;
  }

  isReadyForInput(): boolean {
    return !this.state.isGenerating;
  }

  getCurrentResponse(): N8nWebhookResponse | null {
    return this.currentResponse;
  }

  // Q&A specific methods
  getExchangeCount(): number {
    return this.exchangeCount;
  }

  hasActiveResponse(): boolean {
    return this.currentResponse !== null;
  }

  clearCurrentResponse(): void {
    this.currentResponse = null;
    this.n8nWebhook.clearResponse();
  }

  // Fallback response when N8N webhook is unavailable
  private handleFallbackResponse(input: string): void {
    // Generate a contextual fallback response
    const fallbackResponse = this.generateFallbackResponse(input);
    
    // Add fallback response to history
    this.addToConversationHistory('bot', fallbackResponse);
    
    // Use contextual suggestions as fallback
    this.setSuggestedQuestions(this.getContextualSuggestions(input));
    
    // Track fallback usage
    analyticsManager.trackTerminalEvent('qa_fallback_response_generated', {
      question: input,
      response_length: fallbackResponse.length,
      exchange_count: this.exchangeCount,
      conversation_id: this.conversationId,
      bot_type: 'qa',
      source: 'local_fallback'
    });
  }

  // Generate a contextual fallback response when N8N is unavailable
  private generateFallbackResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('service') || lowerQuestion.includes('what do you do')) {
      return `m8s specializes in AI-powered project validation and development services. We help businesses validate their ideas, create prototypes, and build scalable solutions. While I'm having trouble accessing our detailed knowledge base right now, I can tell you that we offer project discovery, technical architecture, and full-stack development services. Please contact our team at contact@m8s.ai for specific details about your project needs.`;
    }
    
    if (lowerQuestion.includes('cost') || lowerQuestion.includes('price') || lowerQuestion.includes('pricing')) {
      return `Our pricing varies based on project scope and requirements. We offer flexible engagement models from project validation starting at $97/month to custom enterprise solutions. For accurate pricing tailored to your needs, please reach out to contact@m8s.ai and we'll provide a detailed quote.`;
    }
    
    if (lowerQuestion.includes('technology') || lowerQuestion.includes('tech stack')) {
      return `We work with modern technologies including React, Node.js, Python, AI/ML frameworks, and cloud platforms. Our team adapts to your existing tech stack and project requirements. For specific technology questions and our latest capabilities, please contact us at contact@m8s.ai.`;
    }
    
    if (lowerQuestion.includes('timeline') || lowerQuestion.includes('how long')) {
      return `Project timelines depend on scope and complexity. Our validation phase typically takes 1-2 weeks, while full development projects range from 4-16 weeks. We'll provide detailed timelines during our discovery phase. Contact contact@m8s.ai to discuss your specific timeline needs.`;
    }
    
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('reach') || lowerQuestion.includes('get in touch')) {
      return `You can reach our team directly at contact@m8s.ai or call us at +1 (438) 8676782. We typically respond within 24 hours and are available Monday through Friday, 9 AM to 6 PM EST. We'd be happy to discuss your project needs and how we can help.`;
    }
    
    // Generic fallback
    return `I'm currently having trouble accessing our comprehensive knowledge base, but I'd love to help you learn more about m8s and how we can assist with your project. Please feel free to contact our team directly at contact@m8s.ai or call +1 (438) 8676782. We specialize in AI-powered project validation, technical architecture, and full-stack development, and we'd be happy to discuss your specific needs.`;
  }

  // Business Q&A specific suggested questions based on common inquiries
  getContextualSuggestions(lastQuestion?: string): string[] {
    if (lastQuestion?.toLowerCase().includes('service')) {
      return [
        "What's included in your project validation service?",
        "Do you offer ongoing development support?",
        "How do you price your services?"
      ];
    }
    
    if (lastQuestion?.toLowerCase().includes('technology')) {
      return [
        "Do you work with AI and machine learning?",
        "What about mobile app development?",
        "Can you integrate with our existing systems?"
      ];
    }
    
    if (lastQuestion?.toLowerCase().includes('timeline')) {
      return [
        "What's your typical discovery phase duration?",
        "How quickly can you start a new project?",
        "Do you offer expedited delivery?"
      ];
    }
    
    return [
      "What makes m8s different from other agencies?",
      "Can you share some success stories?",
      "What's your approach to project risk management?"
    ];
  }

  cleanup(): void {
    this.clearCurrentResponse();
    this.exchangeCount = 0;
    this.clearConversation();
    
    analyticsManager.trackTerminalEvent('qa_bot_cleanup', {
      final_exchange_count: this.exchangeCount,
      conversation_id: this.conversationId,
      bot_type: 'qa'
    });
  }
}