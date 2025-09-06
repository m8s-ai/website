import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioManager } from './AudioManager';

interface TerminalWebsiteProps {
  className?: string;
}

const NAVIGATION_SECTIONS = [
  { id: "home", command: "> HOME", label: "System Overview" },
  { id: "services", command: "> SERVICES", label: "Available Protocols" },
  { id: "pricing", command: "> PRICING", label: "Service Costs" },
  { id: "contact", command: "> CONTACT", label: "Communication Channel" },
  { id: "about", command: "> ABOUT", label: "System Information" }
];

const PRICING_TIERS = [
  {
    name: "STARTER PROTOCOL",
    price: "$2,999",
    period: "/project",
    features: [
      "Basic project validation",
      "Technical documentation", 
      "Simple prototype",
      "Cost estimation"
    ],
    highlight: false
  },
  {
    name: "PROFESSIONAL MATRIX",
    price: "$7,999", 
    period: "/project",
    features: [
      "Advanced AI validation",
      "Complete technical specs",
      "Interactive prototype",
      "Full cost breakdown",
      "Launch strategy"
    ],
    highlight: true
  },
  {
    name: "ENTERPRISE NEXUS",
    price: "Custom",
    period: "/contact",
    features: [
      "Full-scale validation",
      "Enterprise architecture",
      "Production-ready prototype",
      "Team integration",
      "Ongoing support"
    ],
    highlight: false
  }
];

const SERVICES_DATA = [
  {
    title: "PROJECT VALIDATION MATRIX",
    description: "AI-powered analysis of your project concept through our 4-wave methodology",
    features: ["Feasibility Analysis", "Market Research", "Technical Assessment", "Risk Evaluation"]
  },
  {
    title: "PROTOTYPE GENERATION",
    description: "Rapid development of working prototypes and proof-of-concepts",
    features: ["Interactive Mockups", "Technical Demos", "User Flow Testing", "Performance Analysis"]
  },
  {
    title: "DEVELOPMENT ARCHITECTURE",
    description: "Complete technical specifications and implementation roadmaps",
    features: ["System Design", "Database Architecture", "API Specifications", "Deployment Strategy"]
  }
];

const TYPEWRITER_MESSAGES = [
  "INITIALIZING M8S SYSTEMS...",
  "LOADING NEURAL NETWORKS...",
  "CALIBRATING AI PROTOCOLS...",
  "SYSTEM READY FOR OPERATION..."
];

const TerminalCursor: React.FC<{ show: boolean }> = ({ show }) => (
  <span className="inline-block w-3 h-5 ml-1">
    {show && <div className="bg-green-400 w-full h-full"></div>}
  </span>
);

export const TerminalWebsite: React.FC<TerminalWebsiteProps> = ({ className = "" }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const [activeSection, setActiveSection] = useState('home');
  const [showCursor, setShowCursor] = useState(true);
  const [headerText, setHeaderText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for header
  useEffect(() => {
    if (currentMessageIndex < TYPEWRITER_MESSAGES.length) {
      const currentMessage = TYPEWRITER_MESSAGES[currentMessageIndex];
      
      if (currentCharIndex < currentMessage.length) {
        const timer = setTimeout(() => {
          setHeaderText(prev => prev + currentMessage[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
          // Play typing sound
          if (currentMessage[currentCharIndex] !== ' ') {
            audio.playTypingSound();
          }
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Message complete, wait then move to next
        const timer = setTimeout(() => {
          if (currentMessageIndex < TYPEWRITER_MESSAGES.length - 1) {
            setCurrentMessageIndex(prev => prev + 1);
            setCurrentCharIndex(0);
            setHeaderText('');
          } else {
            // All messages complete
            setIsTyping(false);
            setHeaderText('WELCOME TO M8S SYSTEMS');
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMessageIndex, currentCharIndex, audio]);

  const handleNavigation = useCallback(async (sectionId: string) => {
    await audio.playSelectionSound();
    setActiveSection(sectionId);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [audio]);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'home':
        return (
          <div className="space-y-8" dir="ltr">
            <div className="text-center space-y-4">
              <div className="text-2xl md:text-4xl font-mono text-green-300">
                {isTyping ? headerText : "WELCOME TO M8S SYSTEMS"}
                <TerminalCursor show={showCursor} />
              </div>
              <div className="text-amber-300 text-lg max-w-3xl mx-auto leading-relaxed">
                Advanced AI-powered project validation and development platform.
                Transform your ideas into reality with military-grade precision.
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-green-900/20 border border-green-400/30 p-6 rounded">
                <div className="text-green-300 font-mono text-lg mb-2">⚡ RAPID VALIDATION</div>
                <div className="text-amber-200">Deploy AI-powered analysis in under 24 hours</div>
              </div>
              <div className="bg-green-900/20 border border-green-400/30 p-6 rounded">
                <div className="text-green-300 font-mono text-lg mb-2">🎯 PRECISION TARGETING</div>
                <div className="text-amber-200">99.7% accuracy in project feasibility assessment</div>
              </div>
              <div className="bg-green-900/20 border border-green-400/30 p-6 rounded">
                <div className="text-green-300 font-mono text-lg mb-2">🚀 MISSION SUCCESS</div>
                <div className="text-amber-200">Complete project packages delivered on target</div>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-8" dir="ltr">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono text-green-300 mb-4">
                AVAILABLE PROTOCOLS
              </div>
              <div className="text-amber-300">
                Select your mission parameters
              </div>
            </div>
            
            <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
              {SERVICES_DATA.map((service, index) => (
                <div key={index} className="bg-black/40 border border-green-400/30 p-6 rounded">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-green-300 font-mono text-xl">{service.title}</div>
                    <div className="text-amber-400 font-mono">ONLINE</div>
                  </div>
                  <div className="text-amber-200 mb-4 leading-relaxed">
                    {service.description}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-8" dir="ltr">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono text-green-300 mb-4">
                SERVICE COSTS
              </div>
              <div className="text-amber-300">
                Mission pricing matrix
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {PRICING_TIERS.map((tier, index) => (
                <div 
                  key={index} 
                  className={`bg-black/40 border ${tier.highlight ? 'border-amber-400/50 shadow-[0_0_20px_rgba(255,176,0,0.2)]' : 'border-green-400/30'} p-6 rounded relative`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-400 text-black text-sm px-3 py-1 rounded font-mono">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`font-mono text-lg mb-2 ${tier.highlight ? 'text-amber-300' : 'text-green-300'}`}>
                      {tier.name}
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-400 font-mono">{tier.period}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {tier.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${tier.highlight ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      className={`w-full py-3 px-4 border font-mono transition-all duration-300 ${
                        tier.highlight 
                          ? 'border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black' 
                          : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                      }`}
                      onClick={() => handleNavigation('contact')}
                    >
                      INITIATE PROTOCOL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-8" dir="ltr">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono text-green-300 mb-4">
                COMMUNICATION CHANNEL
              </div>
              <div className="text-amber-300">
                Establish connection protocols
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/40 border border-green-400/30 p-8 rounded">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-green-300 font-mono text-xl mb-4">SYSTEM ADMINISTRATORS</div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-amber-400 font-mono mb-2">EMAIL PROTOCOL:</div>
                      <div className="text-white">contact@m8s.ai</div>
                    </div>
                    <div>
                      <div className="text-amber-400 font-mono mb-2">SECURE LINE:</div>
                      <div className="text-white">+1 (555) PROJECT</div>
                    </div>
                    <div>
                      <div className="text-amber-400 font-mono mb-2">RESPONSE TIME:</div>
                      <div className="text-white">&lt; 24 hours</div>
                    </div>
                    <div>
                      <div className="text-amber-400 font-mono mb-2">AVAILABILITY:</div>
                      <div className="text-white">24/7 Monitoring</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-green-400/20 pt-6 mt-6">
                    <div className="text-amber-400 font-mono mb-4">MISSION BRIEFING REQUEST:</div>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Ready to validate your project? Send us your mission parameters and we'll deploy 
                      our AI validation matrix within 24 hours. Include project type, target audience, 
                      and timeline for optimal results.
                    </div>
                    
                    <button 
                      className="w-full mt-6 py-3 px-4 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono transition-all duration-300"
                      onClick={async () => {
                        await audio.playSelectionSound();
                        window.location.href = 'mailto:contact@m8s.ai?subject=Mission Briefing Request';
                      }}
                    >
                      SEND TRANSMISSION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-8" dir="ltr">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono text-green-300 mb-4">
                SYSTEM INFORMATION
              </div>
              <div className="text-amber-300">
                Technical specifications
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-black/40 border border-green-400/30 p-6 rounded">
                <div className="text-green-300 font-mono text-xl mb-4">M8S NEURAL NETWORK</div>
                <div className="text-gray-300 leading-relaxed">
                  M8s (Mates) is an advanced AI-powered project validation platform engineered to eliminate 
                  the uncertainty in software development. Our neural networks analyze thousands of project 
                  variables to deliver precise feasibility assessments and implementation strategies.
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 border border-green-400/30 p-6 rounded">
                  <div className="text-amber-400 font-mono text-lg mb-4">TECHNICAL STACK</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">AI Engine:</span>
                      <span className="text-green-400">GPT-4 + Custom Models</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Processing:</span>
                      <span className="text-green-400">Real-time Analysis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Security:</span>
                      <span className="text-green-400">Military Grade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Uptime:</span>
                      <span className="text-green-400">99.9%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 border border-green-400/30 p-6 rounded">
                  <div className="text-amber-400 font-mono text-lg mb-4">MISSION STATS</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Projects Validated:</span>
                      <span className="text-green-400">1,247+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Success Rate:</span>
                      <span className="text-green-400">96.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg. Completion:</span>
                      <span className="text-green-400">18 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Client Satisfaction:</span>
                      <span className="text-green-400">99.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-black text-green-400 font-mono ${className}`}>
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 pointer-events-none" />
      
      {/* Terminal grid background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-green-400/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center space-y-2 md:space-y-0">
            <div className="text-green-300 font-mono font-bold text-xl">
              M8S://SYSTEMS
            </div>
            <div className="flex flex-wrap justify-center space-x-1 md:space-x-4">
              {NAVIGATION_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
                    activeSection === section.id 
                      ? 'text-amber-400 border-b-2 border-amber-400' 
                      : 'text-green-400 hover:text-amber-300'
                  }`}
                >
                  {section.command}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        <div className="container mx-auto px-6">
          <div className="min-h-screen flex flex-col">
            {/* Section Content */}
            <section id={activeSection} className="flex-1 py-16">
              {renderSection(activeSection)}
            </section>
            
            {/* All sections for smooth scrolling */}
            {NAVIGATION_SECTIONS.slice(1).map((section) => (
              <section key={section.id} id={section.id} className="py-16">
                {renderSection(section.id)}
              </section>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-green-400/20 bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-green-400 font-mono text-sm opacity-60" dir="ltr">
              M8S.AI • ADVANCED PROJECT VALIDATION SYSTEMS • EST. 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};