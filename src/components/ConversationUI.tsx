import React, { useState, useEffect, useRef } from 'react';
import type { Question, N8nWebhookResponse, BotMode } from '@/types/conversation';

interface ConversationUIProps {
  currentQuestion: Question | null;
  botMode: BotMode;
  userInput: string;
  selectedOption: number;
  isGenerating: boolean;
  validationMessage: string;
  n8nResponse: N8nWebhookResponse | null;
  conversationHistory: Array<{role: 'user' | 'bot', content: string}>;
  suggestedQuestions: string[];
  onInputChange: (value: string) => void;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  onSuggestedQuestionClick: (question: string) => void;
  onModeSwitch: (mode: BotMode) => void;
}

export const ConversationUI: React.FC<ConversationUIProps> = ({
  currentQuestion,
  botMode,
  userInput,
  selectedOption,
  isGenerating,
  validationMessage,
  n8nResponse,
  conversationHistory,
  suggestedQuestions,
  onInputChange,
  onOptionSelect,
  onSubmit,
  onSuggestedQuestionClick,
  onModeSwitch
}) => {
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input when question changes
  useEffect(() => {
    if (currentQuestion?.type === 'text') {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        } else if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [currentQuestion]);

  // Handle keyboard navigation for multiple choice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentQuestion?.type === 'multiple-choice') {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          onOptionSelect(selectedOption > 0 ? selectedOption - 1 : (currentQuestion.options?.length ?? 0) - 1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          onOptionSelect(selectedOption < (currentQuestion.options?.length ?? 0) - 1 ? selectedOption + 1 : 0);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, selectedOption, onOptionSelect, onSubmit]);

  const renderBotMessage = (content: string) => (
    <div className="flex items-start space-x-3 mb-6">
      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        AI
      </div>
      <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );

  const renderUserMessage = (content: string) => (
    <div className="flex items-start space-x-3 mb-6 justify-end">
      <div className="flex-1 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-lg p-4 border border-emerald-500/30 max-w-md ml-auto">
        <p className="text-gray-200 leading-relaxed">{content}</p>
      </div>
      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        U
      </div>
    </div>
  );

  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <div className="space-y-6">
        {renderBotMessage(currentQuestion.text)}
        
        {currentQuestion.type === 'multiple-choice' && (
          <div className="space-y-3 ml-11">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionSelect(index)}
                className={`block w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  selectedOption === index
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-gray-800/30 border-gray-600 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/10'
                }`}
              >
                <span className="font-mono text-emerald-400 mr-3">{String.fromCharCode(65 + index)})</span>
                {option}
              </button>
            ))}
            
            <button
              onClick={onSubmit}
              disabled={isGenerating}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Processing...' : 'Continue →'}
            </button>
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <div className="ml-11 space-y-4">
            {currentQuestion.id === 'project_idea' || currentQuestion.id === 'business_problem' || currentQuestion.id === 'success_criteria' ? (
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                placeholder="Type your detailed response here..."
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 resize-none"
                rows={4}
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                placeholder={currentQuestion.id === 'email' ? 'your@email.com' : 'Type your answer...'}
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200"
              />
            )}
            
            {validationMessage && (
              <p className="text-red-400 text-sm">{validationMessage}</p>
            )}
            
            <button
              onClick={onSubmit}
              disabled={isGenerating || !userInput.trim()}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Processing...' : 'Send →'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-gray-700/50 pb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onModeSwitch('qa')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              botMode === 'qa'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10'
            }`}
          >
            🧠 Business Q&A
          </button>
          <button
            onClick={() => onModeSwitch('project')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              botMode === 'project'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            🚀 Project Discovery
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {botMode === 'qa' ? 'Ask anything about m8s' : 'Intelligent project analysis'}
        </div>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="space-y-4">
          {conversationHistory.map((exchange, index) => (
            <div key={index}>
              {exchange.role === 'bot' && renderBotMessage(exchange.content)}
              {exchange.role === 'user' && renderUserMessage(exchange.content)}
            </div>
          ))}
        </div>
      )}

      {/* N8N Response */}
      {n8nResponse && botMode === 'qa' && (
        <div className="space-y-4">
          {renderBotMessage(n8nResponse.text)}
          
          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && (
            <div className="ml-11 space-y-2">
              <p className="text-sm text-gray-400">You might also ask:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestedQuestionClick(question)}
                  className="block w-full text-left p-3 bg-gray-800/30 border border-gray-600 rounded-lg text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200 text-sm"
                >
                  💡 {question}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Question */}
      {botMode === 'project' && renderCurrentQuestion()}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center space-x-3 ml-11">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-gray-400 text-sm">AI is thinking...</span>
        </div>
      )}

      {/* Terminal Cursor */}
      {!isGenerating && botMode === 'qa' && !n8nResponse && (
        <div className="flex items-center ml-11">
          <span className="text-emerald-400 mr-2">></span>
          <div className={`w-2 h-4 bg-emerald-400 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
        </div>
      )}
    </div>
  );
};