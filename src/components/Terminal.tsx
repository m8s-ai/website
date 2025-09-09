import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [bootStartTime, setBootStartTime] = useState(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Track terminal access
  useEffect(() => {
    const skipBoot = searchParams.get('skipBoot') === 'true';
    const hasVisitedTerminal = localStorage.getItem('terminal_visited');
    
    // Track terminal entry
    analyticsManager.trackTerminalEvent('entered', {
      is_return_visit: hasVisitedTerminal === 'true',
      skip_boot_requested: skipBoot,
      entry_method: skipBoot ? 'direct_link' : 'organic'
    });
    
    // Mark terminal as visited
    localStorage.setItem('terminal_visited', 'true');
  }, [searchParams]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Initial delay before boot sequence starts
  useEffect(() => {
    const skipBoot = searchParams.get('skipBoot') === 'true';
    
    if (skipBoot) {
      analyticsManager.trackTerminalEvent('boot_skipped', {
        reason: 'skip_boot_parameter'
      });
      
      // Skip boot sequence and greeting entirely, go straight to conversation
      setBootStarted(true);
      setBootComplete(true);
      setCurrentBootLine(BOOT_SEQUENCE.length);
      setShowGreeting(true);
      setGreetingText(GREETING_MESSAGE);
      setCurrentChar(GREETING_MESSAGE.length);
      setConversationStarted(true);
      // Start background ambient sound
      audio.playBackgroundAmbient();
      // Trigger completion immediately to start conversation
      if (onComplete) {
        setTimeout(() => {
          analyticsManager.trackTerminalEvent('auto_completed', {
            reason: 'skip_boot'
          });
          onComplete();
        }, 100);
      }
    } else {
      const timer = setTimeout(() => {
        setBootStartTime(Date.now());
        analyticsManager.trackTerminalEvent('boot_started', {
          audio_enabled: audioEnabled
        });
        setBootStarted(true);
      }, 2000); // 2 seconds of just blinking cursor
      return () => clearTimeout(timer);
    }
  }, [searchParams, audio, onComplete]);

  // Boot sequence effect
  useEffect(() => {
    if (bootStarted && currentBootLine < BOOT_SEQUENCE.length) {
      console.log('Setting timer for boot line:', currentBootLine);
      const timer = setTimeout(() => {
        console.log('Advancing boot line from', currentBootLine, 'to', currentBootLine + 1);
        
        // Track boot line display
        analyticsManager.trackTerminalEvent('boot_line_displayed', {
          line_number: currentBootLine,
          line_text: BOOT_SEQUENCE[currentBootLine].substring(0, 50),
          audio_enabled: audioEnabled,
          elapsed_time: bootStartTime ? Math.round((Date.now() - bootStartTime) / 1000) : 0
        });
        
        // Play boot sound for each line
        if (audioEnabled) {
          audio.playBootSound(currentBootLine);
        }
        setCurrentBootLine(prev => prev + 1);
      }, 1500); // 1.5 seconds per boot line
      return () => clearTimeout(timer);
    }
  }, [bootStarted, currentBootLine, audioEnabled, bootStartTime]); // Added bootStartTime to deps

  // Separate effect for boot completion
  useEffect(() => {
    if (bootStarted && currentBootLine >= BOOT_SEQUENCE.length && !bootComplete) {
      console.log('Boot sequence complete, starting greeting');
      const timer = setTimeout(() => {
        analyticsManager.trackTerminalEvent('boot_completed', {
          total_boot_time: bootStartTime ? Math.round((Date.now() - bootStartTime) / 1000) : 0,
          lines_completed: BOOT_SEQUENCE.length,
          audio_enabled: audioEnabled
        });
        
        setBootComplete(true);
        setShowGreeting(true);
        // Start background ambient sound
        if (audioEnabled) {
          audio.playBackgroundAmbient();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bootStarted, currentBootLine, bootComplete, audioEnabled, bootStartTime]);

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
      }, 20); // Ultra fast typing effect
      return () => clearTimeout(timer);
    }
  }, [showGreeting, currentChar, audioEnabled]);

  // Separate effect for conversation start
  useEffect(() => {
    if (showGreeting && currentChar >= GREETING_MESSAGE.length) {
      const timer = setTimeout(() => {
        analyticsManager.trackTerminalEvent('greeting_completed', {
          message_length: GREETING_MESSAGE.length
        });
        setConversationStarted(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showGreeting, currentChar]);

  const handleStartConversation = useCallback(async () => {
    const totalTerminalTime = bootStartTime ? Math.round((Date.now() - bootStartTime) / 1000) : 0;
    
    analyticsManager.trackTerminalEvent('conversation_initiated', {
      interaction_method: 'button_click',
      total_terminal_time: totalTerminalTime,
      audio_enabled: audioEnabled
    });
    
    // Play selection sound
    if (audioEnabled) {
      await audio.playSelectionSound();
    }
    
    // Trigger completion immediately to transition to conversation
    if (onComplete) {
      onComplete();
    }
    
    console.log('Starting conversation...');
  }, [audioEnabled, audio, onComplete, bootStartTime]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && conversationStarted) {
        analyticsManager.trackTerminalEvent('conversation_initiated', {
          interaction_method: 'enter_key',
          audio_enabled: audioEnabled
        });
        handleStartConversation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [conversationStarted, handleStartConversation, audioEnabled]);

  console.log('Terminal render:', { bootStarted, bootComplete, currentBootLine, showGreeting, conversationStarted, audioEnabled });

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 pointer-events-none" />
      
      {/* Audio mute button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            const newAudioState = !audioEnabled;
            analyticsManager.trackTerminalEvent('audio_toggled', {
              new_state: newAudioState,
              terminal_stage: bootComplete ? 'greeting' : 'boot_sequence'
            });
            setAudioEnabled(newAudioState);
          }}
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
        className="relative z-10 p-4 md:p-8 h-full flex flex-col justify-center items-center max-w-4xl mx-auto text-center"
      >
        {/* Boot sequence */}
        {!bootComplete && bootStarted && (
          <div className="space-y-2 md:space-y-4" dir="ltr">
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
          <div className="mt-4 md:mt-8 space-y-2 md:space-y-4 text-center" dir="ltr">
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
                  [PRESS ENTER TO START VALIDATION]
                </div>
                <button
                  onClick={handleStartConversation}
                  className="bg-transparent border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors duration-200 font-mono"
                  style={{
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.6), 0 0 16px rgba(34, 197, 94, 0.4)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                  }}
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
              {showCursor && <div className="bg-green-400 w-full h-full" style={{
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6), 0 0 45px rgba(34, 197, 94, 0.4)'
              }}></div>}
            </div>
          </div>
        )}
      </div>

      {/* Audio implemented via Web Audio API - no HTML audio element needed */}
    </div>
  );
};