import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface BulletProps {
  color?: 'emerald' | 'cyan' | 'purple' | 'red' | 'amber' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Bullet = memo<BulletProps>(({
  color = 'emerald',
  size = 'md',
  children,
  className = ''
}) => {
  const { isRTL } = useLanguage();

  const colorClasses = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    red: 'bg-red-400',
    amber: 'bg-amber-400',
    gray: 'bg-gray-400'
  };

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const marginClasses = isRTL ? 'ml-3' : 'mr-3';
  const alignmentClasses = size === 'sm' ? 'mt-1.5' : 'mt-2';

  return (
    <div className={`flex items-start ${className}`}>
      <div className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${marginClasses}
        ${alignmentClasses}
        rounded-full flex-shrink-0
      `} />
      <span className="text-gray-300 flex-1">
        {children}
      </span>
    </div>
  );
});

Bullet.displayName = 'Bullet';

export default Bullet;