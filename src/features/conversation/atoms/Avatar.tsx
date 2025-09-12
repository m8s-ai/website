import React from 'react';

export interface AvatarProps {
  type: 'bot' | 'user';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-10 h-10'
};

export const Avatar: React.FC<AvatarProps> = ({ 
  type, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClass = sizes[size];
  
  if (type === 'bot') {
    return (
      <div className={`${sizeClass} bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${className}`}>
        AI
      </div>
    );
  }

  return (
    <div className={`${sizeClass} bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${className}`}>
      U
    </div>
  );
};