import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const Button = memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  loading = false
}) => {
  const { isRTL } = useLanguage();

  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 focus:ring-emerald-500',
    secondary: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 focus:ring-cyan-500',
    outline: 'border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black focus:ring-emerald-500',
    ghost: 'text-emerald-400 hover:bg-emerald-400/10 focus:ring-emerald-500'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none' : '';

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClassName}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;