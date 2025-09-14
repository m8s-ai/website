import React, { memo } from 'react';

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'transparent' | 'glass' | 'solid' | 'gradient';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  children: React.ReactNode;
  className?: string;
  centerContent?: boolean;
}

const Container = memo<ContainerProps>(({
  size = 'full',
  background = 'transparent',
  border = false,
  rounded = 'none',
  padding = 'none',
  margin = 'none',
  children,
  className = '',
  centerContent = false
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full'
  };

  const backgroundClasses = {
    transparent: '',
    glass: 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm',
    solid: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-emerald-900/30 to-cyan-900/30'
  };

  const borderClasses = border ? 'border border-gray-700/50' : '';

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const marginClasses = {
    none: '',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-12',
    auto: 'mx-auto'
  };

  const centerClasses = centerContent ? 'flex items-center justify-center' : '';

  const finalClassName = `
    ${sizeClasses[size]}
    ${backgroundClasses[background]}
    ${borderClasses}
    ${roundedClasses[rounded]}
    ${paddingClasses[padding]}
    ${marginClasses[margin]}
    ${centerClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;