import React, { memo, useState } from 'react';
import { Container, Typography } from '@/components/atoms';

export interface FAQItemProps {
  question: string;
  answer: string;
  color?: 'emerald' | 'cyan' | 'purple';
  defaultOpen?: boolean;
  className?: string;
}

const FAQItem = memo<FAQItemProps>(({
  question,
  answer,
  color = 'emerald',
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorStyles = {
    emerald: {
      text: 'text-emerald-300',
      border: 'border-emerald-400 text-emerald-400'
    },
    cyan: {
      text: 'text-cyan-300', 
      border: 'border-cyan-400 text-cyan-400'
    },
    purple: {
      text: 'text-purple-300',
      border: 'border-purple-400 text-purple-400'
    }
  };

  return (
    <Container
      background="glass"
      border
      rounded="2xl"
      className={`backdrop-blur-sm overflow-hidden ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/20 transition-colors duration-200"
      >
        <Typography variant="h4" className={`${colorStyles[color].text} pr-4 flex-1`}>
          {question}
        </Typography>
        
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center 
          transition-all duration-200 ${colorStyles[color].border}
          ${isOpen ? 'rotate-45' : ''}
        `}>
          <span className="text-lg font-bold">+</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
          <Typography variant="body" color="gray" className="leading-relaxed">
            {answer}
          </Typography>
        </div>
      )}
    </Container>
  );
});

FAQItem.displayName = 'FAQItem';

export default FAQItem;