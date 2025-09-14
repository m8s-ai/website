import React, { memo, useRef, useEffect } from 'react';
import { Container, Icon } from '@/components/atoms';
import { TerminalOverlay } from '@/components/TerminalOverlay';

export interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  className?: string;
}

const TerminalModal = memo<TerminalModalProps>(({
  isOpen,
  onClose,
  onComplete,
  className = ''
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle overlay state changes - manage scrolling
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the background
      document.body.style.overflow = 'hidden';
      
      // Focus the overlay content
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
      // Arrow keys handled by terminal
    }
  };

  const handleComplete = () => {
    console.log('Terminal completed in overlay mode');
    onClose();
    onComplete?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black/40 backdrop-blur-lg 
        flex items-start justify-center pt-8 px-4 pb-4 ${className}
      `}
      onKeyDown={handleKeyDown}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-900/90 backdrop-blur-md border border-gray-500/40 rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10">
        {/* Terminal Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-600/50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            {/* Traffic Light Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
                title="Close"
              />
              <button
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
                title="Minimize"
                disabled
              />
              <button
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
                title="Maximize" 
                disabled
              />
            </div>
            <div className="text-gray-300 text-sm font-mono">M8S Terminal</div>
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
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
});

TerminalModal.displayName = 'TerminalModal';

export default TerminalModal;