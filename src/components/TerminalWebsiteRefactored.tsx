import React, { useState, useCallback } from 'react';
import { useAudioManager } from './AudioManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTerminalMode } from '@/hooks/useTerminalMode';
import { useWebsiteAnalytics } from '@/hooks/useWebsiteAnalytics';
import { TerminalNavigation } from './terminal/TerminalNavigation';
import { TerminalSectionRenderer } from './terminal/TerminalSectionRenderer';
import { TerminalModal } from './terminal/TerminalModal';

interface TerminalWebsiteProps {
  className?: string;
}

const NAVIGATION_SECTIONS = [
  { id: "home", command: "Home", label: "Overview" },
  { id: "services", command: "Services", label: "What we do" },
  { id: "pricing", command: "Pricing", label: "Plans" },
  { id: "contact", command: "Contact", label: "Get in touch" },
  { id: "about", command: "About", label: "Our story" }
];

export const TerminalWebsiteRefactored: React.FC<TerminalWebsiteProps> = ({ className = "" }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const { isRTL } = useLanguage();
  const { currentMode, setMode } = useTerminalMode();
  const { sessionStartTime, trackNavigation, trackCTAClick } = useWebsiteAnalytics();
  
  const [activeSection, setActiveSection] = useState('home');
  const [showTerminalModal, setShowTerminalModal] = useState(false);

  const handleNavigation = useCallback(async (sectionId: string) => {
    trackNavigation(sectionId, activeSection);
    await audio.playSelectionSound();
    setActiveSection(sectionId);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [audio, activeSection, trackNavigation]);

  const handleStartProject = useCallback(async () => {
    trackCTAClick('start_project', 'hero_section', activeSection);
    await audio.playSelectionSound();
    
    // Open the terminal modal in project mode
    setMode('project');
    setShowTerminalModal(true);
  }, [audio, activeSection, trackCTAClick, setMode]);

  const handleLearnMoreAboutM8s = useCallback(async () => {
    trackCTAClick('learn_more_about_m8s', 'hero_section', activeSection);
    await audio.playSelectionSound();
    
    // Open the terminal modal in Q&A mode
    setMode('qa');
    setShowTerminalModal(true);
  }, [audio, activeSection, trackCTAClick, setMode]);

  const handleTerminalPreviewExpand = useCallback(() => {
    console.log('Terminal preview expanding to modal');
    setShowTerminalModal(true);
  }, []);

  const handleTerminalModalClose = useCallback(() => {
    console.log('Terminal modal closing');
    setShowTerminalModal(false);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Floating neon orbs - subtle version */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-400/8 to-purple-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-purple-400/6 to-emerald-400/6 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping" 
             style={{ animationDuration: '4s', animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" 
             style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" 
             style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>
      
      {/* Navigation */}
      <TerminalNavigation 
        sections={NAVIGATION_SECTIONS}
        activeSection={activeSection}
        onNavigate={handleNavigation}
      />
      
      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <div className="container mx-auto px-6">
          <div className="min-h-screen flex flex-col">
            {/* Section Content */}
            <section id={activeSection} className="flex-1 py-8">
              <TerminalSectionRenderer
                sectionId={activeSection}
                onStartProject={handleStartProject}
                onLearnMore={handleLearnMoreAboutM8s}
                onTerminalPreviewExpand={handleTerminalPreviewExpand}
                sessionStartTime={sessionStartTime}
                audio={audio}
              />
            </section>
            
            {/* All sections for smooth scrolling */}
            {NAVIGATION_SECTIONS.slice(1).map((section) => (
              <section key={section.id} id={section.id} className="py-8">
                <TerminalSectionRenderer
                  sectionId={section.id}
                  onStartProject={handleStartProject}
                  onLearnMore={handleLearnMoreAboutM8s}
                  onTerminalPreviewExpand={handleTerminalPreviewExpand}
                  sessionStartTime={sessionStartTime}
                  audio={audio}
                />
              </section>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              m8s.ai • Advanced Project Validation Systems • Est. 2024
            </div>
          </div>
        </div>
      </footer>

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={showTerminalModal}
        mode={currentMode}
        onClose={handleTerminalModalClose}
        onComplete={() => {
          // Handle terminal completion - could show success message or navigate
          console.log('ARIA terminal completed');
          setShowTerminalModal(false);
        }}
      />
    </div>
  );
};