import { BaseBotStrategy, type BotStrategyProps } from './BaseBotStrategy';
import { useConversationAnalysis } from '@/hooks/useConversationAnalysis';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { CONVERSATION_WAVES } from '@/data/conversationWaves';
import { analyticsManager } from '@/utils/analyticsManager';
import type { BotMode, Question, Wave } from '@/types/conversation';

export interface ProjectDiscoveryState {
  currentWave: number;
  currentQuestion: number;
  responses: Record<string, string>;
  userInput: string;
  selectedOption: number;
  validationMessage: string;
}

export class ProjectDiscoveryBotStrategy extends BaseBotStrategy {
  private conversationAnalysis: ReturnType<typeof useConversationAnalysis>;
  private n8nWebhook: ReturnType<typeof useN8nWebhook>;
  private projectState: ProjectDiscoveryState;

  constructor(
    props: BotStrategyProps, 
    conversationAnalysis: ReturnType<typeof useConversationAnalysis>,
    n8nWebhook: ReturnType<typeof useN8nWebhook>
  ) {
    super(props);
    this.conversationAnalysis = conversationAnalysis;
    this.n8nWebhook = n8nWebhook;
    
    this.projectState = {
      currentWave: 0,
      currentQuestion: 0,
      responses: {},
      userInput: '',
      selectedOption: 0,
      validationMessage: ''
    };
  }

  getBotMode(): BotMode {
    return 'project';
  }

  getBotName(): string {
    return 'Project Discovery Assistant';
  }

  getBotDescription(): string {
    return 'Start an intelligent conversation to define your project requirements, get a detailed analysis, and receive a comprehensive project plan.';
  }

  getIcon(): string {
    return '🚀';
  }

  async initialize(): Promise<void> {
    await this.playSound('selection');
    
    // Reset project state - start from wave 1 (skip the welcome/path selection wave)
    this.projectState = {
      currentWave: 1, // Skip the first wave as it's for mode selection
      currentQuestion: 0,
      responses: {},
      userInput: '',
      selectedOption: 0,
      validationMessage: ''
    };

    // Add welcome message and start first question (always in English/LTR)
    this.addToConversationHistory('bot', 
      `Welcome to intelligent project discovery! I'm ARIA, your Project Discovery Assistant. I'll guide you through a structured conversation to understand your project vision, requirements, and goals.

This process typically takes 5-10 minutes and will help us create a detailed project analysis and recommendation for you.

Let's start!`
    );

    // Ask the first question
    const firstQuestion = this.getCurrentQuestion();
    
    if (firstQuestion) {
      this.addToConversationHistory('bot', firstQuestion.text);
    }

    analyticsManager.trackTerminalEvent('project_discovery_initialized', {
      conversation_id: this.conversationId,
      bot_type: 'project',
      total_waves: CONVERSATION_WAVES.length
    });
  }

  async handleUserInput(input: string): Promise<void> {
    const currentQ = this.getCurrentQuestion();
    if (!currentQ || this.state.isGenerating) {
      return;
    }

    let answer = '';
    
    // Handle different question types
    if (currentQ.type === 'multiple-choice') {
      const optionIndex = parseInt(input) - 1; // Assuming input is "1", "2", etc.
      if (optionIndex >= 0 && optionIndex < (currentQ.options?.length || 0)) {
        answer = currentQ.options?.[optionIndex] || '';
        this.projectState.selectedOption = optionIndex;
      } else {
        this.projectState.validationMessage = 'Please select a valid option number.';
        return;
      }
    } else {
      answer = input.trim();
      
      // Validate text input
      if (currentQ.validation && !currentQ.validation(answer)) {
        if (currentQ.id === 'email') {
          this.projectState.validationMessage = 'Please enter a valid email address';
        } else if (answer.length === 0) {
          this.projectState.validationMessage = 'This field is required';
        } else {
          this.projectState.validationMessage = 'Please provide more detail in your answer';
        }
        return;
      }
    }

    if (!answer) return;

    await this.playSound('selection');
    this.setGenerating(true);

    // Store the response
    this.projectState.responses[currentQ.id] = answer;
    this.projectState.userInput = '';
    this.projectState.selectedOption = 0;
    this.projectState.validationMessage = '';

    // Add to conversation history
    this.addToConversationHistory('user', answer);
    
    // Add follow-up message if available
    const followUpMessage = currentQ.followUp || 'Thank you for that information.';
    this.addToConversationHistory('bot', followUpMessage);

    analyticsManager.trackTerminalEvent('project_question_answered', {
      question_id: currentQ.id,
      question_type: currentQ.type,
      answer_length: answer.length,
      wave: this.projectState.currentWave,
      conversation_id: this.conversationId,
      bot_type: 'project'
    });

    // Move to next question or complete discovery
    setTimeout(async () => {
      await this.moveToNextQuestion();
      this.setGenerating(false);
    }, 1000);
  }

  async handleSuggestedQuestion(question: string): Promise<void> {
    // Project discovery doesn't typically use suggested questions
    // but we can handle it as regular input
    await this.handleUserInput(question);
  }

  getCurrentQuestion(): Question | null {
    if (this.projectState.currentWave >= CONVERSATION_WAVES.length) return null;
    
    const wave = CONVERSATION_WAVES[this.projectState.currentWave];
    if (this.projectState.currentQuestion >= wave.questions.length) return null;
    
    return wave.questions[this.projectState.currentQuestion];
  }

  getCurrentWave(): Wave | null {
    if (this.projectState.currentWave >= CONVERSATION_WAVES.length) return null;
    return CONVERSATION_WAVES[this.projectState.currentWave];
  }

  isReadyForInput(): boolean {
    return !this.state.isGenerating && this.getCurrentQuestion() !== null;
  }

  private async moveToNextQuestion(): Promise<void> {
    const currentWave = this.getCurrentWave();
    if (!currentWave) return;

    if (this.projectState.currentQuestion + 1 < currentWave.questions.length) {
      // Next question in current wave
      this.projectState.currentQuestion++;
      
      const nextQuestion = this.getCurrentQuestion();
      if (nextQuestion) {
        this.addToConversationHistory('bot', nextQuestion.text);
      }
      
    } else if (this.projectState.currentWave + 1 < CONVERSATION_WAVES.length) {
      // Next wave
      this.projectState.currentWave++;
      this.projectState.currentQuestion = 0;
      
      const nextWave = this.getCurrentWave();
      const nextQuestion = this.getCurrentQuestion();
      
      if (nextWave && nextQuestion) {
        // Add wave transition message
        this.addToConversationHistory('bot', 
          `Great! We're moving to the next section: ${nextWave.name}. ${nextWave.description}`
        );
        
        setTimeout(() => {
          if (nextQuestion) {
            this.addToConversationHistory('bot', nextQuestion.text);
          }
        }, 1500);
      }
      
    } else {
      // Discovery complete - generate comprehensive analysis
      await this.completeDiscovery();
    }
  }

  private async completeDiscovery(): Promise<void> {
    this.addToConversationHistory('bot', 
      `Excellent! I've gathered all the information needed. Let me analyze your project requirements and create a comprehensive plan for you...`
    );

    // Generate enhanced project data using the analysis hook
    const enhancedData = this.conversationAnalysis.generateEnhancedData(this.projectState.responses);

    // Send to N8N if we have contact information
    if (this.projectState.responses.email) {
      try {
        await this.n8nWebhook.sendProjectData(enhancedData);
        
        this.addToConversationHistory('bot', 
          `Perfect! I've sent your detailed project analysis to our team. You'll receive a comprehensive report at ${this.projectState.responses.email} within 24 hours.

The report will include:
• Project complexity analysis
• Technical recommendations
• Implementation roadmap
• Risk assessment
• Estimated timeline and effort

Our team will also reach out according to your preferred contact method to discuss the next steps.

Thank you for taking the time to provide detailed information about your project!`
        );
      } catch (error) {
        console.error('N8N webhook error in Project Discovery:', error);
        
        // Provide fallback analysis when N8N is unavailable
        const fallbackAnalysis = this.generateFallbackAnalysis(enhancedData);
        
        this.addToConversationHistory('bot', fallbackAnalysis);
        
        // Track fallback usage
        analyticsManager.trackTerminalEvent('project_discovery_fallback_used', {
          error: error instanceof Error ? error.message : 'Unknown error',
          total_responses: Object.keys(this.projectState.responses).length,
          conversation_id: this.conversationId,
          bot_type: 'project',
          source: 'fallback_analysis'
        });
      }
    }

    analyticsManager.trackTerminalEvent('project_discovery_completed', {
      total_responses: Object.keys(this.projectState.responses).length,
      complexity: enhancedData.complexity,
      risk_flags: enhancedData.riskFlags,
      conversation_id: this.conversationId,
      bot_type: 'project'
    });

    // Call completion callback
    this.onComplete(enhancedData);
  }

  // Generate fallback analysis when N8N webhook is unavailable
  private generateFallbackAnalysis(_enhancedData: any): string {
    const responses = this.projectState.responses;
    
    // Build basic analysis message
    let analysis = `Thank you for completing the project discovery! Here's a preliminary analysis based on your responses:\n\n`;
    
    // Project Overview
    if (responses.project_idea) {
      analysis += `📋 **Project Overview:**\n"${responses.project_idea}"\n\n`;
    }
    
    // Key Insights
    analysis += `🎯 **Key Insights:**\n`;
    
    if (responses.business_problem) {
      analysis += `• **Problem Focus:** You're addressing ${responses.business_problem.toLowerCase()}\n`;
    }
    
    if (responses.target_audience) {
      analysis += `• **Target Market:** Focused on ${responses.target_audience.toLowerCase()}\n`;
    }
    
    if (responses.budget_range) {
      analysis += `• **Budget Range:** ${responses.budget_range}\n`;
    }
    
    if (responses.timeline) {
      analysis += `• **Timeline:** ${responses.timeline}\n`;
    }
    
    analysis += `\n`;
    
    // Next Steps
    analysis += `🚀 **Next Steps:**\n`;
    analysis += `While I'm having trouble accessing our full analysis system right now, I've captured all your project details. Our team will:\n\n`;
    analysis += `1. **Review & Analyze:** Conduct a detailed technical and business analysis\n`;
    analysis += `2. **Create Roadmap:** Develop a comprehensive implementation plan\n`;
    analysis += `3. **Prepare Proposal:** Draft a detailed project proposal with timelines and costs\n`;
    analysis += `4. **Schedule Review:** Reach out within 24 hours to discuss findings\n\n`;
    
    // Contact Information
    analysis += `📞 **Contact Information:**\n`;
    if (responses.email) {
      analysis += `We'll send your detailed analysis report to: **${responses.email}**\n`;
    }
    if (responses.contact_preference && responses.contact_preference !== 'email') {
      analysis += `Preferred contact method: **${responses.contact_preference}**\n`;
    }
    analysis += `\nFor immediate questions, reach us at: **contact@m8s.ai** or **+1 (438) 8676782**\n\n`;
    
    analysis += `Thank you for your time and detailed responses. We're excited about your project and look forward to helping bring your vision to life! 🎉`;
    
    return analysis;
  }

  // Project-specific getters
  getProjectState(): ProjectDiscoveryState {
    return { ...this.projectState };
  }

  getResponses(): Record<string, string> {
    return { ...this.projectState.responses };
  }

  getProgress(): { currentStep: number; totalSteps: number; currentWave: string } {
    // Calculate excluding the first wave (which is skipped)
    const relevantWaves = CONVERSATION_WAVES.slice(1);
    const totalQuestions = relevantWaves.reduce((sum, wave) => sum + wave.questions.length, 0);
    const completedQuestions = CONVERSATION_WAVES.slice(1, this.projectState.currentWave)
      .reduce((sum, wave) => sum + wave.questions.length, 0) + this.projectState.currentQuestion;
    
    const currentWave = this.getCurrentWave();
    
    return {
      currentStep: completedQuestions + 1,
      totalSteps: totalQuestions,
      currentWave: currentWave?.name || 'Complete'
    };
  }

  // Handle input changes for form elements
  setUserInput(input: string): void {
    this.projectState.userInput = input;
    this.projectState.validationMessage = '';
  }

  getUserInput(): string {
    return this.projectState.userInput;
  }

  setSelectedOption(index: number): void {
    this.projectState.selectedOption = index;
  }

  getSelectedOption(): number {
    return this.projectState.selectedOption;
  }

  getValidationMessage(): string {
    return this.projectState.validationMessage;
  }

  cleanup(): void {
    this.projectState = {
      currentWave: 1, // Skip the first wave
      currentQuestion: 0,
      responses: {},
      userInput: '',
      selectedOption: 0,
      validationMessage: ''
    };
    
    this.clearConversation();
    
    analyticsManager.trackTerminalEvent('project_discovery_cleanup', {
      conversation_id: this.conversationId,
      bot_type: 'project'
    });
  }
}