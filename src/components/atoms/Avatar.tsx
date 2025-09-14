import React, { memo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'cyan' | 'purple' | 'amber';
  className?: string;
}

const Avatar = memo<AvatarProps>(({
  src,
  alt,
  fallback,
  size = 'md',
  color = 'emerald',
  className = ''
}) => {
  const { isRTL } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 ring-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 ring-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-400 ring-amber-500/30'
  };

  const marginClasses = isRTL ? 'ml-3' : 'mr-3';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      ${marginClasses}
      rounded-full overflow-hidden ring-2 ${colorClasses[color]}
      flex-shrink-0 ${className}
    `}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className={`
          w-full h-full flex items-center justify-center font-bold
          ${colorClasses[color]}
        `}>
          {fallback}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;