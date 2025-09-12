import { useCallback, useRef, useEffect } from 'react';
import type { BotMode } from '../organisms/ConversationHeader';
import type { ConversationActions, ConversationState } from './useConversationState';
import { BotStrategyFactory } from '../../../strategies/BotStrategyFactory';
import { BaseBotStrategy } from '../../../strategies/BaseBotStrategy';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { useConversationAnalysis } from '@/hooks/useConversationAnalysis';
import { useAudioManager } from '@/components/AudioManager';

export interface UseBotStrategyProps {
  state: ConversationState;
  actions: ConversationActions;
  onComplete?: (data?: any) => void;
}

export const useBotStrategy = ({ state, actions, onComplete }: UseBotStrategyProps) => {
  const currentStrategyRef = useRef<BaseBotStrategy | null>(null);
  const n8nWebhook = useN8nWebhook();
  const conversationAnalysis = useConversationAnalysis();
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });

  // Strategy state update callback
  const handleStrategyStateUpdate = useCallback((strategyState: any) => {
    // Update conversation state based on strategy state changes
    if (strategyState.conversationHistory) {
      // The strategy handles its own history, we just need to sync it
      actions.addToConversationHistory('bot', strategyState.conversationHistory[strategyState.conversationHistory.length - 1]?.text || '');
    }
    if (strategyState.currentQuestion !== undefined) {
      actions.setCurrentQuestion(strategyState.currentQuestion);
    }
    if (strategyState.suggestedQuestions) {
      actions.setSuggestedQuestions(strategyState.suggestedQuestions);
    }
    if (strategyState.isLoading !== undefined) {
      actions.setIsLoading(strategyState.isLoading);
    }
    if (strategyState.error) {
      actions.setError(strategyState.error);
    }
    if (strategyState.projectState) {
      actions.setProjectState(strategyState.projectState);
    }
  }, [actions]);

  // Initialize bot strategy
  const initializeBotStrategy = useCallback(async (mode: BotMode) => {
    try {
      actions.setIsLoading(true);
      actions.setError('');

      // Clean up previous strategy
      if (currentStrategyRef.current) {
        currentStrategyRef.current = null;
      }

      // Create new strategy
      const strategy = BotStrategyFactory.createStrategy(
        mode,
        {
          audio,
          onComplete: onComplete || (() => {}),
          conversationId: state.conversationId
        },
        {
          n8nWebhook,
          conversationAnalysis
        }
      );

      // Set up state update callback
      strategy.setStateUpdateCallback(handleStrategyStateUpdate);

      currentStrategyRef.current = strategy;
      actions.setCurrentMode(mode);

      // Initialize the strategy
      await strategy.initialize();

    } catch (error) {
      console.error('Failed to initialize bot strategy:', error);
      actions.setError('Failed to initialize conversation. Please try again.');
    } finally {
      actions.setIsLoading(false);
    }
  }, [state.conversationId, handleStrategyStateUpdate, onComplete, actions, n8nWebhook, conversationAnalysis, audio]);

  // Handle user input
  const handleUserInput = useCallback(async (input: string) => {
    if (!currentStrategyRef.current || !input.trim()) return;

    try {
      actions.setIsLoading(true);
      actions.setError('');

      // Add user message to history
      actions.addToConversationHistory('user', input);

      // Clear input
      actions.setUserInput('');
      actions.setSelectedOption(0);

      // Process with current strategy
      await currentStrategyRef.current.handleUserInput(input);

    } catch (error) {
      console.error('Failed to process user input:', error);
      actions.setError('Failed to process your message. Please try again.');
    } finally {
      actions.setIsLoading(false);
    }
  }, [actions]);

  // Handle option selection
  const handleOptionSelect = useCallback(async () => {
    if (!currentStrategyRef.current || !state.currentQuestion?.options) return;

    const selectedOptionText = state.currentQuestion.options[state.selectedOption];
    if (!selectedOptionText) return;

    await handleUserInput(selectedOptionText);
  }, [state.currentQuestion, state.selectedOption, handleUserInput]);

  // Switch bot mode
  const switchBotMode = useCallback(async (newMode: BotMode) => {
    if (newMode === state.currentMode) return;

    actions.clearConversation();
    await initializeBotStrategy(newMode);
  }, [state.currentMode, actions, initializeBotStrategy]);

  // Auto-initialize if we have an initial mode but no strategy
  useEffect(() => {
    if (state.currentMode && !currentStrategyRef.current) {
      initializeBotStrategy(state.currentMode);
    }
  }, [state.currentMode, initializeBotStrategy]);

  return {
    currentStrategy: currentStrategyRef.current,
    initializeBotStrategy,
    handleUserInput,
    handleOptionSelect,
    switchBotMode
  };
};