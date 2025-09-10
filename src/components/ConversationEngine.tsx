import React, { useState, useCallback, useEffect } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';
import { sendToBusinessQABot, sendProjectDataToN8n } from '@/utils/n8nWebhooks';

type BotMode = 'qa' | 'project';

interface N8nWebhookResponse {
  text: string;
  suggestedQuestions?: string[];
  requiresTeamConsultation?: boolean;
  conversationPhase?: string;
  exchangeCount?: number;
  shouldTransition?: boolean;
}

interface ConversationEngineProps {
  onComplete: (data: EnhancedConversationData) => void;
  initialBotMode?: BotMode;
  onBotModeSelect?: (mode: BotMode) => void;
}


interface Question {
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

interface Wave {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  adaptive?: boolean;
  minQuestions?: number;
  maxQuestions?: number;
}

interface ProjectInsight {
  category: 'immediate' | 'future' | 'risk' | 'technical';
  description: string;
  impact: 'low' | 'medium' | 'high';
  source: string;
}

interface EnhancedConversationData {
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

// Enhanced adaptive conversation flow
const CONVERSATION_WAVES: Wave[] = [
  {
    id: 'wave1',
    name: 'Welcome & Path Selection',
    description: 'Bot selection',
    questions: [
      {
        id: 'welcome',
        text: 'Hi! I\'m your AI project consultant. I can help you learn about m8s or start defining your project with intelligent discovery. What would you prefer?',
        type: 'multiple-choice',
        options: ['Learn more about m8s', 'Start smart project discovery'],
        followUp: 'Perfect! Let me help you with that.',
        category: 'foundation'
      }
    ]
  },
  {
    id: 'wave2',
    name: 'Project Foundation Discovery',
    description: 'Core project understanding with adaptive depth',
    adaptive: true,
    minQuestions: 3,
    maxQuestions: 8,
    questions: [
      {
        id: 'project_idea',
        text: 'Tell me about your project vision. What would you like us to build or automate?',
        type: 'text',
        followUp: 'Interesting! Let me understand the business context better.',
        validation: (answer: string) => answer.length > 10,
        category: 'foundation',
        riskFlags: ['unclear requirements', 'scope creep potential']
      },
      {
        id: 'business_problem',
        text: 'What core business problem are you trying to solve with this project?',
        type: 'text',
        followUp: 'That\'s a valuable problem to solve. How are you handling this today?',
        validation: (answer: string) => answer.length > 5,
        category: 'business',
        adaptiveLogic: {
          condition: 'business_context_needed',
          nextQuestions: []
        }
      },
      {
        id: 'current_solution',
        text: 'How do you currently handle this process? What tools or methods do you use?',
        type: 'text',
        followUp: 'Understanding your current setup helps me design the best solution.',
        category: 'technical',
        technicalDepth: 'basic'
      },
      {
        id: 'project_scale',
        text: 'What kind of project scope are you thinking about?',
        type: 'multiple-choice',
        options: [
          'Quick proof-of-concept (validate the idea)',
          'Production-ready solution (full implementation)', 
          'Enterprise-scale system (comprehensive solution)',
          'Not sure - help me decide'
        ],
        followUp: 'That helps me understand the investment level and approach.',
        category: 'foundation',
        adaptiveLogic: {
          condition: 'scale_determines_questions',
          nextQuestions: []
        }
      },
      {
        id: 'success_criteria',
        text: 'How will you know this project is successful? What specific outcomes are you hoping for?',
        type: 'text',
        followUp: 'Clear success metrics are crucial for project success.',
        validation: (answer: string) => answer.length > 5,
        category: 'business'
      },
      {
        id: 'timeline_expectations',
        text: 'Do you have any timeline expectations or constraints?',
        type: 'multiple-choice',
        options: [
          'ASAP - this is urgent',
          'Within 1-3 months',
          'Within 6 months', 
          'Flexible timeline - quality over speed',
          'Not sure yet'
        ],
        followUp: 'Timeline helps me recommend the right approach.',
        category: 'resource',
        riskFlags: ['timeline pressure', 'unrealistic expectations']
      },
      {
        id: 'technical_experience',
        text: 'What\'s your team\'s technical background with similar projects?',
        type: 'multiple-choice',
        options: [
          'Very experienced - we know exactly what we want',
          'Some experience - we understand the basics',
          'Limited experience - we need guidance',
          'No technical background - full consulting needed'
        ],
        followUp: 'This helps me adjust my recommendations to your expertise level.',
        category: 'technical',
        technicalDepth: 'basic',
        adaptiveLogic: {
          condition: 'technical_depth_adjustment',
          nextQuestions: []
        }
      },
      {
        id: 'integration_needs',
        text: 'Will this need to integrate with existing systems, APIs, or databases?',
        type: 'multiple-choice',
        options: [
          'Yes - several integrations needed',
          'Yes - one or two key integrations',
          'Maybe - not sure yet',
          'No - standalone solution'
        ],
        followUp: 'Integration complexity significantly impacts the technical approach.',
        category: 'technical',
        technicalDepth: 'intermediate',
        riskFlags: ['integration complexity', 'dependency risks']
      }
    ]
  },
  {
    id: 'wave3',
    name: 'Contact & Next Steps',
    description: 'Gather contact info and plan follow-up',
    questions: [
      {
        id: 'contact_info',
        text: 'I\'d love to have our team create a detailed project plan for you. What\'s your name?',
        type: 'text',
        followUp: 'Great to meet you! What\'s the best email to send your project analysis?',
        validation: (answer: string) => answer.length > 1,
        category: 'foundation'
      },
      {
        id: 'email',
        text: 'What\'s your email address?',
        type: 'text',
        followUp: 'Perfect! We\'ll send you a comprehensive project analysis within 24 hours.',
        validation: (answer: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer.trim()),
        category: 'foundation'
      },
      {
        id: 'company',
        text: 'What company or organization is this for? (Optional)',
        type: 'text',
        followUp: 'Thanks! This helps us tailor our recommendations.',
        category: 'foundation'
      },
      {
        id: 'preferred_contact',
        text: 'How would you prefer our team to follow up?',
        type: 'multiple-choice',
        options: [
          'Email with detailed analysis first',
          'Quick phone call to discuss',
          'Video meeting to review together',
          'Email only for now'
        ],
        followUp: 'Perfect! We\'ll reach out using your preferred method.',
        category: 'foundation'
      }
    ]
  }
];

export const ConversationEngine: React.FC<ConversationEngineProps> = ({ 
  onComplete, 
  initialBotMode = 'qa', 
  onBotModeSelect 
}) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  
  // All hooks must be at the top level
  const [currentWave, setCurrentWave] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  // Bot state
  const [botMode, setBotMode] = useState<BotMode>(initialBotMode);
  const [isN8nMode, setIsN8nMode] = useState(false);
  const [n8nResponse, setN8nResponse] = useState<N8nWebhookResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'bot', content: string}>>([]);
  const [isAwaitingN8nResponse, setIsAwaitingN8nResponse] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  
  // Conversation intelligence and analysis
  const [qaExchangeCount, setQaExchangeCount] = useState(0);
  const [projectInsights, setProjectInsights] = useState<ProjectInsight[]>([]);
  const [riskFlags, setRiskFlags] = useState<string[]>([]);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<Question[]>([]);
  const [conversationId] = useState(() => 'conv_' + Date.now());

  // Smart analysis functions
  const analyzeProjectComplexity = useCallback((responses: Record<string, string>): 'simple' | 'standard' | 'complex' => {
    const factors = {
      integration: responses.integration_needs?.includes('several') ? 2 : responses.integration_needs?.includes('one') ? 1 : 0,
      scale: responses.project_scale?.includes('Enterprise') ? 3 : responses.project_scale?.includes('Production') ? 2 : 1,
      timeline: responses.timeline_expectations?.includes('ASAP') ? 2 : 0,
      experience: responses.technical_experience?.includes('No technical') ? 2 : responses.technical_experience?.includes('Limited') ? 1 : 0
    };
    
    const totalComplexity = factors.integration + factors.scale + factors.timeline + factors.experience;
    return totalComplexity >= 6 ? 'complex' : totalComplexity >= 3 ? 'standard' : 'simple';
  }, []);

  const generateProjectInsights = useCallback((responses: Record<string, string>): ProjectInsight[] => {
    const insights: ProjectInsight[] = [];
    
    // Business impact analysis
    if (responses.business_problem?.length > 20) {
      insights.push({
        category: 'immediate',
        description: 'Clear business problem identified with good articulation',
        impact: 'high',
        source: 'business_problem'
      });
    }
    
    // Technical risk analysis
    if (responses.integration_needs?.includes('several')) {
      insights.push({
        category: 'risk',
        description: 'Multiple integrations required - potential complexity and timeline risk',
        impact: 'high',
        source: 'integration_needs'
      });
    }
    
    // Timeline pressure
    if (responses.timeline_expectations?.includes('ASAP')) {
      insights.push({
        category: 'risk',
        description: 'Urgent timeline may require scope reduction or additional resources',
        impact: 'medium',
        source: 'timeline_expectations'
      });
    }
    
    // Technical guidance needs
    if (responses.technical_experience?.includes('No technical') || responses.technical_experience?.includes('Limited')) {
      insights.push({
        category: 'technical',
        description: 'Client needs comprehensive technical guidance and documentation',
        impact: 'medium',
        source: 'technical_experience'
      });
    }
    
    return insights;
  }, []);

  const generateAdaptiveQuestions = useCallback((lastResponse: string, questionId: string): Question[] => {
    const adaptive: Question[] = [];
    
    // Generate follow-ups based on specific answers
    if (questionId === 'project_idea' && lastResponse.toLowerCase().includes('ai')) {
      adaptive.push({
        id: 'ai_specific_use_case',
        text: 'I see you mentioned AI. What specific AI capabilities are you looking for? (e.g., data analysis, automation, chatbots, prediction)',
        type: 'text',
        category: 'technical',
        technicalDepth: 'intermediate'
      });
    }
    
    if (questionId === 'integration_needs' && lastResponse.includes('several')) {
      adaptive.push({
        id: 'integration_details',
        text: 'Which systems need to be integrated? (e.g., CRM, database, APIs, existing software)',
        type: 'text',
        category: 'technical',
        technicalDepth: 'advanced',
        riskFlags: ['integration complexity']
      });
    }
    
    if (questionId === 'business_problem' && lastResponse.length > 50) {
      adaptive.push({
        id: 'quantify_impact',
        text: 'Can you quantify the impact? (e.g., time saved, cost reduction, revenue increase)',
        type: 'text',
        category: 'business'
      });
    }
    
    return adaptive;
  }, []);
  
  const generateTechRecommendations = useCallback((responses: Record<string, string>): string[] => {
    const recommendations: string[] = [];
    
    // Web applications
    if (responses.project_idea?.toLowerCase().includes('web')) {
      recommendations.push('React/TypeScript for frontend', 'Node.js/Express for backend');
    }
    
    // Mobile applications - offer both options
    if (responses.project_idea?.toLowerCase().includes('mobile') || responses.project_idea?.toLowerCase().includes('app')) {
      recommendations.push('Flutter for native iOS/Android apps', 'React Native for cross-platform mobile');
    }
    
    // AI and automation solutions
    if (responses.project_idea?.toLowerCase().includes('ai') || responses.project_idea?.toLowerCase().includes('automat')) {
      recommendations.push('Python/FastAPI for AI services', 'OpenAI API integration');
    }
    
    // Automation-specific recommendations
    if (responses.project_idea?.toLowerCase().includes('automat') || 
        responses.project_idea?.toLowerCase().includes('workflow') ||
        responses.business_problem?.toLowerCase().includes('manual') ||
        responses.business_problem?.toLowerCase().includes('repetitive')) {
      recommendations.push('n8n for workflow automation', 'Zapier integration', 'Custom automation APIs');
    }
    
    // Process automation
    if (responses.project_idea?.toLowerCase().includes('process') || 
        responses.business_problem?.toLowerCase().includes('efficiency')) {
      recommendations.push('Business process automation (BPA)', 'RPA (Robotic Process Automation)');
    }
    
    // Data automation
    if (responses.project_idea?.toLowerCase().includes('data') || 
        responses.project_idea?.toLowerCase().includes('analytics')) {
      recommendations.push('Data pipeline automation', 'ETL/ELT processes', 'Business intelligence dashboards');
    }
    
    // Integration complexity
    if (responses.integration_needs?.includes('several')) {
      recommendations.push('API Gateway for integration management', 'Event-driven architecture', 'Microservices approach');
    }
    
    // E-commerce
    if (responses.project_idea?.toLowerCase().includes('ecommerce') || 
        responses.project_idea?.toLowerCase().includes('shop') ||
        responses.project_idea?.toLowerCase().includes('store')) {
      recommendations.push('Shopify/WooCommerce integration', 'Payment gateway automation', 'Inventory management');
    }
    
    // Default comprehensive stack
    if (recommendations.length === 0) {
      recommendations.push('Modern web stack (React, Node.js)', 'Cloud hosting (AWS/Azure)', 'Automation tools (n8n, custom APIs)');
    }
    
    return recommendations;
  }, []);
  
  const generateProjectPhases = useCallback((responses: Record<string, string>, _insights: ProjectInsight[]): {phase1: string[], phase2: string[], phase3: string[]} => {
    const hasComplexIntegration = responses.integration_needs?.includes('several');
    const isUrgent = responses.timeline_expectations?.includes('ASAP');
    const needsGuidance = responses.technical_experience?.includes('No technical') || responses.technical_experience?.includes('Limited');
    
    return {
      phase1: [
        'Requirements analysis and documentation',
        needsGuidance ? 'Technical architecture consultation' : 'Technical specification review',
        'UI/UX design and prototyping',
        hasComplexIntegration ? 'Integration planning and API analysis' : 'Core feature development start'
      ],
      phase2: [
        'Core functionality development',
        hasComplexIntegration ? 'Integration implementation' : 'Advanced features',
        'Testing and quality assurance',
        isUrgent ? 'Rapid iteration cycles' : 'Comprehensive testing'
      ],
      phase3: [
        'Production deployment',
        'Performance optimization',
        'User training and documentation',
        'Ongoing support setup'
      ]
    };
  }, []);

  // All useEffect and useCallback hooks
  useEffect(() => {
    analyticsManager.startConversation('initial');
  }, []);

  const sendToN8nWebhook = useCallback(async (userMessage: string) => {
    setIsAwaitingN8nResponse(true);
    
    try {
      const response = await sendToBusinessQABot(
        userMessage,
        conversationHistory,
        conversationId,
        {
          exchangeCount: qaExchangeCount,
          engagementScore: 0,
          phase: 'exploration',
          shouldTransition: qaExchangeCount >= 5
        }
      );
      
      setN8nResponse(response);
      setSuggestedQuestions(response.suggestedQuestions || []);
      
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'bot', content: response.text }
      ]);
      
      setQaExchangeCount(prev => prev + 1);
      
    } catch (error) {
      console.error('n8n webhook error:', error);
      setN8nResponse({
        text: "I'm having trouble connecting right now. For questions about our services, please contact our team directly.",
        requiresTeamConsultation: true
      });
    } finally {
      setIsAwaitingN8nResponse(false);
    }
  }, [conversationHistory, conversationId, qaExchangeCount]);

  const handleBotModeSelection = useCallback(async (answer: string) => {
    if (answer === 'Learn more about m8s') {
      setBotMode('qa');
      setIsN8nMode(true);
      if (onBotModeSelect) onBotModeSelect('qa');
      
      setN8nResponse({
        text: "Great! I'm your business expert. I can tell you about our services, process, team, and capabilities. What would you like to know?",
        suggestedQuestions: [
          "How does your development process work?",
          "Tell me about your team structure", 
          "What technologies do you use?",
          "Can you show me examples?"
        ]
      });
      setSuggestedQuestions([
        "How does your development process work?",
        "Tell me about your team structure", 
        "What technologies do you use?",
        "Can you show me examples?"
      ]);
      
    } else if (answer === 'Start my project') {
      setBotMode('project');
      setIsN8nMode(false);
      if (onBotModeSelect) onBotModeSelect('project');
      setCurrentWave(1); // Move to project questions
      setCurrentQuestion(0);
    }
  }, [onBotModeSelect]);

  const handleSubmitAnswer = useCallback(async () => {
    const currentWaveData = CONVERSATION_WAVES[currentWave];
    const currentQuestionData = currentWaveData?.questions[currentQuestion];
    
    if (!currentQuestionData) return;

    let answer = '';
    
    if (currentQuestionData.type === 'multiple-choice') {
      answer = currentQuestionData.options?.[selectedOption] || '';
    } else if (currentQuestionData.type === 'text') {
      answer = userInput.trim();
      if (currentQuestionData.validation && !currentQuestionData.validation(answer)) {
        setValidationMessage('Please provide a valid answer.');
        setTimeout(() => setValidationMessage(''), 3000);
        return;
      }
    }

    if (!answer) return;

    await audio.playSelectionSound();

    // Handle bot mode selection
    if (currentQuestionData.id === 'welcome') {
      await handleBotModeSelection(answer);
      setUserInput('');
      setSelectedOption(0);
      return;
    }

    // Handle Q&A mode
    if (isN8nMode && botMode === 'qa') {
      const userMessage = currentQuestionData.type === 'text' ? userInput.trim() : suggestedQuestions[selectedOption];
      
      if (userMessage.toLowerCase().includes('start my project') || userMessage.toLowerCase().includes('define my project')) {
        setBotMode('project');
        setIsN8nMode(false);
        setCurrentWave(1);
        setCurrentQuestion(0);
      } else {
        await sendToN8nWebhook(userMessage);
      }
      
      setUserInput('');
      setSelectedOption(0);
      return;
    }

    // Store response and analyze for insights
    const newResponses = {
      ...responses,
      [currentQuestionData.id]: answer
    };
    setResponses(newResponses);
    
    // Generate insights and check for risks
    const newInsights = generateProjectInsights(newResponses);
    setProjectInsights(prev => [...prev, ...newInsights]);
    
    // Check for risk flags
    if (currentQuestionData.riskFlags) {
      setRiskFlags(prev => [...prev, ...currentQuestionData.riskFlags!]);
    }
    
    // Generate adaptive follow-up questions
    const adaptiveFollowUps = generateAdaptiveQuestions(answer, currentQuestionData.id);
    if (adaptiveFollowUps.length > 0) {
      setAdaptiveQuestions(prev => [...prev, ...adaptiveFollowUps]);
    }

    // Check if we have adaptive questions to ask
    const shouldAskAdaptiveQuestions = adaptiveQuestions.length > 0 && currentWave === 1; // Only in project discovery wave
    
    // Move to next question or complete
    if (shouldAskAdaptiveQuestions && adaptiveQuestions.length > 0) {
      // Insert adaptive question
      const nextAdaptive = adaptiveQuestions[0];
      setAdaptiveQuestions(prev => prev.slice(1));
      // Add to current wave temporarily
      CONVERSATION_WAVES[currentWave].questions.push(nextAdaptive);
      setCurrentQuestion(prev => prev + 1);
    } else if (currentQuestion < currentWaveData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentWave < CONVERSATION_WAVES.length - 1) {
      setCurrentWave(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Project complete - send to n8n
      try {
        const email = responses['email'] || '';
        const name = responses['contact_info'] || '';
        
        const enhancedQuestionsAnswers = Object.entries(newResponses).map(([questionId, answer]) => ({
          questionId,
          questionText: CONVERSATION_WAVES.flatMap(w => w.questions).find(q => q.id === questionId)?.text || questionId,
          questionType: 'text',
          answer: typeof answer === 'string' ? answer : String(answer),
          timestamp: new Date().toISOString(),
          category: CONVERSATION_WAVES.flatMap(w => w.questions).find(q => q.id === questionId)?.category || 'general',
          riskFlags: CONVERSATION_WAVES.flatMap(w => w.questions).find(q => q.id === questionId)?.riskFlags || []
        }));
        
        const enhancedProjectData = {
          questionsAnswers: enhancedQuestionsAnswers,
          totalQuestions: enhancedQuestionsAnswers.length,
          completionTime: 0,
          leadScore: enhancedQuestionsAnswers.length * 3 + projectInsights.length * 2,
          conversationPath: 'enhanced_project_discovery',
          insights: projectInsights,
          complexity: analyzeProjectComplexity(newResponses),
          riskFlags,
          estimatedEffort: analyzeProjectComplexity(newResponses) === 'complex' ? '3-6 months' : 
                          analyzeProjectComplexity(newResponses) === 'standard' ? '1-3 months' : '2-6 weeks',
          businessImpact: newResponses.success_criteria || 'To be defined',
          techRecommendations: generateTechRecommendations(newResponses),
          projectPhases: generateProjectPhases(newResponses, projectInsights)
        };
        
        const payload = {
          email,
          name,
          company: newResponses.company || '',
          preferredContact: newResponses.preferred_contact || 'Email with detailed analysis first',
          timestamp: new Date().toISOString(),
          sessionId: conversationId,
          projectData: enhancedProjectData,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            version: '3.0',
            templateId: 'project-interrogation-output-template-v3',
            totalInsights: projectInsights.length,
            riskFactors: riskFlags.length
          }
        };

        await sendProjectDataToN8n(payload);
      } catch (error) {
        console.error('Failed to send project data:', error);
      }
      
      setIsGenerating(true);
      setTimeout(() => {
        const enhancedData: EnhancedConversationData = {
          responses: newResponses,
          insights: projectInsights,
          complexity: analyzeProjectComplexity(newResponses),
          riskFlags,
          techStack: generateTechRecommendations(newResponses),
          phases: generateProjectPhases(newResponses, projectInsights),
          estimatedEffort: analyzeProjectComplexity(newResponses) === 'complex' ? '3-6 months' : 
                          analyzeProjectComplexity(newResponses) === 'standard' ? '1-3 months' : '2-6 weeks',
          businessImpact: newResponses.success_criteria || 'To be defined'
        };
        
        onComplete(enhancedData);
      }, 3000);
    }

    setUserInput('');
    setSelectedOption(0);
    setValidationMessage('');
  }, [currentWave, currentQuestion, selectedOption, userInput, responses, handleBotModeSelection, sendToN8nWebhook, isN8nMode, botMode, suggestedQuestions, conversationId, onComplete, audio, adaptiveQuestions, analyzeProjectComplexity, generateAdaptiveQuestions, generateProjectInsights, generateProjectPhases, generateTechRecommendations, projectInsights, riskFlags]);

  // Render logic
  const currentWaveData = CONVERSATION_WAVES[currentWave];
  const currentQuestionData = currentWaveData?.questions[currentQuestion];

  // Early returns only after all hooks
  if (isGenerating) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-300 text-2xl mb-4">⚡ Processing Your Project</div>
          <div className="text-amber-300 text-lg">Thank you! Our team will contact you shortly.</div>
        </div>
      </div>
    );
  }

  if (!currentWaveData || !currentQuestionData) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl">Error loading conversation</div>
          <button 
            onClick={() => { setCurrentWave(0); setCurrentQuestion(0); }}
            className="mt-4 bg-green-600 px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // Q&A Mode Interface with Bubble Chat
  if (isN8nMode && botMode === 'qa') {
    return (
      <div className="relative min-h-screen bg-black text-white font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/30">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="retro-glow-green text-lg">ARIA - Project Validation Terminal</span>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-8 py-4 border-b border-green-500/20">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Completion:</span>
            <div className="bg-green-900/30 border border-green-500/30 rounded px-3 py-1 flex items-center space-x-2">
              <span className="text-red-400">0%</span>
              <span className="text-red-400">❌</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Insights:</span>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded px-3 py-1 flex items-center space-x-2">
              <span className="text-blue-400">0</span>
              <span className="text-blue-400">📊</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-6 retro-glow-green text-xl">
            Welcome & Path Selection :1/3
          </div>

          {/* ARIA's Message Bubble */}
          {n8nResponse && (
            <div className="mb-6 relative">
              {/* ARIA Avatar */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="w-12 h-12 bg-black/80 border border-green-500/40 rounded-full p-2 shadow-lg shadow-green-500/20">
                  <img 
                    src="/robot-favicon-white.svg" 
                    alt="ARIA" 
                    className="w-full h-full aria-avatar retro-glow-green"
                    style={{
                      animation: 'ariaBlink 3s infinite ease-in-out'
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-black/60 border border-green-500/40 rounded-2xl p-6 pt-8 shadow-lg shadow-green-500/10 ml-4">
                <div className="retro-glow-green text-base leading-relaxed whitespace-pre-line">
                  {isAwaitingN8nResponse ? (
                    <div className="flex items-center space-x-2">
                      <span>Thinking</span>
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-green-400 rounded-full animate-pulse retro-glow-green"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    n8nResponse.text
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-3 text-right">
                  Category: foundation
                </div>
              </div>
            </div>
          )}
          
          {/* Response Options */}
          {!isAwaitingN8nResponse && suggestedQuestions.length > 0 && (
            <div className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <div
                  key={index}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all duration-200 font-mono ${
                    selectedOption === index
                      ? 'border-green-500/60 bg-green-900/20 retro-glow-green shadow-lg shadow-green-500/10'
                      : 'border-green-500/20 hover:border-green-500/40 hover:bg-green-900/10 text-gray-300 hover:text-green-300'
                  }`}
                  onClick={() => {
                    setSelectedOption(index);
                    setTimeout(() => handleSubmitAnswer(), 100);
                  }}
                >
                  <div className="text-right">
                    {question}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Custom Input */}
          {!isAwaitingN8nResponse && (
            <div className="mt-6 space-y-4">
              <div className="text-gray-400 text-sm">Or ask your own question:</div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userInput.trim() && handleSubmitAnswer()}
                  className="flex-1 p-3 bg-black border border-green-500/30 retro-glow-green rounded-lg font-mono focus:border-green-500/60 focus:outline-none"
                  placeholder="Ask about services, team, process..."
                  autoFocus
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userInput.trim() && selectedOption === -1}
                  className="px-6 py-3 bg-green-600/20 border border-green-500/30 retro-glow-green hover:bg-green-600/30 disabled:bg-gray-600/20 disabled:border-gray-500/20 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg transition-all duration-200 font-mono"
                >
                  Send
                </button>
              </div>
              
              <div className="text-center pt-4 border-t border-green-500/20">
                <button
                  onClick={() => {
                    setBotMode('project');
                    setIsN8nMode(false);
                    setCurrentWave(1);
                    setCurrentQuestion(0);
                  }}
                  className="bg-green-600/20 border border-green-500/30 retro-glow-green hover:bg-green-600/30 px-6 py-3 rounded-lg transition-all duration-200 font-mono"
                >
                  Ready to define my project →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Question Counter */}
        <div className="text-center py-4 text-gray-500 font-mono">
          Question 1/1
        </div>
      </div>
    );
  }

  // Project Mode Interface with Bubble Chat
  return (
    <div className="relative min-h-screen bg-black text-white font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="retro-glow-green text-lg">ARIA - Project Validation Terminal</span>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center space-x-8 py-4 border-b border-green-500/20">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Completion:</span>
          <div className="bg-green-900/30 border border-green-500/30 rounded px-3 py-1 flex items-center space-x-2">
            <span className="text-green-400">{Math.round((Object.keys(responses).length / CONVERSATION_WAVES.reduce((acc, wave) => acc + wave.questions.length, 0)) * 100)}%</span>
            <span className="text-green-400">✅</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Insights:</span>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded px-3 py-1 flex items-center space-x-2">
            <span className="text-blue-400">{projectInsights.length}</span>
            <span className="text-blue-400">📊</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-6 retro-glow-green text-xl">
          {currentWaveData.name} :{currentWave + 1}/{CONVERSATION_WAVES.length}
        </div>
        
        {/* ARIA's Message Bubble */}
        <div className="mb-6 relative">
          {/* ARIA Avatar */}
          <div className="absolute -top-2 -left-2 z-10">
            <div className="w-12 h-12 bg-black/80 border border-green-500/40 rounded-full p-2 shadow-lg shadow-green-500/20">
              <img 
                src="/robot-favicon-white.svg" 
                alt="ARIA" 
                className="w-full h-full aria-avatar retro-glow-green"
                style={{
                  animation: 'ariaBlink 3s infinite ease-in-out'
                }}
              />
            </div>
          </div>
          
          <div className="bg-black/60 border border-green-500/40 rounded-2xl p-6 pt-8 shadow-lg shadow-green-500/10 ml-4">
            <div className="retro-glow-green text-base leading-relaxed whitespace-pre-line">
              {currentQuestionData.text}
            </div>
            <div className="text-xs text-gray-500 mt-3 text-right">
              Category: {currentQuestionData.category}
              {currentQuestionData.technicalDepth && (
                <span className="ml-2">• {currentQuestionData.technicalDepth} level</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Response Options */}
        <div className="space-y-3">
          {currentQuestionData.type === 'multiple-choice' && (
            <>
              {currentQuestionData.options?.map((option, index) => (
                <div
                  key={index}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all duration-200 font-mono ${
                    selectedOption === index
                      ? 'border-green-500/60 bg-green-900/20 retro-glow-green shadow-lg shadow-green-500/10'
                      : 'border-green-500/20 hover:border-green-500/40 hover:bg-green-900/10 text-gray-300 hover:text-green-300'
                  }`}
                  onClick={() => {
                    setSelectedOption(index);
                    setTimeout(() => handleSubmitAnswer(), 100);
                  }}
                >
                  <div className="text-right">
                    {option}
                  </div>
                </div>
              ))}
            </>
          )}
          
          {currentQuestionData.type === 'text' && (
            <div className="space-y-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userInput.trim() && handleSubmitAnswer()}
                  className="flex-1 p-3 bg-black border border-green-500/30 retro-glow-green rounded-lg font-mono focus:border-green-500/60 focus:outline-none"
                  placeholder="Your answer..."
                  autoFocus
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userInput.trim()}
                  className="px-6 py-3 bg-green-600/20 border border-green-500/30 retro-glow-green hover:bg-green-600/30 disabled:bg-gray-600/20 disabled:border-gray-500/20 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg transition-all duration-200 font-mono"
                >
                  Send
                </button>
              </div>
              {validationMessage && (
                <div className="text-red-400 text-sm font-mono">{validationMessage}</div>
              )}
            </div>
          )}
        </div>
        
        {/* Question Counter and Latest Insight */}
        <div className="text-center py-4 text-gray-500 font-mono space-y-2">
          <div>Question {currentQuestion + 1}/{currentWaveData.questions.length}</div>
          {projectInsights.length > 0 && (
            <div className="text-xs text-blue-400">
              💡 Latest insight: {projectInsights[projectInsights.length - 1]?.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};