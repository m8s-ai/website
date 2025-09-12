import React from 'react';
import { Button } from '../atoms/Button';

export interface MultipleChoiceQuestionProps {
  options: string[];
  selectedOption: number;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  className?: string;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  selectedOption,
  onOptionSelect,
  onSubmit,
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`} dir="ltr">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onOptionSelect(index)}
          className={`block w-full text-left p-4 rounded-lg border transition-all duration-200 ${
            selectedOption === index
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-gray-800/30 border-gray-600 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/10'
          }`}
          dir="ltr"
        >
          <span className="font-mono text-emerald-400 mr-3">
            {String.fromCharCode(65 + index)})
          </span>
          {option}
        </button>
      ))}
      
      <Button
        onClick={onSubmit}
        isLoading={isLoading}
        className="mt-4"
      >
        {isLoading ? 'Processing...' : 'Continue →'}
      </Button>
    </div>
  );
};