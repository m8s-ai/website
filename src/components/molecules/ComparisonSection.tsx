import React, { memo } from 'react';
import { Container, Typography, Bullet } from '@/components/atoms';

export interface ComparisonItem {
  text: string;
}

export interface ComparisonSectionProps {
  title: string;
  subtitle: string;
  leftTitle: string;
  rightTitle: string;
  leftItems: ComparisonItem[];
  rightItems: ComparisonItem[];
  leftColor?: 'red' | 'amber';
  rightColor?: 'emerald' | 'cyan';
  className?: string;
}

const ComparisonSection = memo<ComparisonSectionProps>(({
  title,
  subtitle,
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  leftColor = 'red',
  rightColor = 'emerald',
  className = ''
}) => {
  return (
    <Container size="lg" margin="auto" className={className}>
      <Container
        background="glass"
        border
        rounded="2xl"
        padding="lg"
        className="bg-gradient-to-br from-red-900/20 to-gray-900/20 border-red-500/20 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <Typography variant="h2" color="error" className="mb-4">
            {title}
          </Typography>
          <Typography variant="h5" color="gray">
            {subtitle}
          </Typography>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Typography variant="h4" color={leftColor === 'red' ? 'error' : 'warning'} className="mb-4">
              {leftTitle}
            </Typography>
            <div className="space-y-3">
              {leftItems.map((item, index) => (
                <Bullet key={index} color={leftColor} size="sm">
                  {item.text}
                </Bullet>
              ))}
            </div>
          </div>
          
          <div>
            <Typography variant="h4" color="primary" className="mb-4">
              {rightTitle}
            </Typography>
            <div className="space-y-3">
              {rightItems.map((item, index) => (
                <Bullet key={index} color={rightColor} size="sm">
                  {item.text}
                </Bullet>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Container>
  );
});

ComparisonSection.displayName = 'ComparisonSection';

export default ComparisonSection;