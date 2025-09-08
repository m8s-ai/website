import React, { useState } from 'react';
import { Terminal } from './Terminal';
import { ConversationEngine } from './ConversationEngine'; // Import ConversationEngine
import { useAudioManager } from './AudioManager';

interface TerminalExperienceProps {
  onComplete: () => void;
  isLoggedIn?: boolean;
}

export const TerminalExperience: React.FC<TerminalExperienceProps> = ({ 
  onComplete, 
  isLoggedIn = false
}) => {
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [showConversationEngine, setShowConversationEngine] = useState(false); // New state for ConversationEngine
  const audio = useAudioManager({ isEnabled: true, volume: 0.2 });

  const handleTerminalComplete = async () => {
    await audio.playTransitionSound();
    
    // Start the transition sequence for ConversationEngine
    setTransitionMessage('Loading AI Conversation Engine...');
    setShowTransition(true);
    
    setTimeout(() => {
      setTransitionMessage('Calibrating AI response models...');
    }, 1500);

    setTimeout(() => {
      setTransitionMessage('Engaging natural language interface...');
    }, 3000);

    setTimeout(() => {
      setShowConversationEngine(true); // Show ConversationEngine after transition
      setShowTransition(false); // Hide transition screen
    }, 4500);
  };

  // Don't show terminal for logged-in users (they see the main site with launch button)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="relative">
      {!showTransition && !showConversationEngine ? ( // Render Terminal if no transition and no ConversationEngine
        <Terminal onComplete={handleTerminalComplete} />
      ) : showTransition ? (
        /* Transition screen */
        <div className="fixed inset-0 bg-black text-green-400 font-mono flex items-center justify-center">
          <div className="text-center" dir="ltr">
            <div className="text-xl mb-4 text-amber-400">
              {transitionMessage}
            </div>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
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
        <ConversationEngine onComplete={onComplete} /> // Render ConversationEngine and pass onComplete
      )}
    </div>
  );
};