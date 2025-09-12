import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'option' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25',
  secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25',
  option: 'bg-gray-800/30 border border-gray-600 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/10',
  outline: 'border border-gray-500 text-gray-300 hover:bg-gray-700/50 hover:text-white',
  ghost: 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/10'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2',
  lg: 'px-8 py-3 text-lg'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const variantClass = variants[variant];
  const sizeClass = sizes[size];
  
  return (
    <button
      className={`${variantClass} ${sizeClass} rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin mr-2">⏳</span>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};