import React from 'react';

interface WhiteRobotIconProps {
  className?: string;
  size?: number;
  color?: 'white' | 'black' | 'primary';
}

export const WhiteRobotIcon: React.FC<WhiteRobotIconProps> = ({ 
  className = "", 
  size = 24,
  color = 'white'
}) => {
  const getFilterStyle = (color: string) => {
    switch (color) {
      case 'white':
        return 'brightness(0) saturate(100%) invert(100%)';
      case 'black':
        return 'none';
      case 'primary':
        return 'brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(2000%) hue-rotate(260deg) brightness(1.2)';
      default:
        return 'brightness(0) saturate(100%) invert(100%)';
    }
  };

  return (
    <img 
      src="/favicon.ico" 
      alt="Robot Icon" 
      className={`inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: getFilterStyle(color),
        transition: 'filter 0.3s ease',
      }}
    />
  );
};