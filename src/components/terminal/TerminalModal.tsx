import React, { useRef, useEffect } from 'react';
import { TerminalOverlay } from '../TerminalOverlay';
import { TerminalMode } from '@/types/terminalModes';

interface TerminalModalProps {
  isOpen: boolean;
  mode: TerminalMode;
  onClose: () => void;
  onComplete?: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  mode,
  onClose,
  onComplete
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle overlay state changes - just manage scrolling
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the background
      document.body.style.overflow = 'hidden';
      
      // Focus the overlay content after a short delay to ensure it's rendered
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.focus();
        }
      }, 100);
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle ESC key to close overlay
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
    // Prevent arrow keys from scrolling the overlay window
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      // Let the event bubble to ConversationEngine for menu navigation
      const conversationElement = e.currentTarget.querySelector('[data-conversation-engine]');
      if (conversationElement) {
        conversationElement.dispatchEvent(new KeyboardEvent('keydown', {
          key: e.key,
          bubbles: true,
          cancelable: true
        }));
      }
    }
    // Let all other keys pass through to the terminal content
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent scrolling the background
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent touch scrolling on mobile
    e.preventDefault();
  };

  const handleComplete = () => {
    console.log('ARIA terminal completed in overlay mode');
    onClose();
    if (onComplete) {
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-start justify-center pt-8 px-4 pb-4"
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-900/90 backdrop-blur-md border border-gray-500/40 rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10">
        {/* Terminal Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-600/50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            {/* Traffic Light Buttons */}
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
                title="Close"
              ></button>
              <span className="w-2 inline-block" />
              <button
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
                title="Minimize"
                disabled
              ></button>
              <span className="w-2 inline-block" />
              <button
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
                title="Maximize" 
                disabled
              ></button>
            </div>
            <div className="text-gray-300 text-sm font-mono">ARIA - Project Validation Terminal</div>
          </div>
          
          {/* ESC hint */}
          <div className="flex items-center">
            <div className="text-gray-500 text-xs font-mono">
              Press ESC to close
            </div>
          </div>
        </div>
        
        {/* Terminal content with slight transparency */}
        <div 
          ref={overlayRef}
          className="w-full h-full rounded-b-xl overflow-auto bg-black/85 backdrop-blur-sm focus:outline-none terminal-scrollbar"
          tabIndex={0}
          autoFocus
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#10b981 #1f2937'
          }}
        >
          <TerminalOverlay 
            initialBotMode={mode}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
};