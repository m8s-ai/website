import React, { memo } from 'react';
import { Container } from '@/components/atoms';
import BackgroundEffects from './BackgroundEffects';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PageTemplateProps {
  children: React.ReactNode;
  className?: string;
}

const PageTemplate = memo<PageTemplateProps>(({
  children,
  className = ''
}) => {
  const { isRTL } = useLanguage();

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background effects */}
      <BackgroundEffects />
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

PageTemplate.displayName = 'PageTemplate';

export default PageTemplate;