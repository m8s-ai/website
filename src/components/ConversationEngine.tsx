import React, { useCallback, useEffect } from 'react';
import { analyticsManager } from '@/utils/analyticsManager';
import { BotModeSelector } from './BotModeSelector';
import { ConversationTemplate } from '@/features/conversation';
import type { BotMode, ConversationEngineProps } from '@/types/conversation';

export const ConversationEngine: React.FC<ConversationEngineProps> = ({ 
  onComplete, 
  initialBotMode, 
  onBotModeSelect 
}) => {
  // Initialize analytics
  useEffect(() => {
    analyticsManager.startConversation('initial');
  }, []);

  // Handle bot mode selection for legacy support
  const handleBotModeSelect = useCallback((mode: BotMode) => {
    if (onBotModeSelect) {
      onBotModeSelect(mode);
    }
    
    analyticsManager.trackTerminalEvent('bot_strategy_selected', {
      bot_mode: mode,
      conversation_id: 'conv_' + Date.now(),
      strategy_pattern: true
    });
  }, [onBotModeSelect]);

  // Show bot mode selector if no initial mode provided
  if (!initialBotMode) {
    return <BotModeSelector onModeSelect={handleBotModeSelect} />;
  }

  // Use the new atomic design template
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-black border border-gray-600 rounded-lg shadow-2xl h-[80vh]">
        <ConversationTemplate
          initialBotMode={initialBotMode}
          onComplete={onComplete}
          canSwitchMode={true}
          className="h-full"
        />
      </div>
    </div>
  );
};