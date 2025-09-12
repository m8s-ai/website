// Conversation Engine Types and Interfaces

export type BotMode = 'qa' | 'project';

export interface N8nWebhookResponse {
  text: string;
  suggestedQuestions?: string[];
  requiresTeamConsultation?: boolean;
  conversationPhase?: string;
  exchangeCount?: number;
  shouldTransition?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'yes-no';
  options?: string[];
  followUp?: string;
  validation?: (answer: string) => boolean;
  category?: 'foundation' | 'technical' | 'business' | 'resource';
  adaptiveLogic?: {
    condition: string;
    nextQuestions?: Question[];
    skipIf?: string;
  };
  riskFlags?: string[];
  technicalDepth?: 'basic' | 'intermediate' | 'advanced';
}

export interface Wave {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  adaptive?: boolean;
  minQuestions?: number;
  maxQuestions?: number;
}

export interface ProjectInsight {
  category: 'immediate' | 'future' | 'risk' | 'technical';
  description: string;
  impact: 'low' | 'medium' | 'high';
  source: string;
}

export interface EnhancedConversationData {
  responses: Record<string, string>;
  insights: ProjectInsight[];
  complexity: 'simple' | 'standard' | 'complex';
  riskFlags: string[];
  techStack: string[];
  phases: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
  };
  estimatedEffort: string;
  businessImpact: string;
}

export interface ConversationEngineProps {
  onComplete: (data: EnhancedConversationData) => void;
  initialBotMode?: BotMode;
  onBotModeSelect?: (mode: BotMode) => void;
}

export interface ConversationState {
  currentWave: number;
  currentQuestion: number;
  responses: Record<string, string>;
  userInput: string;
  selectedOption: number;
  isGenerating: boolean;
  validationMessage: string;
}

export interface BotState {
  botMode: BotMode;
  isN8nMode: boolean;
  n8nResponse: N8nWebhookResponse | null;
  conversationHistory: Array<{role: 'user' | 'bot', content: string}>;
  isAwaitingN8nResponse: boolean;
  suggestedQuestions: string[];
}

export interface ConversationAnalytics {
  qaExchangeCount: number;
  projectInsights: ProjectInsight[];
  riskFlags: string[];
  adaptiveQuestions: Question[];
  conversationId: string;
}