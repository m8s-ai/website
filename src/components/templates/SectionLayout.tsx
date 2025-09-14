import React, { memo } from 'react';
import { Container } from '@/components/atoms';

export interface SectionLayoutProps {
  children: React.ReactNode;
  id?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SectionLayout = memo<SectionLayoutProps>(({
  children,
  id,
  spacing = 'lg',
  className = ''
}) => {
  const spacingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-16'
  };

  return (
    <section id={id} className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
});

SectionLayout.displayName = 'SectionLayout';

export default SectionLayout;