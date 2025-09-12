import React from 'react';
import { BotStrategyFactory } from '@/strategies/BotStrategyFactory';
import type { BotMode } from '@/types/conversation';

interface BotModeSelectorProps {
  onModeSelect: (mode: BotMode) => void;
}

export const BotModeSelector: React.FC<BotModeSelectorProps> = ({ onModeSelect }) => {
  const qaBotInfo = BotStrategyFactory.getBotInfo('qa');
  const projectBotInfo = BotStrategyFactory.getBotInfo('project');

  const botModes: Array<{
    mode: BotMode;
    info: { name: string; description: string; icon: string };
    gradientClasses: string;
    borderClasses: string;
    textClasses: string;
    tagText: string;
  }> = [
    {
      mode: 'qa',
      info: qaBotInfo,
      gradientClasses: 'from-cyan-900/30 to-blue-900/30',
      borderClasses: 'border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-cyan-500/10',
      textClasses: 'text-cyan-300',
      tagText: 'POWERED BY AI KNOWLEDGE BASE'
    },
    {
      mode: 'project',
      info: projectBotInfo,
      gradientClasses: 'from-emerald-900/30 to-green-900/30',
      borderClasses: 'border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-emerald-500/10',
      textClasses: 'text-emerald-300',
      tagText: 'INTELLIGENT PROJECT ANALYSIS'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Choose Your AI Assistant
        </h2>
        
        <p className="text-gray-400 text-lg mb-12">
          Select how you'd like to interact with our AI system today
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {botModes.map(({ mode, info, gradientClasses, borderClasses, textClasses, tagText }) => (
            <div 
              key={mode}
              className={`bg-gradient-to-br ${gradientClasses} border ${borderClasses} rounded-xl p-8 cursor-pointer hover:shadow-lg transition-all duration-300 group`}
              onClick={() => onModeSelect(mode)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onModeSelect(mode);
                }
              }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {info.icon}
              </div>
              <h3 className={`text-xl font-semibold ${textClasses} mb-4`}>
                {info.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {info.description}
              </p>
              <div className="mt-6 pt-4 border-t border-gray-500/20">
                <div className={`text-xs ${textClasses} font-mono`}>
                  {tagText}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          You can switch between modes at any time during the conversation
        </div>
      </div>
    </div>
  );
};