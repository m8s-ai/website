import React from 'react';
import { MultipleChoiceQuestion } from '../molecules/MultipleChoiceQuestion';
import { TextInputQuestion } from '../molecules/TextInputQuestion';
import { Button } from '../atoms/Button';

export interface QuestionData {
  type: 'multiple_choice' | 'text_input';
  text: string;
  options?: string[];
  questionId?: string;
  isMultiline?: boolean;
  placeholder?: string;
}

export interface QuestionInterfaceProps {
  question: QuestionData | null;
  userInput: string;
  selectedOption: number;
  suggestedQuestions: string[];
  isLoading: boolean;
  error?: string;
  onUserInputChange: (value: string) => void;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  onSuggestedQuestionSelect: (question: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}

export const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
  question,
  userInput,
  selectedOption,
  suggestedQuestions,
  isLoading,
  error,
  onUserInputChange,
  onOptionSelect,
  onSubmit,
  onSuggestedQuestionSelect,
  onKeyDown,
  className = ''
}) => {
  // If we have a structured question, render the appropriate interface
  if (question) {
    if (question.type === 'multiple_choice' && question.options) {
      return (
        <div className={className} dir="ltr">
          <MultipleChoiceQuestion
            options={question.options}
            selectedOption={selectedOption}
            onOptionSelect={onOptionSelect}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      );
    }

    if (question.type === 'text_input') {
      return (
        <div className={className} dir="ltr">
          <TextInputQuestion
            value={userInput}
            onChange={onUserInputChange}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
            placeholder={question.placeholder}
            isMultiline={question.isMultiline}
            error={error}
            isLoading={isLoading}
            questionId={question.questionId}
          />
        </div>
      );
    }
  }

  // Default: Free-form text input with suggested questions
  return (
    <div className={`space-y-4 ${className}`} dir="ltr">
      <TextInputQuestion
        value={userInput}
        onChange={onUserInputChange}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
        error={error}
        isLoading={isLoading}
      />
      
      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400 text-left">
            Suggested questions:
          </div>
          <div className="space-y-2">
            {suggestedQuestions.map((suggestedQuestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSuggestedQuestionSelect(suggestedQuestion)}
                className="w-full text-left justify-start text-sm py-2"
                disabled={isLoading}
              >
                {suggestedQuestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};