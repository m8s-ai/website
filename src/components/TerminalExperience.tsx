import React, { useState } from 'react';
import { Terminal } from './Terminal';
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
  const audio = useAudioManager({ isEnabled: true, volume: 0.2 });

  const handleTerminalComplete = async () => {
    // Play transition sound
    await audio.playTransitionSound();
    
    // Start the transition sequence
    setTransitionMessage('Generating your complete project package...');
    setShowTransition(true);
    
    // Simulate transition delay
    setTimeout(() => {
      setTransitionMessage('Compiling analysis results...');
    }, 1500);

    setTimeout(() => {
      setTransitionMessage('Preparing your development roadmap...');
    }, 3000);

    // Complete transition and show website
    setTimeout(() => {
      onComplete();
    }, 4500);
  };

  // Don't show terminal for logged-in users (they see the main site with launch button)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="relative">
      {!showTransition ? (
        <Terminal onComplete={handleTerminalComplete} />
      ) : (
        /* Transition screen */
        <div className="fixed inset-0 bg-black text-green-400 font-mono flex items-center justify-center">
          <div className="text-center">
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
      )}
    </div>
  );
};