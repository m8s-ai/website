import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';
import { ConversationEngine } from './ConversationEngine';

interface TerminalOverlayProps {
  onComplete?: () => void;
}

// Boot sequence will be translated at runtime

// Greeting message will be translated at runtime

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ onComplete }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  
  // Terminal overlay always uses English - hardcoded
  const TERMINAL_COMMANDS = [
    { command: '$ cd /usr/local/m8s/aria', output: null },
    { command: '$ ./start-validation-system.sh', output: 'Starting ARIA Project Validation System...' },
    { command: null, output: 'Loading AI analysis protocols... ✓' },
    { command: null, output: 'Initializing conversation engine... ✓' },
    { command: null, output: 'Calibrating business intelligence... ✓' },
    { command: null, output: 'ARIA system ready for project validation' },
    { command: '$ aria --version', output: 'ARIA v3.2.1 - AI Project Validation Assistant' },
    { command: '$ aria --help', output: 'Available modes: [qa] [project-validation] [technical-analysis]' }
  ];
  
  // Welcome message after terminal simulation
  const WELCOME_MESSAGE = 'ARIA Project Validation Terminal';
  const [terminalStarted, setTerminalStarted] = useState(false);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [commandHistory, setCommandHistory] = useState<Array<{command: string | null, output: string | null, completed: boolean}>>([]);
  const [showingOutput, setShowingOutput] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [terminalStartTime, setTerminalStartTime] = useState<number | null>(null);
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

  // Auto-start terminal simulation after short delay
  useEffect(() => {
    console.log('TerminalOverlay mounted, starting terminal simulation...');
    const timer = setTimeout(() => {
      console.log('Terminal simulation timer fired, setting terminalStarted to true');
      setTerminalStartTime(Date.now());
      analyticsManager.trackTerminalEvent('overlay_terminal_started', {
        source: 'terminal_preview',
        context: 'aria_poc_planning'
      });
      setTerminalStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Terminal command simulation effect
  useEffect(() => {
    if (terminalStarted && currentCommandIndex < TERMINAL_COMMANDS.length) {
      const currentCmd = TERMINAL_COMMANDS[currentCommandIndex];
      console.log(`Processing command ${currentCommandIndex}:`, currentCmd);
      
      // Step 1: Show command (if it exists)
      if (currentCmd.command) {
        const timer = setTimeout(() => {
          audio.playBootSound(currentCommandIndex);
          
          // Add command to history
          setCommandHistory(prev => [...prev, {
            command: currentCmd.command,
            output: null,
            completed: false
          }]);
          
          // Step 2: Show output after a delay
          if (currentCmd.output) {
            setTimeout(() => {
              setCommandHistory(prev => prev.map((item, index) => 
                index === prev.length - 1 ? { ...item, output: currentCmd.output, completed: true } : item
              ));
              
              // Move to next command after showing output
              setTimeout(() => {
                setCurrentCommandIndex(prev => prev + 1);
              }, 2000);
            }, 500); // Small delay before showing output
          } else {
            setTimeout(() => {
              setCurrentCommandIndex(prev => prev + 1);
            }, 800);
          }
        }, 800);
        
        return () => clearTimeout(timer);
      } else {
        // Only output, no command
        const timer = setTimeout(() => {
          audio.playBootSound(currentCommandIndex);
          
          setCommandHistory(prev => [...prev, {
            command: null,
            output: currentCmd.output,
            completed: true
          }]);
          
          setTimeout(() => {
            setCurrentCommandIndex(prev => prev + 1);
          }, 2000);
        }, 200);
        
        return () => clearTimeout(timer);
      }
    }
  }, [terminalStarted, currentCommandIndex]);

  // Terminal completion effect
  useEffect(() => {
    if (terminalStarted && currentCommandIndex >= TERMINAL_COMMANDS.length && !terminalComplete) {
      console.log('Terminal simulation completed, moving to conversation...');
      const timer = setTimeout(() => {
        analyticsManager.trackTerminalEvent('overlay_terminal_completed', {
          total_terminal_time: terminalStartTime ? Math.round((Date.now() - terminalStartTime) / 1000) : 0,
          commands_executed: TERMINAL_COMMANDS.length
        });
        
        setTerminalComplete(true);
        setConversationStarted(true);
        audio.playBackgroundAmbient();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [terminalStarted, currentCommandIndex, terminalComplete, terminalStartTime]);

  // Auto-start conversation after terminal simulation
  useEffect(() => {
    if (conversationStarted && !showConversationEngine) {
      const timer = setTimeout(() => {
        setShowConversationEngine(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [conversationStarted, showConversationEngine]);

  const handleStartConversation = useCallback(async () => {
    const totalTerminalTime = terminalStartTime ? Math.round((Date.now() - terminalStartTime) / 1000) : 0;
    
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
  }, [audio, terminalStartTime]);

  // Focus conversation when it becomes visible
  useEffect(() => {
    if (showConversationEngine && conversationRef.current) {
      conversationRef.current.focus();
    }
  }, [showConversationEngine]);

  // Handle Enter key press (only when terminal simulation is complete)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && terminalComplete && !showConversationEngine) {
        analyticsManager.trackTerminalEvent('overlay_conversation_initiated', {
          interaction_method: 'enter_key',
          bot_name: 'ARIA'
        });
        handleStartConversation();
      }
    };

    // Only add event listener if conversation engine is not showing
    if (!showConversationEngine && terminalComplete) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [terminalComplete, handleStartConversation, showConversationEngine]);

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
        {/* Terminal Command Simulation */}
        {!terminalComplete && terminalStarted && (
          <div className="space-y-2 text-left w-full max-w-2xl" dir="ltr">
            {/* Show command history */}
            {commandHistory.map((item, index) => (
              <div key={index} className="space-y-1">
                {item.command && (
                  <div className="flex items-center" dir="ltr">
                    <span className="text-green-400" style={{
                      textShadow: '0 0 8px rgba(34, 197, 94, 0.8), 0 0 16px rgba(34, 197, 94, 0.6)'
                    }}>{item.command}</span>
                    {/* Show cursor only on the last command if it doesn't have output yet */}
                    {index === commandHistory.length - 1 && !item.output && item.command && (
                      <div className="w-2 h-4 inline-block ml-1">
                        {showCursor && <div className="bg-green-400 w-full h-full" style={{
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)'
                        }}></div>}
                      </div>
                    )}
                  </div>
                )}
                {item.output && (
                  <div className="text-amber-300 pl-4" style={{
                    textShadow: '0 0 8px rgba(252, 211, 77, 0.6), 0 0 16px rgba(252, 211, 77, 0.4)'
                  }}>
                    {item.output}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Terminal Complete - Show Welcome */}
        {terminalComplete && !conversationStarted && (
          <div className="mt-8 space-y-4 text-center" dir="ltr">
            <div className="text-amber-300 text-2xl" style={{
              textShadow: '0 0 8px rgba(252, 211, 77, 0.8), 0 0 16px rgba(252, 211, 77, 0.6), 0 0 24px rgba(252, 211, 77, 0.4)'
            }}>
              {WELCOME_MESSAGE}
            </div>
            <div className="text-green-300" style={{
              textShadow: '0 0 8px rgba(34, 197, 94, 0.8), 0 0 16px rgba(34, 197, 94, 0.6)'
            }}>
              System initialized and ready for project validation
            </div>
          </div>
        )}

        {/* Conversation starter */}
        {conversationStarted && !showConversationEngine && (
          <div className="mt-8 space-y-4 text-center" dir="ltr">
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

        {/* Initial cursor when nothing is displayed */}
        {!terminalStarted && (
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