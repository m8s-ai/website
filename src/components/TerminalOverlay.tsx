import React, { useState, useEffect, useCallback } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';

interface TerminalOverlayProps {
  onComplete?: () => void;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ onComplete }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });

  // Simple terminal display
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-complete after a short delay for development
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();

        }, 2000);
    return () => clearTimeout(timer);
          }, [onComplete]);

  return (
    <div className="w-full h-full bg-transparent text-green-400 font-mono overflow-hidden relative">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10 pointer-events-none" />

      {/* Terminal content */}
      <div className="relative z-10 pt-4 px-8 pb-8 h-full flex flex-col justify-center items-center max-w-4xl mx-auto text-center">
        <div className="space-y-4 text-center" dir="ltr">
          <div className="text-amber-300 text-2xl mb-8" style={{
            textShadow: '0 0 8px rgba(252, 211, 77, 0.8), 0 0 16px rgba(252, 211, 77, 0.6), 0 0 24px rgba(252, 211, 77, 0.4)'
          }}>
            M8S Terminal
          </div>

          <div className="text-green-300 mb-8" style={{
            textShadow: '0 0 8px rgba(34, 197, 94, 0.8), 0 0 16px rgba(34, 197, 94, 0.6)'
          }}>
            Terminal experience coming soon...
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-green-400">$</span>
            <div className="w-2 h-4">
              {showCursor && <div className="bg-green-400 w-full h-full" style={{
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)'
              }}></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};