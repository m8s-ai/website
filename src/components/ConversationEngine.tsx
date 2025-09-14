import React, { useEffect } from 'react';
import { analyticsManager } from '@/utils/analyticsManager';

interface ConversationEngineProps {
  onComplete?: () => void;
  initialBotMode?: 'qa' | 'project';
  onBotModeSelect?: (mode: 'qa' | 'project') => void;
}

export const ConversationEngine: React.FC<ConversationEngineProps> = ({ 
  onComplete, 
  initialBotMode = 'project'
}) => {
  // Initialize analytics
  useEffect(() => {
    analyticsManager.startConversation('initial');
  }, []);

  // Auto-complete after a short delay for now
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-black border border-gray-600 rounded-lg shadow-2xl h-[80vh] flex items-center justify-center">
        <div className="text-center text-green-400 font-mono">
          <div className="text-xl mb-4">ConversationEngine</div>
          <div className="text-sm text-gray-400 mb-4">Temporary placeholder - ready for refactor</div>
          <div className="text-xs text-gray-500">Mode: {initialBotMode}</div>
        </div>
      </div>
    </div>
  );
};