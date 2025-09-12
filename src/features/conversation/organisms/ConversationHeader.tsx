import React from 'react';
import { Button } from '../atoms/Button';

export type BotMode = 'qa' | 'project';

export interface ConversationHeaderProps {
  title: string;
  subtitle?: string;
  currentMode?: BotMode;
  canSwitchMode?: boolean;
  onModeSwitch?: (mode: BotMode) => void;
  onHome?: () => void;
  onClose?: () => void;
  className?: string;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  title,
  subtitle,
  currentMode,
  canSwitchMode = false,
  onModeSwitch,
  onHome,
  onClose,
  className = ''
}) => {
  return (
    <div className={`border-b border-gray-700/50 p-4 bg-gray-800/30 ${className}`} dir="ltr">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-emerald-400 text-left">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1 text-left">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          {canSwitchMode && onModeSwitch && (
            <div className="flex bg-gray-700/50 rounded-lg p-1">
              <Button
                variant={currentMode === 'qa' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onModeSwitch('qa')}
                className="px-3 py-1 text-xs"
              >
                Q&A
              </Button>
              <Button
                variant={currentMode === 'project' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onModeSwitch('project')}
                className="px-3 py-1 text-xs"
              >
                Project
              </Button>
            </div>
          )}
          
          {/* Home Button */}
          {onHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="text-gray-400 hover:text-emerald-400"
            >
              Home
            </Button>
          )}
          
          {/* Close Button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-red-400"
            >
              ✕
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};