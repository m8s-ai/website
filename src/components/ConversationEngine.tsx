import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioManager } from './AudioManager';

// Conversation wave structure based on your methodology
interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'yes-no';
  options?: string[];
  followUp?: string; // Smart follow-up comment
  validation?: (answer: string) => boolean;
}

interface Wave {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface ConversationEngineProps {
  onComplete: (data: ConversationData) => void;
}

interface ConversationData {
  responses: Record<string, string>;
  waveData: {
    wave1: Record<string, string>;
    wave2: Record<string, string>;
    wave3: Record<string, string>;
    wave4: Record<string, string>;
  };
}

// Aria's conversational flow - simplified and friendly
const CONVERSATION_WAVES: Wave[] = [
  {
    id: 'wave1',
    name: 'Welcome & Path Selection',
    description: 'Aria introduces herself and the team',
    questions: [
      {
        id: 'welcome',
        text: 'Hi, I\'m Aria 👋 your Analyst M8. My job is to help you understand what we do and, if you\'d like, start defining your project.\n\nWould you like me to…',
        type: 'multiple-choice',
        options: [
          'Learn more first',
          'Start my project'
        ],
        followUp: 'Great choice! Let me guide you through this.'
      }
    ]
  },
  {
    id: 'wave2',
    name: 'Learn More Path',
    description: 'Educational content about m8s team',
    questions: [
      {
        id: 'learn_more',
        text: 'Perfect! Here\'s the big picture:\n• We\'re not just one developer. We\'re a full AI-powered team: analyst, PM, architect, UX, developers, QA.\n• Behind us, human architects oversee everything. They\'re elite AI professionals with startup, freelancing, and Unit 8200 experience.\n• Together, we build everything from small business automations to enterprise systems, always with world-class quality.\n\nWhat would you like to know more about?',
        type: 'multiple-choice',
        options: [
          'How does it work?',
          'Who are the human architects?',
          'Okay, let\'s start my project'
        ],
        followUp: 'I\'m excited to share more details with you!'
      },
      {
        id: 'how_it_works',
        text: 'We follow a simple, proven process:\n1️⃣ Define your idea with me\n2️⃣ Meet our human architects to refine scope & get a quote\n3️⃣ m8s build, design & test\n4️⃣ Delivery step by step or all at once\n\nThis way, you don\'t just get a developer — you get a whole team working for you.',
        type: 'multiple-choice',
        options: [
          'Sounds good, start my project',
          'Tell me more about the architects'
        ],
        followUp: 'I love how our process keeps everything organized!'
      },
      {
        id: 'about_architects',
        text: 'Our architects are AI pros with experience delivering hundreds of projects — from startups to enterprise systems. Many come from the elite intelligence unit 8200, bringing top expertise in software, AI, and security.\n\nThey make sure everything the m8s deliver is production-ready, scalable, and secure.',
        type: 'multiple-choice',
        options: [
          'Great, start my project',
          'Show me how it works again'
        ],
        followUp: 'Our architects are truly amazing - you\'ll love working with them!'
      }
    ]
  },
  {
    id: 'wave3',
    name: 'Project Definition',
    description: 'Defining your project with Aria',
    questions: [
      {
        id: 'project_idea',
        text: 'Awesome 🚀 Let\'s get your idea down clearly.\n\nIn a few words, tell me what you\'d like us to build or automate.',
        type: 'text',
        followUp: 'Got it ✅ Let\'s refine it a bit together.',
        validation: (answer: string) => answer.length > 5
      },
      {
        id: 'project_scale',
        text: 'Would you say this is more like…',
        type: 'multiple-choice',
        options: [
          'A small proof-of-concept (just to test an idea quickly)',
          'A full project (production-ready, high quality)',
          'Not sure yet — guide me'
        ],
        followUp: 'Perfect choice! This helps me understand the scope.'
      }
    ]
  },
  {
    id: 'wave4',
    name: 'Process & Next Steps',
    description: 'Explaining the process and leading to meeting',
    questions: [
      {
        id: 'process_explanation',
        text: 'Here\'s how we build every project:\n\n1️⃣ Define your idea clearly\n2️⃣ Architects refine & align with you\n3️⃣ m8s design, code & test\n4️⃣ Delivery step by step or all at once\n\nThis way, you get the speed of AI + the quality of elite human architects.\n\nReady for the next step?',
        type: 'multiple-choice',
        options: [
          'Yes, next step!'
        ],
        followUp: 'Excellent! Let\'s connect you with our architects.'
      },
      {
        id: 'schedule_meeting',
        text: 'The next step is to meet one of our human architects. They\'ll refine your idea with you, agree on the scope, and provide a clear quote.\n\nWould you like me to schedule a meeting?',
        type: 'multiple-choice',
        options: [
          'Yes, schedule a meeting',
          'Tell me more first',
          'Not now'
        ],
        followUp: 'Perfect! Let me get your details.'
      },
      {
        id: 'contact_info',
        text: 'Great! I\'ll need a few details to set up your session.\n\nWhat\'s your name?',
        type: 'text',
        followUp: 'Nice to meet you! Now I need your email.',
        validation: (answer: string) => answer.length > 1
      },
      {
        id: 'email',
        text: 'What\'s your email address?',
        type: 'text',
        followUp: 'Perfect! One of our architects will contact you shortly.',
        validation: (answer: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(answer.trim());
        }
      },
      {
        id: 'company_optional',
        text: 'Company name? (Optional)',
        type: 'text',
        followUp: 'Got it! Thanks for that info.',
        validation: () => true
      },
      {
        id: 'preferred_time',
        text: 'When would you prefer to meet?',
        type: 'multiple-choice',
        options: [
          'This week',
          'Next week',
          'Within 2 weeks',
          'I\'m flexible'
        ],
        followUp: 'Thanks! You\'re all set. One of our architects will meet you soon. You\'ll get an invite shortly 📅.\n\nExcited to start building with you 🚀'
      }
    ]
  }
];

export const ConversationEngine: React.FC<ConversationEngineProps> = ({ onComplete }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const navigate = useNavigate();
  
  const [currentWave, setCurrentWave] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showingFollowUp, setShowingFollowUp] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true); // New state for cursor
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true); // Bot typing indicator
  const [typingDots, setTypingDots] = useState('');
  

  const currentWaveData = CONVERSATION_WAVES[currentWave];
  const currentQuestionData = currentWaveData?.questions[currentQuestion];

  // Debug: Log the current state (removed to prevent infinite loops)

  const GENERATION_STEPS = [
    'ANALYZING YOUR PROJECT REQUIREMENTS...',
    'ASSEMBLING THE PERFECT BOT TEAM...',
    'GENERATING TECHNICAL SCOPE DOCUMENT...',
    'PREPARING CUSTOM QUOTE & TIMELINE...',
    'READY TO MEET & DISCUSS! 🚀'
  ];

  const playNavigationSound = useCallback(async (direction: 'up' | 'down') => {
    await audio.playNavigationSound(direction);
  }, [audio]);

  const playSelectionSound = useCallback(async () => {
    await audio.playSelectionSound();
  }, [audio]);

  const playCompletionSound = useCallback(async () => {
    await audio.playCompletionSound();
  }, [audio]);

  const handleAbort = useCallback(async () => {
    await audio.playSelectionSound();
    
    // Show clearing message briefly
    setValidationMessage('Clearing project...');
    
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  }, [audio, navigate]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Typing indicator animation
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  // Bot typing simulation - show typing for 2 seconds then reveal message
  useEffect(() => {
    setIsTyping(true);
    setTypingDots('');
    
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentQuestionData?.id]); // Trigger when question changes

  // Early return if no valid data (but allow generation and completion states)
  if ((!currentWaveData || !currentQuestionData) && !isGenerating && !isComplete) {
    console.error('ConversationEngine Error: Missing wave or question data', {
      currentWave,
      currentQuestion,
      totalWaves: CONVERSATION_WAVES.length,
      waveData: currentWaveData,
      questionData: currentQuestionData
    });
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4 retro-scanlines">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-4xl font-retro-xl retro-glow-green">⚠️ DEBUG MODE</div>
          <div className="text-yellow-400 text-2xl font-retro-large">ConversationEngine Component Loaded</div>
          <div className="text-gray-400 text-sm font-mono">
            Wave: {currentWave} / Question: {currentQuestion}
          </div>
          <div className="text-gray-400 text-sm font-mono">
            Total Waves: {CONVERSATION_WAVES.length}
          </div>
          <button 
            onClick={() => {
              console.log('Resetting conversation...');
              setCurrentWave(0);
              setCurrentQuestion(0);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-retro-xl text-2xl transition-colors retro-glow-green"
          >
            RESET & START CONVERSATION
          </button>
          <div className="text-gray-500 text-xs mt-4 font-mono">
            If you can see this, the component is mounting correctly.
          </div>
        </div>
      </div>
    );
  }

  // Background music effect for generation - DISABLED
  // useEffect(() => {
  //   if (isGenerating) {
  //     // Start Pip-Boy style generation ambient sound
  //     audio.playGenerationAmbient();
  //   } else {
  //     // Stop generation ambient sound when complete
  //     audio.stopGenerationAmbient();
  //   }
  // }, [isGenerating, audio]);

  // Simple generation timer with setInterval
  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    // Start from step 0 and progress through all steps
    let currentStep = 0;
    const isDev = process.env.NODE_ENV === 'development';
    const stepDuration = isDev ? 2000 : 20000; // 2s dev, 20s production
    
    // Set initial step
    setGenerationStep(0);
    
    const interval = setInterval(() => {
      currentStep++;
      setGenerationStep(currentStep);
      
      // When we reach the end of generation steps
      if (currentStep >= GENERATION_STEPS.length) {
        clearInterval(interval);
        
        // Complete generation and navigate
        setTimeout(() => {
          playCompletionSound();
          
          // Navigate to completion summary page with data
          const completionData = {
            responses,
            waveData: {
              wave1: {},
              wave2: {},
              wave3: {},
              wave4: {}
            }
          };
          
          // Fill waveData with organized responses
          CONVERSATION_WAVES.forEach((wave, waveIndex) => {
            const waveKey = `wave${waveIndex + 1}` as keyof typeof completionData.waveData;
            wave.questions.forEach(question => {
              if (responses[question.id]) {
                completionData.waveData[waveKey][question.id] = responses[question.id];
              }
            });
          });
          
          navigate('/completion-summary', { state: completionData });
        }, 1000);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [isGenerating]);

  const proceedToNextQuestion = useCallback(() => {
    if (currentQuestion < currentWaveData.questions.length - 1) {
      // Next question in current wave
      setCurrentQuestion(prev => prev + 1);
    } else if (currentWave < CONVERSATION_WAVES.length - 1) {
      // Next wave
      setCurrentWave(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // All questions complete, start generation
      setIsGenerating(true);
      setGenerationStep(0);
    }
  }, [currentQuestion, currentWaveData.questions.length, currentWave]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestionData) return;

    let answer = '';
    let isValid = true;
    let message = '';
    
    if (currentQuestionData.type === 'multiple-choice') {
      answer = currentQuestionData.options?.[selectedOption] || '';
    } else if (currentQuestionData.type === 'text') {
      answer = userInput.trim();
      if (!answer && currentQuestionData.validation && !currentQuestionData.validation('')) {
        isValid = false;
        message = 'Please enter your answer before submitting.';
      } else if (currentQuestionData.validation && !currentQuestionData.validation(answer)) {
        isValid = false;
        if (currentQuestionData.id === 'email') {
          message = 'Please enter a valid email address.';
        } else if (currentQuestionData.id === 'main_problem') {
          message = 'Please provide a more detailed description (at least 10 characters).';
        } else if (currentQuestionData.id === 'unique_approach') {
          message = 'Please provide a more detailed explanation (at least 15 characters).';
        } else if (currentQuestionData.id === 'core_features') {
          message = 'Please list your features (use numbers or bullet points).';
        } else if (currentQuestionData.id === 'user_workflow') {
          message = 'Please provide a more detailed workflow description (at least 20 characters).';
        } else {
          message = 'Please provide a more detailed answer.';
        }
      }
    } else if (currentQuestionData.type === 'yes-no') {
      answer = selectedOption === 0 ? 'Yes' : 'No';
    }

    if (!isValid) {
      setValidationMessage(message);
      setTimeout(() => setValidationMessage(''), 3000);
      return;
    }

    if (!answer) return;

    await playSelectionSound();
    
    // Store response
    setResponses(prev => ({
      ...prev,
      [currentQuestionData.id]: answer
    }));

    // Show follow-up
    if (currentQuestionData.followUp) {
      setShowingFollowUp(true);
      setTimeout(() => {
        setShowingFollowUp(false);
        proceedToNextQuestion();
      }, 2500);
    } else {
      proceedToNextQuestion();
    }

    // Reset input
    setUserInput('');
    setSelectedOption(0);
    setValidationMessage('');
  }, [currentQuestionData, selectedOption, userInput, playSelectionSound, proceedToNextQuestion]);

  // Handle keyboard navigation for multiple choice - moved after handleSubmitAnswer
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!currentQuestionData || showingFollowUp) return;

      if (currentQuestionData.type === 'multiple-choice') {
        if (event.key === 'ArrowUp' && selectedOption > 0) {
          setSelectedOption(prev => prev - 1);
          playNavigationSound('up');
        } else if (event.key === 'ArrowDown' && selectedOption < (currentQuestionData.options?.length || 0) - 1) {
          setSelectedOption(prev => prev + 1);
          playNavigationSound('down');
        } else if (event.key === 'Enter') {
          handleSubmitAnswer();
        }
      } else if (event.key === 'Enter' && currentQuestionData.type !== 'text') {
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionData, selectedOption, showingFollowUp, playNavigationSound, handleSubmitAnswer]);

  const completeConversation = () => {
    const waveData = {
      wave1: {},
      wave2: {},
      wave3: {},
      wave4: {}
    };

    // Organize responses by wave
    CONVERSATION_WAVES.forEach((wave, waveIndex) => {
      const waveKey = `wave${waveIndex + 1}` as keyof typeof waveData;
      wave.questions.forEach(question => {
        if (responses[question.id]) {
          waveData[waveKey][question.id] = responses[question.id];
        }
      });
    });

    onComplete({
      responses,
      waveData
    });
  };

  if (isGenerating) {
    const isDev = process.env.NODE_ENV === 'development';
    const totalTime = isDev ? '10 seconds' : '2-3 minutes';
    
    return (
      <div className="relative min-h-screen bg-black text-white">
        {/* Abort button - always visible in bottom-left */}
        <button
          onClick={handleAbort}
          className="fixed bottom-4 left-4 z-50 bg-transparent border border-red-400/30 text-red-400/60 px-3 py-2 text-xs font-mono hover:border-red-400 hover:text-red-400 transition-all duration-300 hover:bg-red-400/10"
          title="Abort and return to website"
        >
          ⏸ ABORT
        </button>

        <div className="min-h-screen flex items-center justify-center retro-scanlines">
          <div className="space-y-6 text-center max-w-3xl mx-auto" dir="ltr">
          <div className="text-green-300 text-4xl mb-4 font-retro-xl retro-glow-green">
            ⚡ PROCESSING YOUR PROJECT
          </div>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <img 
            src="/robot-favicon.svg" 
            alt="Fellow Bot" 
            className="w-8 h-8 animate-pulse"
          />
          <div className="text-amber-300 text-xl font-retro-light">
            My fellow bots are reviewing your requirements... ({totalTime} estimated)
          </div>
        </div>
        
        <div className="space-y-4">
          {GENERATION_STEPS.slice(0, generationStep).map((step, index) => (
            <div key={index} className="flex items-center justify-center space-x-4">
              <span className="text-amber-400 font-retro-light text-xl retro-glow-amber">{step}</span>
              <span className="text-green-300 retro-glow-green">✓</span>
            </div>
          ))}
          
          {generationStep < GENERATION_STEPS.length && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-amber-400 font-retro-light text-xl retro-glow-amber">{GENERATION_STEPS[generationStep]}</span>
              <div className="w-3 h-5 inline-block ml-2">
                {showCursor && <div className="w-full h-full text-green-400 retro-cursor">█</div>}
              </div>
            </div>
          )}
          
          {generationStep >= GENERATION_STEPS.length && (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-green-400 font-retro-light text-xl retro-glow-green">BOT ANALYSIS COMPLETE - SCHEDULING MEETING...</span>
              <span className="text-green-300 retro-glow-green">✓</span>
            </div>
          )}
        </div>
        
        <div className="text-gray-400 text-sm mt-8 font-retro">
          {generationStep < GENERATION_STEPS.length 
            ? `Phase ${generationStep + 1} of ${GENERATION_STEPS.length}`
            : `Analysis Complete`
          }
        </div>
        
        <div className="text-gray-500 text-xs mt-4 font-retro">
          {isDev ? 'Development mode: Fast bot analysis' : 'Bot team analyzing & preparing your custom solution...'}
        </div>
        
        {/* Clearing message */}
        {validationMessage === 'Clearing project...' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
            <div className="text-red-400 text-xl font-mono">
              🗑️ CLEARING PROJECT...
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
    );
  }

  if (isComplete) {
    const userEmail = responses['email'] || 'your email';
    
    return (
      <div className="relative min-h-screen bg-black text-white">
        {/* Abort button - always visible in bottom-left */}
        <button
          onClick={handleAbort}
          className="fixed bottom-4 left-4 z-50 bg-transparent border border-red-400/30 text-red-400/60 px-3 py-2 text-xs font-mono hover:border-red-400 hover:text-red-400 transition-all duration-300 hover:bg-red-400/10"
          title="Abort and return to website"
        >
          ⏸ ABORT
        </button>

        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-8 text-center max-w-4xl mx-auto" dir="ltr">
        {/* Success Header */}
        <div className="space-y-4">
          <div className="text-green-300 text-2xl font-mono">
            🎉 PROJECT PACKAGE COMPLETE!
          </div>
          <div className="text-amber-300 text-lg">
            MISSION ACCOMPLISHED • PACKAGE DELIVERED
          </div>
        </div>

        {/* Detailed completion message */}
        <div className="space-y-6 text-left bg-green-900/20 border border-green-400/30 p-6 rounded">
          <div className="text-green-300 text-lg font-mono mb-4">
            📦 DELIVERY CONFIRMATION
          </div>
          
          <div className="space-y-3 text-amber-200">
            <div className="flex items-center space-x-3">
              <span className="text-green-300">✓</span>
              <span>Project Requirements Document (PRD) generated</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-300">✓</span>
              <span>Technical architecture diagrams created</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-300">✓</span>
              <span>Working prototype built and tested</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-300">✓</span>
              <span>UI/UX design mockups generated</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-300">✓</span>
              <span>Development cost estimates calculated</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-300">✓</span>
              <span>Complete project package prepared</span>
            </div>
          </div>
        </div>

        {/* Email delivery info */}
        <div className="bg-amber-900/20 border border-amber-400/30 p-4 rounded">
          <div className="text-amber-300 font-mono text-lg mb-2">
            📧 DELIVERY STATUS
          </div>
          <div className="text-amber-200">
            Your complete project package has been sent to: <strong>{userEmail}</strong>
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Expected delivery: Within 24 hours • Check spam folder if not received
          </div>
        </div>

        {/* Close button */}
        <div className="space-y-4">
          <button
            onClick={() => {
              // Call the onComplete callback to redirect
              onComplete({
                responses,
                waveData: {
                  wave1: {},
                  wave2: {},
                  wave3: {},
                  wave4: {}
                }
              });
            }}
            className="bg-transparent border-2 border-green-400 text-green-400 px-8 py-3 text-lg font-mono hover:bg-green-400 hover:text-black transition-colors duration-200"
          >
            CLOSE TERMINAL
          </button>
          
          <div className="text-gray-500 text-sm">
            You will be redirected to our main application
          </div>
        </div>

        {/* Terminal-style footer */}
        <div className="text-green-400 text-xs font-mono opacity-60 border-t border-green-400/20 pt-4">
          m8s.ai • AI Project Validation System • Session Complete
        </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Abort button - always visible in bottom-left */}
      <button
        onClick={handleAbort}
        className="fixed bottom-4 left-4 z-50 bg-transparent border border-red-400/30 text-red-400/60 px-3 py-2 text-xs font-mono hover:border-red-400 hover:text-red-400 transition-all duration-300 hover:bg-red-400/10"
        title="Abort and return to website"
      >
        ⏸ ABORT
      </button>

      <div className="min-h-screen flex items-center justify-center p-4 retro-scanlines">
        <div className="w-full max-w-4xl mx-auto space-y-6" dir="ltr">
          {/* Wave indicator */}
          <div className="text-green-300 text-2xl text-center font-retro-xl retro-glow-green">
            {currentWave + 1}/4: {currentWaveData.name}
          </div>

          {/* Bot Message with Avatar */}
          <div className="flex items-start gap-4 w-full max-w-3xl mx-auto">
            {/* Bot Avatar */}
            <div className="flex-shrink-0 mt-1">
              <img 
                src="/robot-favicon-white.svg" 
                alt="Aria Bot" 
                className="w-12 h-12 rounded-full border-2 border-green-400/30 bg-black/20 p-2"
              />
            </div>
            
            {/* Bot Message Bubble */}
            <div className="flex-1">
              <div className="relative bg-black/40 border border-green-400/30 rounded-lg rounded-tl-none p-6 backdrop-blur-sm">
                {/* Chat bubble tail */}
                <div className="absolute -left-2 top-4 w-4 h-4 bg-black/40 border-l border-b border-green-400/30 transform rotate-45"></div>
                
                <div className="text-amber-300 text-2xl leading-relaxed font-retro-light retro-glow-amber whitespace-pre-line">
                  {isTyping ? (
                    <span className="text-gray-400 font-retro text-lg">
                      Aria is typing{typingDots}
                      <span className="retro-cursor">█</span>
                    </span>
                  ) : (
                    currentQuestionData.text
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up message */}
          {showingFollowUp && (
            <div className="flex items-start gap-4 w-full max-w-3xl mx-auto">
              {/* Bot Avatar */}
              <div className="flex-shrink-0 mt-1">
                <img 
                  src="/robot-favicon-white.svg" 
                  alt="Aria Bot" 
                  className="w-12 h-12 rounded-full border-2 border-green-400/30 bg-black/20 p-2"
                />
              </div>
              
              {/* Follow-up Message Bubble */}
              <div className="flex-1">
                <div className="relative bg-black/40 border border-green-400/30 rounded-lg rounded-tl-none p-4 backdrop-blur-sm">
                  {/* Chat bubble tail */}
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-black/40 border-l border-b border-green-400/30 transform rotate-45"></div>
                  
                  <div className="text-green-300 text-xl italic font-retro-light retro-glow-green whitespace-pre-line">
                    {currentQuestionData.followUp}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Answer interface */}
          {!showingFollowUp && !isTyping && (
            <div className="space-y-4 w-full max-w-3xl mx-auto">
          {currentQuestionData.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestionData.options?.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    selectedOption === index 
                      ? 'border-green-400 bg-green-400/10 retro-glow-green' 
                      : 'border-gray-600 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <span className={`font-retro-light text-xl ${selectedOption === index ? 'text-green-300 retro-glow-green' : 'text-gray-300'}`}>
                    {selectedOption === index ? '> ' : '  '}{option}
                  </span>
                </div>
              ))}
              
              {/* Mobile navigation buttons */}
              <div className="flex justify-center space-x-4 mt-4 md:hidden">
                <button
                  onClick={() => {
                    if (selectedOption > 0) {
                      setSelectedOption(selectedOption - 1);
                      playNavigationSound('up');
                    }
                  }}
                  disabled={selectedOption === 0}
                  className="bg-transparent border border-green-400 text-green-400 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 hover:text-black transition-colors duration-200"
                >
                  ↑
                </button>
                <button
                  onClick={() => {
                    if (selectedOption < (currentQuestionData.options?.length || 0) - 1) {
                      setSelectedOption(selectedOption + 1);
                      playNavigationSound('down');
                    }
                  }}
                  disabled={selectedOption === (currentQuestionData.options?.length || 0) - 1}
                  className="bg-transparent border border-green-400 text-green-400 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 hover:text-black transition-colors duration-200"
                >
                  ↓
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  className="bg-transparent border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors duration-200"
                >
                  ENTER
                </button>
              </div>
              
              <div className="text-gray-400 text-lg mt-4 font-retro">
                <span className="hidden md:inline retro-glow-cyan">Use ↑↓ arrows to navigate, Enter to select</span>
                <span className="md:hidden retro-glow-cyan">Use buttons below or tap options to navigate</span>
              </div>
            </div>
          )}

          {currentQuestionData.type === 'text' && (
            <div className="space-y-4 relative px-4 md:px-0">
              <div className="w-full p-4 bg-transparent text-green-300 min-h-[60px] flex items-center justify-start border border-green-400/30 rounded">
                <div className="flex items-center w-full">
                  <span className="whitespace-pre-wrap text-2xl font-retro-light leading-relaxed">{userInput}</span>
                  <span className="inline-block w-4 h-6 ml-0 flex-shrink-0">
                    {showCursor && <div className="w-full h-full text-green-400 retro-cursor">█</div>}
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  setValidationMessage(''); // Clear validation message when typing
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (e.altKey) {
                      // Alt+Enter: Add new line and move cursor to start of new line
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      const cursorPosition = input.selectionStart || 0;
                      const beforeCursor = userInput.substring(0, cursorPosition);
                      const afterCursor = userInput.substring(cursorPosition);
                      const newText = beforeCursor + '\n' + afterCursor;
                      setUserInput(newText);
                      
                      // Move cursor to start of new line (after the \n)
                      setTimeout(() => {
                        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                      }, 0);
                    } else if (userInput.trim()) {
                      // Enter: Submit answer
                      handleSubmitAnswer();
                    }
                  }
                }}
                className="absolute top-0 left-0 w-full h-[60px] opacity-0 cursor-text z-10 font-retro-light text-2xl"
                autoFocus
              />
              {validationMessage && (
                <div className="text-red-400 text-lg font-retro text-center">
                  ⚠️ {validationMessage}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked!', { userInput: userInput.trim() });
                  handleSubmitAnswer();
                }}
                disabled={!userInput.trim() && currentQuestionData.validation && !currentQuestionData.validation('')}
                className="bg-transparent border border-green-400 text-green-400 px-6 py-3 text-2xl font-retro retro-glow-green hover:bg-green-400 hover:text-black disabled:opacity-50 transition-colors duration-200 touch-manipulation relative z-20"
              >
                Submit Answer
              </button>
            </div>
          )}

          {currentQuestionData.type === 'yes-no' && (
            <div className="space-y-2">
              {['Yes', 'No'].map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    selectedOption === index 
                      ? 'border-green-400 bg-green-400/10' 
                      : 'border-gray-600 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <span className={selectedOption === index ? 'text-green-300' : 'text-gray-300'}>
                    {selectedOption === index ? '> ' : '  '}{option}
                  </span>
                </div>
              ))}
              
              {/* Mobile navigation buttons */}
              <div className="flex justify-center space-x-4 mt-4 md:hidden">
                <button
                  onClick={() => {
                    if (selectedOption > 0) {
                      setSelectedOption(selectedOption - 1);
                      playNavigationSound('up');
                    }
                  }}
                  disabled={selectedOption === 0}
                  className="bg-transparent border border-green-400 text-green-400 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 hover:text-black transition-colors duration-200"
                >
                  ↑
                </button>
                <button
                  onClick={() => {
                    if (selectedOption < 1) {
                      setSelectedOption(selectedOption + 1);
                      playNavigationSound('down');
                    }
                  }}
                  disabled={selectedOption === 1}
                  className="bg-transparent border border-green-400 text-green-400 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 hover:text-black transition-colors duration-200"
                >
                  ↓
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  className="bg-transparent border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors duration-200"
                >
                  ENTER
                </button>
              </div>
              
              <div className="text-gray-400 text-lg mt-4 font-retro">
                <span className="hidden md:inline retro-glow-cyan">Use ↑↓ arrows to navigate, Enter to select</span>
                <span className="md:hidden retro-glow-cyan">Use buttons below or tap options to navigate</span>
              </div>
            </div>
            )}
            </div>
          )}

          {/* Progress indicator */}
          {!isTyping && (
            <div className="text-gray-400 text-xl text-center font-retro">
              Question {currentQuestion + 1}/{currentWaveData.questions.length}
            </div>
          )}

          {/* Dev only: Skip to generation button */}
          {process.env.NODE_ENV === 'development' && !showingFollowUp && !isTyping && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsGenerating(true);
                  setGenerationStep(0);
                }}
                className="bg-transparent border border-red-400 text-red-400 px-4 py-2 text-xl font-retro hover:bg-red-400 hover:text-black transition-colors duration-200"
              >
                DEV: SKIP TO GENERATION
              </button>
            </div>
          )}


          {/* Clearing message */}
          {validationMessage === 'Clearing project...' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
              <div className="text-red-400 text-xl font-mono">
                🗑️ CLEARING PROJECT...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};