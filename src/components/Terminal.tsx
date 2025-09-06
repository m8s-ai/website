import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioManager } from './AudioManager';

interface TerminalProps {
  onComplete?: () => void;
}

const BOOT_SEQUENCE = [
  'INITIALIZING NEURAL NETWORKS...',
  'LOADING REQUIREMENT ANALYSIS ENGINE...',
  'CALIBRATING CONVERSATION PROTOCOLS...',
  'PROJECT VALIDATION MATRIX ONLINE...',
  'READY FOR DEEP ANALYSIS...'
];

const GREETING_MESSAGE = `Welcome to m8s! 🚀

I'm ARIA, your AI project validation bot.

I'll ask you a few quick questions, then generate your complete project package with prototypes, docs, and costs.

Ready to validate your amazing idea?`;

export const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const [bootStarted, setBootStarted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [currentBootLine, setCurrentBootLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const [currentChar, setCurrentChar] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Initial delay before boot sequence starts
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootStarted(true);
    }, 2000); // 2 seconds of just blinking cursor
    return () => clearTimeout(timer);
  }, []);

  // Boot sequence effect
  useEffect(() => {
    if (bootStarted && currentBootLine < BOOT_SEQUENCE.length) {
      console.log('Setting timer for boot line:', currentBootLine);
      const timer = setTimeout(() => {
        console.log('Advancing boot line from', currentBootLine, 'to', currentBootLine + 1);
        // Play boot sound for each line
        if (audioEnabled) {
          audio.playBootSound(currentBootLine);
        }
        setCurrentBootLine(prev => prev + 1);
      }, 1500); // 1.5 seconds per boot line
      return () => clearTimeout(timer);
    }
  }, [bootStarted, currentBootLine, audioEnabled]); // Removed audio from deps

  // Separate effect for boot completion
  useEffect(() => {
    if (bootStarted && currentBootLine >= BOOT_SEQUENCE.length && !bootComplete) {
      console.log('Boot sequence complete, starting greeting');
      const timer = setTimeout(() => {
        setBootComplete(true);
        setShowGreeting(true);
        // Start background ambient sound
        if (audioEnabled) {
          audio.playBackgroundAmbient();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bootStarted, currentBootLine, bootComplete, audioEnabled]);

  // Typewriter effect for greeting
  useEffect(() => {
    if (showGreeting && currentChar < GREETING_MESSAGE.length) {
      const timer = setTimeout(() => {
        // Play typing sound for each character (not for spaces)
        if (audioEnabled && GREETING_MESSAGE[currentChar] !== ' ') {
          audio.playTypingSound();
        }
        setGreetingText(prev => prev + GREETING_MESSAGE[currentChar]);
        setCurrentChar(prev => prev + 1);
      }, 50); // Fast typing effect
      return () => clearTimeout(timer);
    }
  }, [showGreeting, currentChar, audioEnabled]);

  // Separate effect for conversation start
  useEffect(() => {
    if (showGreeting && currentChar >= GREETING_MESSAGE.length) {
      const timer = setTimeout(() => {
        setConversationStarted(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showGreeting, currentChar]);

  const handleStartConversation = useCallback(async () => {
    // Play selection sound
    if (audioEnabled) {
      await audio.playSelectionSound();
    }
    
    // For now, simulate conversation completion after a short delay
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);
    
    console.log('Starting conversation...');
    // TODO: Connect to n8n automation
  }, [audioEnabled, audio, onComplete]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && conversationStarted) {
        handleStartConversation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [conversationStarted, handleStartConversation]);

  console.log('Terminal render:', { bootStarted, bootComplete, currentBootLine, showGreeting, conversationStarted, audioEnabled });

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 pointer-events-none" />
      
      {/* Audio mute button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`px-3 py-1 rounded text-sm font-mono transition-colors duration-200 ${
            audioEnabled 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
          title={audioEnabled ? "Mute sound effects" : "Enable sound effects"}
        >
          {audioEnabled ? '🔊 MUTE' : '🔇 UNMUTE'}
        </button>
      </div>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="relative z-10 p-8 h-full flex flex-col justify-center items-center max-w-4xl mx-auto text-center"
        dir="ltr"
      >
        {/* Boot sequence */}
        {!bootComplete && bootStarted && (
          <div className="space-y-4">
            {BOOT_SEQUENCE.slice(0, currentBootLine).map((line, index) => (
              <div key={index} className="flex items-center justify-center space-x-4">
                <span className="text-amber-400">{line}</span>
                <span className="text-green-300">✓</span>
              </div>
            ))}
            {currentBootLine < BOOT_SEQUENCE.length && (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-amber-400">{BOOT_SEQUENCE[currentBootLine]}</span>
                <div className="w-3 h-5 inline-block ml-2">
                  {showCursor && <div className="bg-green-400 w-full h-full"></div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Greeting section */}
        {showGreeting && (
          <div className="mt-8 space-y-4 text-center">
            <div className="text-amber-300 leading-relaxed whitespace-pre-line">
              {greetingText}
              <span className="w-3 h-5 inline-block ml-1">
                {currentChar < GREETING_MESSAGE.length && showCursor && (
                  <div className="bg-green-400 w-full h-full inline-block"></div>
                )}
              </span>
            </div>
            
            {/* Conversation starter */}
            {conversationStarted && (
              <div className="mt-8">
                <div className="mb-4 text-green-300">
                  [PRESS ENTER TO START VALIDATION]
                </div>
                <button
                  onClick={handleStartConversation}
                  className="bg-transparent border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors duration-200 font-mono"
                >
                  🚀 LET'S VALIDATE MY IDEA!
                </button>
              </div>
            )}
          </div>
        )}

        {/* Initial cursor when nothing is displayed */}
        {!bootStarted && (
          <div className="text-2xl">
            <div className="w-4 h-6 inline-block">
              {showCursor && <div className="bg-green-400 w-full h-full"></div>}
            </div>
          </div>
        )}
      </div>

      {/* Audio implemented via Web Audio API - no HTML audio element needed */}
    </div>
  );
};