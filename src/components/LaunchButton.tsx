import React, { useState } from 'react';
import { Terminal } from './Terminal';

interface LaunchButtonProps {
  username: string;
  onTerminalComplete?: () => void;
}

export const LaunchButton: React.FC<LaunchButtonProps> = ({ 
  username, 
  onTerminalComplete 
}) => {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleLaunch = () => {
    setShowTerminal(true);
  };

  const handleTerminalComplete = () => {
    setShowTerminal(false);
    if (onTerminalComplete) {
      onTerminalComplete();
    }
  };

  return (
    <>
      {/* Launch Button */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-300 text-sm">Welcome, {username}</span>
        <button
          onClick={handleLaunch}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-2 rounded-lg font-mono text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/25 border border-green-500/30"
        >
          <span className="flex items-center space-x-2">
            <span>🚀</span>
            <span>LAUNCH</span>
          </span>
        </button>
      </div>

      {/* Full-screen terminal overlay */}
      {showTerminal && (
        <div className="fixed inset-0 z-50">
          <Terminal onComplete={handleTerminalComplete} />
          
          {/* Close button for logged-in users */}
          <button
            onClick={() => setShowTerminal(false)}
            className="absolute top-4 right-4 z-60 text-green-400 hover:text-green-300 text-2xl"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};