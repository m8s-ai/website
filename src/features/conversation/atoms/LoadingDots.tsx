import React from 'react';

export interface LoadingDotsProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'cyan' | 'blue';
}

const sizes = {
  sm: 'w-1 h-1',
  md: 'w-2 h-2',
  lg: 'w-3 h-3'
};

const colors = {
  emerald: 'bg-emerald-400',
  cyan: 'bg-cyan-400',
  blue: 'bg-blue-400'
};

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  message = 'AI is thinking...',
  size = 'md',
  color = 'emerald'
}) => {
  const sizeClass = sizes[size];
  const colorClass = colors[color];

  return (
    <div className="flex items-center space-x-3" dir="ltr">
      <div className="flex space-x-1">
        <div className={`${sizeClass} ${colorClass} rounded-full animate-bounce`}></div>
        <div 
          className={`${sizeClass} ${colorClass} rounded-full animate-bounce`} 
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div 
          className={`${sizeClass} ${colorClass} rounded-full animate-bounce`} 
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  );
};