import { useState, useCallback } from 'react';
import { sendToBusinessQABot, sendProjectDataToN8n } from '@/utils/n8nWebhooks';
import type { N8nWebhookResponse, EnhancedConversationData } from '@/types/conversation';

export const useN8nWebhook = () => {
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [response, setResponse] = useState<N8nWebhookResponse | null>(null);

  const sendQAMessage = useCallback(async (
    message: string,
    conversationHistory: Array<{role: 'user' | 'bot', content: string}>,
    conversationId: string,
    exchangeCount: number
  ): Promise<N8nWebhookResponse | null> => {
    setIsAwaitingResponse(true);
    
    try {
      const result = await sendToBusinessQABot(
        message,
        conversationHistory,
        conversationId,
        {
          exchangeCount,
          engagementScore: Math.min(exchangeCount * 2, 10),
          phase: exchangeCount <= 2 ? 'exploration' : exchangeCount <= 5 ? 'satisfaction' : 'transition',
          shouldTransition: exchangeCount >= 5
        }
      );
      
      setResponse(result);
      return result;
    } catch (error) {
      console.error('Error sending Q&A message:', error);
      setResponse({
        text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or feel free to contact our team directly at contact@m8s.ai for immediate assistance.",
        suggestedQuestions: [
          "Tell me about m8s services",
          "How does project validation work?",
          "What technologies do you use?"
        ]
      });
      return null;
    } finally {
      setIsAwaitingResponse(false);
    }
  }, []);

  const sendProjectData = useCallback(async (data: EnhancedConversationData): Promise<boolean> => {
    try {
      // Transform EnhancedConversationData to the format expected by the webhook
      const projectPayload = {
        email: data.responses.email || '',
        name: data.responses.contact_info || 'Unknown',
        timestamp: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
        projectData: {
          questionsAnswers: Object.entries(data.responses).map(([questionId, answer]) => ({
            questionId,
            questionText: questionId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            questionType: 'text',
            answer,
            timestamp: new Date().toISOString()
          })),
          totalQuestions: Object.keys(data.responses).length,
          completionTime: 300, // 5 minutes average
          leadScore: data.complexity === 'complex' ? 9 : data.complexity === 'standard' ? 7 : 5,
          conversationPath: 'project_discovery'
        },
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          version: '2.0'
        }
      };

      const result = await sendProjectDataToN8n(projectPayload);
      return result.success;
    } catch (error) {
      console.error('Error sending project data:', error);
      return false;
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return {
    isAwaitingResponse,
    response,
    sendQAMessage,
    sendProjectData,
    clearResponse
  };
};