import React from 'react';
import { Avatar } from '../atoms/Avatar';

export interface ChatMessageProps {
  role: 'bot' | 'user';
  content: string;
  timestamp?: Date;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  className = ''
}) => {
  const isBot = role === 'bot';
  
  return (
    <div 
      className={`flex items-start space-x-3 mb-6 ${!isBot ? 'justify-end' : ''} ${className}`}
      dir="ltr"
    >
      {isBot && <Avatar type="bot" />}
      
      <div className={`flex-1 rounded-lg p-4 border ${
        isBot 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-emerald-500/30 max-w-md ml-auto'
      }`}>
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-left">
          {content}
        </p>
        {timestamp && (
          <div className="text-xs text-gray-500 mt-2">
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {!isBot && <Avatar type="user" />}
    </div>
  );
};