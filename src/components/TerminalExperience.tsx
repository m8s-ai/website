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
  const audio = useAudioManager({ isEnabled: true, volume: 0.2 });

  const handleTerminalComplete = async () => {
    await audio.playTransitionSound();
    // Simple completion
    onComplete();
  };

  // Don't show terminal for logged-in users (they see the main site with launch button)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="relative" dir="ltr">
      <Terminal onComplete={handleTerminalComplete} />
    </div>
  );
};