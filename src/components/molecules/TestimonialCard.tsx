import React, { memo } from 'react';
import { Container, Typography, Avatar } from '@/components/atoms';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  description: string;
  result: string;
  avatarSrc?: string;
  color?: 'emerald' | 'cyan' | 'purple';
  className?: string;
}

const TestimonialCard = memo<TestimonialCardProps>(({
  name,
  role,
  company,
  description,
  result,
  avatarSrc,
  color = 'emerald',
  className = ''
}) => {
  const { isRTL } = useLanguage();

  const borderColors = {
    emerald: 'border-emerald-500/20',
    cyan: 'border-cyan-500/20',
    purple: 'border-purple-500/20'
  };

  const gradientColors = {
    emerald: 'from-emerald-900/20',
    cyan: 'from-cyan-900/20',
    purple: 'from-purple-900/20'
  };

  const textColors = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Container
      background="glass"
      border
      rounded="2xl"
      className={`
        bg-gradient-to-br ${gradientColors[color]} to-gray-900/20
        border ${borderColors[color]} backdrop-blur-sm
        flex flex-col h-full ${className}
      `}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-6">
          {/* Text content */}
          <div className={`${isRTL ? 'text-right order-2' : 'text-left order-1'} min-w-0 flex-1`}>
            <Typography variant="h5" color="white" className="font-semibold leading-tight">
              {company}
            </Typography>
            <Typography variant="caption" color="muted" className="mt-1">
              {role}
            </Typography>
          </div>
          
          {/* Avatar */}
          <Avatar
            src={avatarSrc}
            alt={name}
            fallback={getInitials(name)}
            color={color}
            className={isRTL ? 'order-1' : 'order-2'}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <Typography
            variant="caption"
            color="gray"
            className={`mb-6 leading-relaxed flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {description}
          </Typography>
          
          <Typography
            variant="caption"
            className={`${textColors[color]} font-medium ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {result}
          </Typography>
        </div>
      </div>
    </Container>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;