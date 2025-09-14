import React, { memo } from 'react';
import { Typography, Container } from '@/components/atoms';

export interface StepCardProps {
  number: number;
  title: string;
  description: string;
  color?: 'emerald' | 'cyan' | 'purple';
  className?: string;
}

const StepCard = memo<StepCardProps>(({
  number,
  title,
  description,
  color = 'emerald',
  className = ''
}) => {
  const colorGradients = {
    emerald: 'from-emerald-500 to-cyan-500',
    cyan: 'from-cyan-500 to-purple-500',
    purple: 'from-purple-500 to-emerald-500'
  };

  const textColors = {
    emerald: 'text-emerald-300',
    cyan: 'text-cyan-300',
    purple: 'text-purple-300'
  };

  return (
    <div className={`text-center ${className}`}>
      <Container
        className={`
          w-16 h-16 bg-gradient-to-r ${colorGradients[color]}
          rounded-full flex items-center justify-center mx-auto mb-4
        `}
      >
        <Typography variant="h3" color="white" className="font-bold">
          {number}
        </Typography>
      </Container>
      
      <Typography variant="h4" className={`${textColors[color]} mb-2`}>
        {title}
      </Typography>
      
      <Typography variant="caption" color="gray">
        {description}
      </Typography>
    </div>
  );
});

StepCard.displayName = 'StepCard';

export default StepCard;