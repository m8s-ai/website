import React, { useState } from 'react';
import { Terminal } from './Terminal';
import { ConversationEngine } from './ConversationEngine'; // Import ConversationEngine
import { useAudioManager } from './AudioManager';

type BotMode = 'qa' | 'project';

interface TerminalExperienceProps {
  onComplete: () => void;
  isLoggedIn?: boolean;
  onBotModeSelect?: (mode: BotMode) => void; // New callback for bot mode selection
}

export const TerminalExperience: React.FC<TerminalExperienceProps> = ({ 
  onComplete, 
  isLoggedIn = false,
  onBotModeSelect
}) => {
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [showConversationEngine, setShowConversationEngine] = useState(false); // New state for ConversationEngine
  const [botMode, setBotMode] = useState<BotMode | null>(null); // Track selected bot mode
  const audio = useAudioManager({ isEnabled: true, volume: 0.2 });

  const handleTerminalComplete = async () => {
    await audio.playTransitionSound();
    
    // Start the transition sequence for ConversationEngine
    setTransitionMessage('Getting Aria ready to chat...');
    setShowTransition(true);
    
    setTimeout(() => {
      setTransitionMessage('Initializing bot selection...');
    }, 1500);

    setTimeout(() => {
      setTransitionMessage('Almost ready! Starting conversation...');
    }, 3000);

    setTimeout(() => {
      setShowConversationEngine(true); // Show ConversationEngine after transition
      setShowTransition(false); // Hide transition screen
    }, 4500);
  };

  // Handle bot mode selection from ConversationEngine
  const handleBotModeSelection = (mode: BotMode) => {
    setBotMode(mode);
    if (onBotModeSelect) {
      onBotModeSelect(mode);
    }
    
    // Update transition message based on bot mode
    if (mode === 'qa') {
      setTransitionMessage('Connecting to business expert bot...');
    } else {
      setTransitionMessage('Preparing project discovery session...');
    }
  };

  // Don't show terminal for logged-in users (they see the main site with launch button)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="relative" dir="ltr">
      {!showTransition && !showConversationEngine ? ( // Render Terminal if no transition and no ConversationEngine
        <Terminal onComplete={handleTerminalComplete} />
      ) : showTransition ? (
        /* Transition screen */
        <div className="fixed inset-0 bg-black text-green-400 font-mono flex items-center justify-center" dir="ltr">
          <div className="text-center">
            <div className="text-lg md:text-xl mb-2 md:mb-4 retro-glow-amber">
              {transitionMessage}
            </div>
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse retro-glow-green"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div dir="ltr">
          <ConversationEngine 
            onComplete={onComplete} 
            initialBotMode={botMode || 'qa'}
            onBotModeSelect={handleBotModeSelection}
          />
        </div>
      )}
    </div>
  );
};