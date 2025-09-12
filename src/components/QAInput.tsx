import React, { useState, useRef, useEffect } from 'react';

interface QAInputProps {
  onSubmit: (question: string) => void;
  isGenerating: boolean;
  suggestedQuestions: string[];
  onSuggestedQuestionClick: (question: string) => void;
}

export const QAInput: React.FC<QAInputProps> = ({
  onSubmit,
  isGenerating,
  suggestedQuestions,
  onSuggestedQuestionClick
}) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !isGenerating) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const handleSubmit = () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput && !isGenerating) {
      onSubmit(trimmedInput);
      setUserInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedClick = (question: string) => {
    onSuggestedQuestionClick(question);
    setUserInput('');
  };

  return (
    <div className="space-y-4" dir="ltr">
      {/* Input Section - Always LTR */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          U
        </div>
        <div className="flex-1 flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about m8s, our services, or how we can help..."
            className="flex-1 p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-left"
            disabled={isGenerating}
            dir="ltr"
          />
          <button
            onClick={handleSubmit}
            disabled={isGenerating || !userInput.trim()}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Sending...' : 'Ask'}
          </button>
        </div>
      </div>

      {/* Suggested Questions - Always LTR */}
      {suggestedQuestions.length > 0 && !isGenerating && (
        <div className="ml-11 space-y-2" dir="ltr">
          <p className="text-sm text-gray-400">Popular questions:</p>
          <div className="grid gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedClick(question)}
                className="text-left p-3 bg-gray-800/30 border border-gray-600 rounded-lg text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200 text-sm"
                dir="ltr"
              >
                💡 {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Suggestions - Always LTR */}
      {suggestedQuestions.length === 0 && !isGenerating && (
        <div className="ml-11 space-y-2" dir="ltr">
          <p className="text-sm text-gray-400">Try asking about:</p>
          <div className="grid gap-2">
            {[
              "What services does m8s offer?",
              "How does your project validation process work?",
              "What technologies do you specialize in?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedClick(question)}
                className="text-left p-3 bg-gray-800/30 border border-gray-600 rounded-lg text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200 text-sm"
                dir="ltr"
              >
                💡 {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};