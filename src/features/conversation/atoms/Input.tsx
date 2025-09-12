import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  isMultiline?: boolean;
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ error, isMultiline = false, rows = 4, className = '', ...props }, ref) => {
    const baseClasses = "w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-left";
    
    if (isMultiline) {
      return (
        <div className="space-y-2">
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            className={`${baseClasses} resize-none ${error ? 'border-red-500' : ''} ${className}`}
            rows={rows}
            dir="ltr"
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
          {error && (
            <p className="text-red-400 text-sm" dir="ltr">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          className={`${baseClasses} ${error ? 'border-red-500' : ''} ${className}`}
          dir="ltr"
          {...props}
        />
        {error && (
          <p className="text-red-400 text-sm" dir="ltr">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';