import React, { memo } from 'react';

export interface IconProps {
  name: 'robot' | 'menu' | 'close' | 'chevron-down' | 'plus' | 'check' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Icon = memo<IconProps>(({
  name,
  size = 'md',
  color = 'currentColor',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const icons = {
    robot: (
      <svg className={`${sizeClasses[size]} ${className}`} fill={color} viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 012 2v1h3a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V8a3 3 0 013-3h3V4a2 2 0 012-2zM9 10a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm-3 4a3 3 0 00-3 3h6a3 3 0 00-3-3z"/>
      </svg>
    ),
    menu: (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    close: (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    'chevron-down': (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    plus: (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    check: (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    warning: (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke={color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return icons[name] || null;
});

Icon.displayName = 'Icon';

export default Icon;