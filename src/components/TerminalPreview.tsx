import React, { useState, useEffect } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';

interface TerminalPreviewProps {
  onExpand?: () => void;
  className?: string;
}

export const TerminalPreview: React.FC<TerminalPreviewProps> = ({ onExpand, className = "" }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const [showCursor, setShowCursor] = useState(true);
  const [bootText] = useState([
    'INITIALIZING PROJECT VALIDATION ENGINE...',
    'ARIA BOT SYSTEMS ONLINE...'
  ]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleClick = async () => {
    // Track preview click
    analyticsManager.trackTerminalEvent('poc_planning_initiated', {
      interaction_type: 'aria_terminal_preview_expand',
      click_location: 'home_poc_preview',
      bot_name: 'ARIA'
    });

    // Play expanding sound
    await audio.playExpandingSound();

    // Trigger expansion
    if (onExpand) {
      onExpand();
    }
  };

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Plan Your POC with ARIA
            </span>
          </h2>
          <p className="text-lg text-gray-300">
            Meet ARIA, your AI project validation bot. Click to start planning your proof-of-concept through our interactive terminal interface
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            onClick={handleClick}
            className="relative bg-black border border-gray-600 rounded-lg shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/20 p-6"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
            aria-label="Click to open interactive terminal"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-gray-400 text-sm font-mono">m8s.ai Terminal</div>
            </div>

            {/* Terminal Content */}
            <div className="font-mono text-sm md:text-base space-y-2" dir="ltr">
              {bootText.map((line, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-amber-400" style={{
                    textShadow: '0 0 10px rgba(251, 191, 36, 0.8)'
                  }}>
                    {line}
                  </span>
                  <span className="text-green-300" style={{
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.8)'
                  }}>
                    ✓
                  </span>
                </div>
              ))}
              
              <div className="flex items-center space-x-2 pt-2">
                <span className="text-green-400">READY FOR POC VALIDATION...</span>
                <div className="w-2 h-4 inline-block">
                  {showCursor && (
                    <div 
                      className="bg-green-400 w-full h-full" 
                      style={{
                        boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
                      }}
                    ></div>
                  )}
                </div>
              </div>

              {/* Click prompt */}
              <div className="pt-4 text-center">
                <div className="inline-flex items-center px-4 py-2 border border-green-400 text-green-400 rounded text-sm hover:bg-green-400 hover:text-black transition-colors duration-200">
                  <span className="mr-2">🤖</span>
                  Start Planning with ARIA
                </div>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10 rounded-lg pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};