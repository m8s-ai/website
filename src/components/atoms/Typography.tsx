import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white' | 'gray' | 'error' | 'warning' | 'success';
  gradient?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Typography = memo<TypographyProps>(({
  variant = 'body',
  color = 'white',
  gradient = false,
  align = 'left',
  children,
  className = '',
  as
}) => {
  const { isRTL } = useLanguage();

  const baseClasses = 'leading-relaxed';

  const variantClasses = {
    h1: 'text-4xl md:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-bold',
    h4: 'text-xl font-bold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    body: 'text-base',
    caption: 'text-sm',
    overline: 'text-xs uppercase tracking-wide font-medium'
  };

  const colorClasses = {
    primary: 'text-emerald-300',
    secondary: 'text-cyan-300',
    accent: 'text-purple-300',
    muted: 'text-gray-400',
    white: 'text-white',
    gray: 'text-gray-300',
    error: 'text-red-300',
    warning: 'text-amber-300',
    success: 'text-green-300'
  };

  const gradientClasses = gradient 
    ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent'
    : colorClasses[color];

  const alignClasses = {
    left: isRTL ? 'text-right' : 'text-left',
    center: 'text-center',
    right: isRTL ? 'text-left' : 'text-right',
    justify: 'text-justify'
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${gradientClasses} ${alignClasses[align]} ${className}`;

  // Determine the HTML element to use
  const Element = as || (variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p');

  return (
    <Element className={finalClassName} dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </Element>
  );
});

Typography.displayName = 'Typography';

export default Typography;