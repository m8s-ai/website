import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';
import { ConversationEngine } from './ConversationEngine';
import { useLanguage } from '@/contexts/LanguageContext';

interface TerminalOverlayProps {
  onComplete?: () => void;
}

// Boot sequence will be translated at runtime

// Greeting message will be translated at runtime

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ onComplete }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  
  // Terminal overlay always uses English - hardcoded
  const BOOT_SEQUENCE = [
    'INITIALIZING PROJECT VALIDATION ENGINE...',
    'LOADING AI ANALYSIS PROTOCOLS...',
    'CALIBRATING CONVERSATION SYSTEMS...',
    'ARIA BOT SYSTEMS ONLINE...',
    'READY FOR POC VALIDATION...'
  ];
  
  // Greeting message in English only
  const GREETING_MESSAGE = `Welcome! I'm ARIA, your AI project validation bot. 🤖

I'll ask you a few strategic questions about your project idea, then generate a complete validation package with:

• Technical feasibility analysis
• Market opportunity assessment
• Development roadmap & costs
• Risk analysis & mitigation

Ready to validate your next big idea?`;
  const [bootStarted, setBootStarted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [currentBootLine, setCurrentBootLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const [currentChar, setCurrentChar] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [bootStartTime, setBootStartTime] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [showConversationEngine, setShowConversationEngine] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-start boot sequence after short delay
  useEffect(() => {
    console.log('TerminalOverlay mounted, starting boot sequence...');
    const timer = setTimeout(() => {
      console.log('Boot sequence timer fired, setting bootStarted to true');
      setBootStartTime(Date.now());
      analyticsManager.trackTerminalEvent('overlay_boot_started', {
        source: 'terminal_preview',
        context: 'aria_poc_planning'
      });
      setBootStarted(true);
    }, 500); // Reduced from 1000ms to 500ms
    return () => clearTimeout(timer);
  }, []);

  // Boot sequence effect
  useEffect(() => {
    if (bootStarted && currentBootLine < BOOT_SEQUENCE.length) {
      console.log(`Starting boot line ${currentBootLine}: ${BOOT_SEQUENCE[currentBootLine]}`);
      const timer = setTimeout(() => {
        analyticsManager.trackTerminalEvent('overlay_boot_line_displayed', {
          line_number: currentBootLine,
          line_text: BOOT_SEQUENCE[currentBootLine].substring(0, 50)
        });
        
        audio.playBootSound(currentBootLine);
        setCurrentBootLine(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [bootStarted, currentBootLine]);

  // Boot completion effect
  useEffect(() => {
    if (bootStarted && currentBootLine >= BOOT_SEQUENCE.length && !bootComplete) {
      console.log('Boot sequence completed, starting greeting...');
      const timer = setTimeout(() => {
        analyticsManager.trackTerminalEvent('overlay_boot_completed', {
          total_boot_time: bootStartTime ? Math.round((Date.now() - bootStartTime) / 1000) : 0,
          lines_completed: BOOT_SEQUENCE.length
        });
        
        setBootComplete(true);
        setShowGreeting(true);
        audio.playBackgroundAmbient();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bootStarted, currentBootLine, bootComplete, bootStartTime]);

  // Typewriter effect for greeting
  useEffect(() => {
    if (showGreeting && currentChar < GREETING_MESSAGE.length) {
      const timer = setTimeout(() => {
        if (GREETING_MESSAGE[currentChar] !== ' ') {
          audio.playTypingSound();
        }
        setGreetingText(prev => prev + GREETING_MESSAGE[currentChar]);
        setCurrentChar(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [showGreeting, currentChar]);

  // Conversation start effect
  useEffect(() => {
    if (showGreeting && currentChar >= GREETING_MESSAGE.length) {
      const timer = setTimeout(() => {
        analyticsManager.trackTerminalEvent('overlay_greeting_completed', {
          message_length: GREETING_MESSAGE.length
        });
        setConversationStarted(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showGreeting, currentChar]);

  const handleStartConversation = useCallback(async () => {
    const totalTerminalTime = bootStartTime ? Math.round((Date.now() - bootStartTime) / 1000) : 0;
    
    analyticsManager.trackTerminalEvent('overlay_conversation_initiated', {
      interaction_method: 'button_click',
      total_terminal_time: totalTerminalTime,
      bot_name: 'ARIA'
    });
    
    await audio.playTransitionSound();
    
    // Start the transition sequence for ConversationEngine
    setTransitionMessage('Getting ARIA ready to chat...');
    setShowTransition(true);
    
    setTimeout(() => {
      setTransitionMessage('Preparing your project analysis...');
    }, 1500);

    setTimeout(() => {
      setTransitionMessage('Almost ready! Starting conversation...');
    }, 3000);

    setTimeout(() => {
      setShowConversationEngine(true); // Show ConversationEngine after transition
      setShowTransition(false); // Hide transition screen
    }, 4500);
  }, [audio, bootStartTime]);

  // Focus conversation when it becomes visible
  useEffect(() => {
    if (showConversationEngine && conversationRef.current) {
      conversationRef.current.focus();
    }
  }, [showConversationEngine]);

  // Handle Enter key press (only when not in conversation mode)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && conversationStarted && !showConversationEngine) {
        analyticsManager.trackTerminalEvent('overlay_conversation_initiated', {
          interaction_method: 'enter_key',
          bot_name: 'ARIA'
        });
        handleStartConversation();
      }
    };

    // Only add event listener if conversation engine is not showing
    if (!showConversationEngine) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [conversationStarted, handleStartConversation, showConversationEngine]);

  // Render different states
  if (showConversationEngine) {
    return (
      <div 
        ref={conversationRef} 
        className="w-full h-full bg-transparent focus:outline-none overflow-auto terminal-scrollbar" 
        tabIndex={0} 
        autoFocus
        style={{ 
          pointerEvents: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#10b981 #1f2937'
        }}
        onKeyDown={(e) => {
          console.log('TerminalOverlay received key:', e.key);
          // Let events pass through to ConversationEngine
        }}
        onClick={(e) => {
          console.log('TerminalOverlay received click:', e.target);
          // Let events pass through to ConversationEngine
        }}
      >
        <ConversationEngine onComplete={onComplete || (() => {})} />
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="w-full h-full bg-transparent text-green-400 font-mono flex items-center justify-center">
        <div className="text-center" dir="ltr">
          <div className="text-xl mb-4 text-amber-400">
            {transitionMessage}
          </div>
          <div className="flex space-x-1 justify-center">
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
    );
  }

  return (
    <div className="w-full h-full bg-transparent text-green-400 font-mono overflow-hidden relative">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10 pointer-events-none" />
      
      {/* Terminal content */}
      <div className="relative z-10 pt-4 px-8 pb-8 h-full flex flex-col justify-start items-center max-w-4xl mx-auto text-center">
        {/* Boot sequence */}
        {!bootComplete && bootStarted && (
          <div className="space-y-4" dir="ltr">
            {BOOT_SEQUENCE.slice(0, currentBootLine).map((line, index) => (
              <div key={index} className="flex items-center justify-center space-x-4" dir="ltr">
                <span className="text-amber-400" style={{
                  textShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(251, 191, 36, 0.4)'
                }}>{line}</span>
                <span className="text-green-300" style={{
                  textShadow: '0 0 8px rgba(34, 197, 94, 0.8), 0 0 16px rgba(34, 197, 94, 0.6)'
                }}>✓</span>
              </div>
            ))}
            {currentBootLine < BOOT_SEQUENCE.length && (
              <div className="flex items-center justify-center space-x-2" dir="ltr">
                <span className="text-amber-400" style={{
                  textShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(251, 191, 36, 0.4)'
                }}>{BOOT_SEQUENCE[currentBootLine]}</span>
                <div className="w-3 h-5 inline-block ml-2">
                  {showCursor && <div className="bg-green-400 w-full h-full" style={{
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)'
                  }}></div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Greeting section */}
        {showGreeting && (
          <div className="mt-8 space-y-4 text-center" dir="ltr">
            <div className="text-amber-300 leading-relaxed whitespace-pre-line" style={{
              textShadow: '0 0 8px rgba(252, 211, 77, 0.8), 0 0 16px rgba(252, 211, 77, 0.6), 0 0 24px rgba(252, 211, 77, 0.4)'
            }}>
              {greetingText}
              <span className="w-3 h-5 inline-block ml-1">
                {currentChar < GREETING_MESSAGE.length && showCursor && (
                  <div className="bg-green-400 w-full h-full inline-block" style={{
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)'
                  }}></div>
                )}
              </span>
            </div>
            
            {/* Conversation starter */}
            {conversationStarted && (
              <div className="mt-8" dir="ltr">
                <div className="mb-4 text-green-300" style={{
                  textShadow: '0 0 8px rgba(34, 197, 94, 0.8), 0 0 16px rgba(34, 197, 94, 0.6)'
                }}>
                  [PRESS ENTER TO START POC VALIDATION]
                </div>
                <button
                  onClick={handleStartConversation}
                  className="bg-transparent border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors duration-200 font-mono"
                  style={{
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.6), 0 0 16px rgba(34, 197, 94, 0.4)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  🤖 START PLANNING WITH ARIA
                </button>
              </div>
            )}
          </div>
        )}

        {/* Initial cursor when nothing is displayed */}
        {!bootStarted && (
          <div className="text-2xl">
            <div className="w-4 h-6 inline-block">
              {showCursor && <div className="bg-green-400 w-full h-full" style={{
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6), 0 0 45px rgba(34, 197, 94, 0.4)'
              }}></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};