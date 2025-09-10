// n8n Webhook Integration for Vite React App
// Since this is not a Next.js app, we'll make direct calls to n8n webhooks

interface N8nWebhookResponse {
  text: string;
  suggestedQuestions?: string[];
  requiresTeamConsultation?: boolean;
  conversationPhase?: string;
  exchangeCount?: number;
  shouldTransition?: boolean;
}

interface ConversationHistory {
  role: 'user' | 'bot';
  content: string;
}

interface ConversationIntelligence {
  exchangeCount: number;
  engagementScore: number;
  phase: 'exploration' | 'satisfaction' | 'transition';
  shouldTransition: boolean;
}

// Business Q&A Bot Integration
export async function sendToBusinessQABot(
  userMessage: string, 
  conversationHistory: ConversationHistory[],
  sessionId: string,
  conversationIntelligence?: ConversationIntelligence
): Promise<N8nWebhookResponse> {
  try {
    // Get n8n webhook URL from environment or use development fallback
    const webhookUrl = import.meta.env.VITE_N8N_BUSINESS_QA_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('VITE_N8N_BUSINESS_QA_WEBHOOK_URL not configured, using fallback response');
      
      // Development fallback response
      const fallbackResponse: N8nWebhookResponse = {
        text: `I'm in development mode right now. Here's what I can tell you about m8s:

• We're an AI-powered development team with human architect oversight
• Our team includes AI specialists and elite architects from Unit 8200
• We build everything from business automations to enterprise systems
• Our process: Define → Architect Review → AI Development → Delivery

For detailed information and pricing discussions, please contact our team directly.`,
        suggestedQuestions: [
          "How does your development process work?",
          "Tell me about your human architects", 
          "What technologies do you use?",
          "Ready to discuss my project",
          "I'd like to speak with your team"
        ],
        requiresTeamConsultation: false
      };
      
      // Add transition prompts if needed
      if (conversationIntelligence?.shouldTransition) {
        fallbackResponse.text += "\n\n💡 **It sounds like you might be ready to explore a project!** Would you like to switch to project discovery mode?";
        fallbackResponse.suggestedQuestions = [
          "Yes, let's define my project",
          "Tell me more about your process first",
          "What information do you need?",
          "I'd like to speak with your team"
        ];
      }
      
      return fallbackResponse;
    }

    // Make request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'm8s-website-business-qa'
      },
      body: JSON.stringify({
        userMessage,
        conversationHistory,
        sessionId,
        timestamp: new Date().toISOString(),
        businessPolicy: {
          noPricing: true,
          redirectPricingToTeam: true,
          focusAreas: ['services', 'process', 'team', 'technical_capabilities']
        },
        conversationFlow: conversationIntelligence || {
          exchangeCount: 1,
          engagementScore: 0, 
          phase: 'exploration',
          shouldTransition: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.response || data.text || "I received your message but had trouble processing it.",
      suggestedQuestions: data.suggestedQuestions || [
        "How does your development process work?",
        "Tell me about your team structure",
        "What makes you different?",
        "Ready to discuss my project"
      ],
      requiresTeamConsultation: data.requiresTeamConsultation || false
    };

  } catch (error) {
    console.error('Business QA webhook error:', error);
    
    // Fallback response for errors
    return {
      text: "I'm having trouble connecting right now. Here's what I can tell you:\n\n• We're an AI-powered development team with human architects\n• We build business automations and enterprise systems\n• Our process focuses on quality through AI + human expertise\n\nFor detailed questions, please contact our team directly.",
      suggestedQuestions: [
        "Contact your team directly",
        "Try asking a different question",
        "Ready to define my project instead"
      ],
      requiresTeamConsultation: true
    };
  }
}

// Project Data Submission
interface ProjectDataPayload {
  email: string;
  name: string;
  timestamp: string;
  sessionId: string;
  projectData: {
    questionsAnswers: Array<{
      questionId: string;
      questionText: string;
      questionType: string;
      answer: string;
      timestamp: string;
    }>;
    totalQuestions: number;
    completionTime: number;
    leadScore: number;
    conversationPath: string;
  };
  metadata: {
    userAgent: string;
    timestamp: number;
    version: string;
  };
}

export async function sendProjectDataToN8n(payload: ProjectDataPayload): Promise<{ success: boolean; message: string }> {
  try {
    // Send to Bot 2 (Project Interrogation) which automatically forwards to Bot 3 (Summarizer)
    const webhookUrl = import.meta.env.VITE_N8N_PROJECT_DATA_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('VITE_N8N_PROJECT_DATA_WEBHOOK_URL not configured');
      
      // Log project data for development
      console.log('📋 PROJECT DATA SUBMISSION (Development Mode):', {
        email: payload.email,
        name: payload.name,
        questionsCount: payload.projectData.questionsAnswers.length,
        leadScore: payload.projectData.leadScore,
        projectIdea: payload.projectData.questionsAnswers.find(qa => qa.questionId === 'project_idea')?.answer || 'Not specified'
      });

      console.log('📝 QUESTIONS & ANSWERS:');
      payload.projectData.questionsAnswers.forEach((qa, index) => {
        console.log(`${index + 1}. ${qa.questionText}`);
        console.log(`   Answer: ${qa.answer}`);
      });

      return {
        success: true,
        message: 'Project data logged locally (development mode)'
      };
    }

    // Send to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'm8s-website-project-data'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`n8n project webhook returned ${response.status}`);
    }

    const result = await response.json();
    
    console.log(`✅ Project data sent to n8n - Email: ${payload.email}, Questions: ${payload.projectData.questionsAnswers.length}`);
    
    return {
      success: true,
      message: result.message || 'Project data submitted successfully'
    };

  } catch (error) {
    console.error('Project data submission error:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Bot 3: Direct Summarizer Integration (for manual triggers)
interface SummarizerPayload {
  email: string;
  name: string;
  projectData: {
    questionsAnswers: Array<{
      questionId: string;
      questionText: string;
      questionType: string;
      answer: string;
      timestamp: string;
    }>;
    totalQuestions: number;
    completionTime: number;
    leadScore: number;
    conversationPath: string;
  };
  trigger: 'manual' | 'automatic';
  timestamp: string;
  sessionId: string;
}

export async function sendToSummarizerBot(payload: SummarizerPayload): Promise<{ success: boolean; message: string }> {
  try {
    const webhookUrl = import.meta.env.VITE_N8N_SUMMARIZER_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('VITE_N8N_SUMMARIZER_WEBHOOK_URL not configured');
      
      // Development fallback - log summarizer action
      console.log('🧠 SUMMARIZER BOT (Development Mode):', {
        action: 'process_and_notify',
        lead: {
          email: payload.email,
          name: payload.name,
          score: payload.projectData.leadScore
        },
        summary: `New ${payload.projectData.leadScore >= 8 ? 'HIGH' : 'MEDIUM'} priority lead: ${payload.name} (${payload.email})`,
        nextActions: ['Update Excel spreadsheet', 'Send Slack notification', 'Email team lead']
      });

      return {
        success: true,
        message: 'Summarizer actions logged locally (development mode)'
      };
    }

    // Send to n8n summarizer webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'm8s-website-summarizer'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`n8n summarizer webhook returned ${response.status}`);
    }

    const result = await response.json();
    
    console.log(`🧠 Summarizer processed - Lead: ${payload.email}, Score: ${payload.projectData.leadScore}`);
    
    return {
      success: true,
      message: result.message || 'Data processed and team notified'
    };

  } catch (error) {
    console.error('Summarizer webhook error:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Environment variable validation for development
export function validateN8nConfiguration(): { businessQA: boolean; projectData: boolean; summarizer: boolean } {
  return {
    businessQA: !!import.meta.env.VITE_N8N_BUSINESS_QA_WEBHOOK_URL,
    projectData: !!import.meta.env.VITE_N8N_PROJECT_DATA_WEBHOOK_URL,
    summarizer: !!import.meta.env.VITE_N8N_SUMMARIZER_WEBHOOK_URL
  };
}