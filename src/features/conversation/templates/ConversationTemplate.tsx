import React, { useCallback } from 'react';
import { ConversationHeader } from '../organisms/ConversationHeader';
import { ConversationHistory } from '../organisms/ConversationHistory';
import { QuestionInterface } from '../organisms/QuestionInterface';
import { useConversationState } from '../hooks/useConversationState';
import { useBotStrategy } from '../hooks/useBotStrategy';
import type { BotMode } from '../organisms/ConversationHeader';

export interface ConversationTemplateProps {
  initialBotMode?: BotMode;
  onComplete?: (data?: any) => void;
  onHome?: () => void;
  onClose?: () => void;
  className?: string;
  canSwitchMode?: boolean;
}

export const ConversationTemplate: React.FC<ConversationTemplateProps> = ({
  initialBotMode = 'qa',
  onComplete,
  onHome,
  onClose,
  className = '',
  canSwitchMode = true
}) => {
  const [state, actions] = useConversationState(initialBotMode);
  const { handleUserInput, handleOptionSelect, switchBotMode } = useBotStrategy({
    state,
    actions,
    onComplete
  });

  // Header props
  const getHeaderTitle = () => {
    switch (state.currentMode) {
      case 'project':
        return 'ARIA - Project Discovery';
      case 'qa':
        return 'ARIA - Q&A Assistant';
      default:
        return 'ARIA';
    }
  };

  const getHeaderSubtitle = () => {
    switch (state.currentMode) {
      case 'project':
        if (state.projectState) {
          return `Wave ${state.projectState.currentWave} of 4 - Project Validation`;
        }
        return 'Let\'s validate your project idea together';
      case 'qa':
        return 'Ask me anything about our services and capabilities';
      default:
        return '';
    }
  };

  // Input handlers
  const handleSubmit = useCallback(() => {
    if (state.currentQuestion?.type === 'multiple_choice') {
      handleOptionSelect();
    } else if (state.userInput.trim()) {
      handleUserInput(state.userInput);
    }
  }, [state.currentQuestion, state.userInput, handleUserInput, handleOptionSelect]);

  const handleSuggestedQuestionSelect = useCallback((question: string) => {
    handleUserInput(question);
  }, [handleUserInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className={`flex flex-col h-full bg-black/95 text-white ${className}`} dir="ltr">
      {/* Header */}
      <ConversationHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        currentMode={state.currentMode}
        canSwitchMode={canSwitchMode}
        onModeSwitch={switchBotMode}
        onHome={onHome}
        onClose={onClose}
      />

      {/* Conversation Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <ConversationHistory
            messages={state.conversationHistory}
            isLoading={state.isLoading}
            loadingMessage="ARIA is processing..."
          />
        </div>

        {/* Input Interface */}
        <div className="border-t border-gray-700/50 p-6 bg-gray-900/30">
          <QuestionInterface
            question={state.currentQuestion}
            userInput={state.userInput}
            selectedOption={state.selectedOption}
            suggestedQuestions={state.suggestedQuestions}
            isLoading={state.isLoading}
            error={state.error}
            onUserInputChange={actions.setUserInput}
            onOptionSelect={actions.setSelectedOption}
            onSubmit={handleSubmit}
            onSuggestedQuestionSelect={handleSuggestedQuestionSelect}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};