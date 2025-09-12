import React from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export interface TextInputQuestionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  isMultiline?: boolean;
  error?: string;
  isLoading?: boolean;
  questionId?: string;
  className?: string;
}

export const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = 'Type your answer...',
  isMultiline = false,
  error,
  isLoading = false,
  questionId,
  className = ''
}) => {
  // Determine if this should be a multiline input based on question type
  const shouldBeMultiline = isMultiline || 
    questionId === 'project_idea' || 
    questionId === 'business_problem' || 
    questionId === 'success_criteria';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (shouldBeMultiline) {
      // For multiline, submit with Ctrl/Cmd + Enter
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSubmit();
      }
    } else {
      // For single line, submit with Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    }
    
    onKeyDown?.(e);
  };

  const getPlaceholder = () => {
    if (questionId === 'email') return 'your@email.com';
    if (shouldBeMultiline) return 'Type your detailed response here...';
    return placeholder;
  };

  return (
    <div className={`space-y-4 ${className}`} dir="ltr">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        isMultiline={shouldBeMultiline}
        error={error}
        rows={shouldBeMultiline ? 4 : undefined}
      />
      
      <Button
        onClick={onSubmit}
        disabled={!value.trim()}
        isLoading={isLoading}
      >
        {isLoading ? 'Processing...' : 'Send →'}
      </Button>
    </div>
  );
};