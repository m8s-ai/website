import React, { useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';

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

const GREETING_MESSAGE = `System ready. I am the m8s Validation Matrix.
I will analyze your project concept through systematic interrogation.
State your project vision.`;

export const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const { t } = useLanguageContext();
  const [bootComplete, setBootComplete] = useState(false);
  const [currentBootLine, setCurrentBootLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const [currentChar, setCurrentChar] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence effect
  useEffect(() => {
    if (currentBootLine < BOOT_SEQUENCE.length) {
      const timer = setTimeout(() => {
        setCurrentBootLine(prev => prev + 1);
      }, 1500); // 1.5 seconds per boot line
      return () => clearTimeout(timer);
    } else if (!bootComplete) {
      // Boot sequence complete, show greeting after delay
      setTimeout(() => {
        setBootComplete(true);
        setShowGreeting(true);
      }, 1000);
    }
  }, [currentBootLine, bootComplete]);

  // Typewriter effect for greeting
  useEffect(() => {
    if (showGreeting && currentChar < GREETING_MESSAGE.length) {
      const timer = setTimeout(() => {
        setGreetingText(prev => prev + GREETING_MESSAGE[currentChar]);
        setCurrentChar(prev => prev + 1);
      }, 50); // Fast typing effect
      return () => clearTimeout(timer);
    } else if (showGreeting && currentChar >= GREETING_MESSAGE.length) {
      // Greeting complete, show conversation options
      setTimeout(() => {
        setConversationStarted(true);
      }, 2000);
    }
  }, [showGreeting, currentChar]);

  const handleStartConversation = () => {
    // This will trigger the conversation flow
    console.log('Starting conversation...');
    // TODO: Connect to n8n automation
  };

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 pointer-events-none" />
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="relative z-10 p-8 h-full flex flex-col justify-center max-w-4xl mx-auto"
      >
        {/* Boot sequence */}
        {!bootComplete && (
          <div className="space-y-4">
            {BOOT_SEQUENCE.slice(0, currentBootLine).map((line, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-amber-400">{line}</span>
                <span className="text-green-300">✓</span>
              </div>
            ))}
            {currentBootLine < BOOT_SEQUENCE.length && (
              <div className="flex items-center space-x-2">
                <span className="text-amber-400">{BOOT_SEQUENCE[currentBootLine]}</span>
                {showCursor && <span className="bg-green-400 text-black px-1">█</span>}
              </div>
            )}
          </div>
        )}

        {/* Greeting section */}
        {showGreeting && (
          <div className="mt-8 space-y-4">
            <div className="text-amber-300 leading-relaxed whitespace-pre-line">
              {greetingText}
              {currentChar < GREETING_MESSAGE.length && showCursor && (
                <span className="bg-green-400 text-black px-1 ml-1">█</span>
              )}
            </div>
            
            {/* Conversation starter */}
            {conversationStarted && (
              <div className="mt-8">
                <div className="mb-4 text-green-300">
                  [PRESS ENTER TO BEGIN PROJECT ANALYSIS]
                </div>
                <button
                  onClick={handleStartConversation}
                  className="bg-transparent border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors duration-200 font-mono"
                >
                  &gt; BEGIN ANALYSIS
                </button>
              </div>
            )}
          </div>
        )}

        {/* Initial cursor when nothing is displayed */}
        {!bootComplete && currentBootLine === 0 && (
          <div className="text-2xl">
            {showCursor && <span className="bg-green-400 text-black px-2">█</span>}
          </div>
        )}
      </div>

      {/* Ambient sound placeholder - TODO: Implement Web Audio API */}
      <audio 
        autoPlay 
        loop 
        volume={0.1}
        style={{ display: 'none' }}
      >
        {/* TODO: Add vacuum tube warmup and ambient hum sounds */}
      </audio>
    </div>
  );
};