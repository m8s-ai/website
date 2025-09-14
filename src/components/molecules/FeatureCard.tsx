import React, { memo } from 'react';
import { Container, Typography, Bullet } from '@/components/atoms';

export interface FeatureCardProps {
  title: string;
  description: string;
  subtitle?: string;
  features: string[];
  benefit?: string;
  color?: 'emerald' | 'cyan' | 'purple' | 'amber';
  className?: string;
}

const FeatureCard = memo<FeatureCardProps>(({
  title,
  description,
  subtitle,
  features,
  benefit,
  color = 'emerald',
  className = ''
}) => {
  const borderColors = {
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40',
    purple: 'border-purple-500/20 hover:border-purple-500/40',
    amber: 'border-amber-500/20 hover:border-amber-500/40'
  };

  const gradientColors = {
    emerald: 'from-emerald-900/30',
    cyan: 'from-cyan-900/30',
    purple: 'from-purple-900/30',
    amber: 'from-amber-900/30'
  };

  return (
    <Container
      background="glass"
      border
      rounded="2xl"
      padding="lg"
      className={`
        bg-gradient-to-br ${gradientColors[color]} to-gray-900/30
        border ${borderColors[color]}
        backdrop-blur-sm transition-all duration-300 ${className}
      `}
    >
      <div className="space-y-4">
        <Typography variant="h4" color="primary">
          {title}
        </Typography>
        
        <Typography variant="body" color="gray">
          {description}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="muted">
            {subtitle}
          </Typography>
        )}

        {features.length > 0 && (
          <div className="space-y-3 mt-6">
            {features.map((feature, index) => (
              <Bullet key={index} color={color} size="sm">
                {feature}
              </Bullet>
            ))}
          </div>
        )}

        {benefit && (
          <Typography variant="caption" color="primary" className="mt-6 block">
            {benefit}
          </Typography>
        )}
      </div>
    </Container>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;