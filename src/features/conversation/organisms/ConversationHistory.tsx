import React from 'react';
import { ChatMessage } from '../molecules/ChatMessage';
import { LoadingDots } from '../atoms/LoadingDots';

export interface ConversationMessage {
  role: 'bot' | 'user';
  text: string;
  timestamp?: Date;
}

export interface ConversationHistoryProps {
  messages: ConversationMessage[];
  isLoading?: boolean;
  loadingMessage?: string;
  className?: string;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  isLoading = false,
  loadingMessage = 'AI is thinking...',
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`} dir="ltr">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.text}
          timestamp={message.timestamp}
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start mb-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
            <LoadingDots message={loadingMessage} />
          </div>
        </div>
      )}
    </div>
  );
};