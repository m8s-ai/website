import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { CTASection } from "@/components/sections/CTASection";
import { PublicHeader } from "@/components/PublicHeader";
import { TerminalExperience } from "@/components/TerminalExperience";
import { ConversationEngine } from "@/components/ConversationEngine";
import { LaunchButton } from "@/components/LaunchButton";
import { TerminalPreview } from "@/components/TerminalPreview";

const STORAGE_KEY = "site_authenticated";

export const HomePage = () => {
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(() => {
    // FORCE TERMINAL FOR TESTING - Show terminal for ALL visitors
    if (typeof window === "undefined") return true; // Server-side default
    
    // Clear any existing terminal experience flag to force terminal
    sessionStorage.removeItem("terminal_experienced");
    
    const isAuthenticated = sessionStorage.getItem(STORAGE_KEY) === "true";
    const hasExperiencedTerminal = false; // Force terminal for now
    
    console.log('FORCING TERMINAL - Initial state check:', { 
      isAuthenticated, 
      hasExperiencedTerminal, 
      shouldShowTerminal: true // Always show terminal for testing
    });
    
    return true; // Always show terminal for testing
  });

  const [showConversation, setShowConversation] = useState(false);
  const [conversationData, setConversationData] = useState<any>(null);
  const [showTerminalOverlay, setShowTerminalOverlay] = useState(false);

  const [isAuthenticated] = useState(() => {
    return typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "true";
  });

  const handleTerminalComplete = () => {
    // Terminal experience complete, stop navigating to app-builder and show conversation
    console.log('Terminal complete, showing conversation component');
    sessionStorage.setItem("terminal_experienced", "true");
    setShowTerminal(false); // Hide terminal
    setShowConversation(true); // Show conversation
  };

  const handleTerminalPreviewExpand = () => {
    // Handle terminal preview expansion to overlay
    console.log('Terminal preview expanding to overlay');
    setShowTerminalOverlay(true);
  };

  const handleTerminalOverlayClose = () => {
    // Handle terminal overlay close
    console.log('Terminal overlay closing');
    setShowTerminalOverlay(false);
  };

  // Handle escape key for terminal overlay
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showTerminalOverlay) {
        handleTerminalOverlayClose();
      }
    };

    if (showTerminalOverlay) {
      window.addEventListener('keydown', handleEscapeKey);
      return () => {
        window.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showTerminalOverlay]);

  // Debug logging
  console.log('HomePage render:', { showTerminal, isAuthenticated, showConversation, hasConversationData: !!conversationData });

  // Show results summary page
  if (conversationData && !showConversation && !showTerminal) {
    console.log('Rendering results summary');
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="space-y-8 text-center max-w-5xl mx-auto p-8" dir="ltr">
          {/* Header */}
          <div className="space-y-4">
            <div className="text-green-300 text-3xl font-mono">
              🎯 PROJECT ANALYSIS COMPLETE
            </div>
            <div className="text-amber-300 text-lg">
              Here's what we discovered about your project
            </div>
          </div>

          {/* Project Summary Based on Responses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Overview */}
            <div className="bg-green-900/20 border border-green-400/30 p-6 rounded text-left">
              <div className="text-green-300 text-xl font-mono mb-4">
                📋 PROJECT OVERVIEW
              </div>
              <div className="space-y-3 text-amber-200">
                <div>
                  <strong className="text-green-300">Type:</strong> {conversationData.responses.project_type || 'Not specified'}
                </div>
                <div>
                  <strong className="text-green-300">Problem:</strong> {conversationData.responses.main_problem || 'Not specified'}
                </div>
                <div>
                  <strong className="text-green-300">Target Audience:</strong> {conversationData.responses.target_audience || 'Not specified'}
                </div>
                <div>
                  <strong className="text-green-300">Urgency Level:</strong> {conversationData.responses.urgency || 'Not specified'}
                </div>
              </div>
            </div>

            {/* Technical Approach */}
            <div className="bg-blue-900/20 border border-blue-400/30 p-6 rounded text-left">
              <div className="text-blue-300 text-xl font-mono mb-4">
                ⚡ TECHNICAL APPROACH
              </div>
              <div className="space-y-3 text-amber-200">
                <div>
                  <strong className="text-blue-300">Platform:</strong> {conversationData.responses.platform_priority || 'Not specified'}
                </div>
                <div>
                  <strong className="text-blue-300">Data Storage:</strong> {conversationData.responses.data_requirements || 'Not specified'}
                </div>
                <div>
                  <strong className="text-blue-300">User Accounts:</strong> {conversationData.responses.user_accounts || 'Not specified'}
                </div>
                <div>
                  <strong className="text-blue-300">Offline Support:</strong> {conversationData.responses.offline_capability || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* What We Generated */}
          <div className="bg-amber-900/20 border border-amber-400/30 p-6 rounded">
            <div className="text-amber-300 text-xl font-mono mb-4">
              📦 GENERATED DELIVERABLES
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-green-300">✓</span>
                  <span>Project Requirements Document (PRD)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-300">✓</span>
                  <span>Technical Architecture Diagrams</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-300">✓</span>
                  <span>User Experience Flow Charts</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-green-300">✓</span>
                  <span>Working Prototype Mockups</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-300">✓</span>
                  <span>Development Cost Estimates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-300">✓</span>
                  <span>Launch Strategy Recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Strategy */}
          <div className="bg-purple-900/20 border border-purple-400/30 p-6 rounded">
            <div className="text-purple-300 text-xl font-mono mb-4">
              🚀 BUSINESS STRATEGY
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-left text-amber-200">
              <div>
                <div><strong className="text-purple-300">Success Metric:</strong> {conversationData.responses.success_metric || 'Not specified'}</div>
                <div className="mt-2"><strong className="text-purple-300">Timeline Driver:</strong> {conversationData.responses.timeline_urgency || 'Not specified'}</div>
              </div>
              <div>
                <div><strong className="text-purple-300">Budget Range:</strong> {conversationData.responses.budget_range || 'Not specified'}</div>
                <div className="mt-2"><strong className="text-purple-300">Main Concern:</strong> {conversationData.responses.biggest_concern || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-gray-900/40 border border-gray-400/30 p-4 rounded">
            <div className="text-gray-300 text-lg font-mono mb-2">
              📧 DELIVERY CONFIRMATION
            </div>
            <div className="text-gray-400">
              Complete project package sent to: <strong className="text-green-300">{conversationData.responses.email || 'your email'}</strong>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Expected delivery: Within 24 hours
            </div>
          </div>

          {/* Close Button */}
          <div className="space-y-4 pt-4">
            <button
              onClick={() => navigate('/terminal')}
              className="bg-transparent border-2 border-green-400 text-green-400 px-8 py-3 text-lg font-mono hover:bg-green-400 hover:text-black transition-colors duration-200"
            >
              EXPLORE MORE SOLUTIONS
            </button>
            
            <div className="text-gray-500 text-sm">
              Continue to our terminal interface
            </div>
          </div>

          {/* Footer */}
          <div className="text-green-400 text-xs font-mono opacity-60 border-t border-green-400/20 pt-4">
            m8s.ai • AI Project Validation System • Analysis Complete
          </div>
        </div>
      </div>
    );
  }

  // Show terminal for new visitors
  if (showTerminal) {
    console.log('Rendering terminal experience');
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <TerminalExperience 
          onComplete={handleTerminalComplete}
          isLoggedIn={isAuthenticated}
        />
      </div>
    );
  } else if (showConversation) {
    console.log('Rendering conversation engine');
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <ConversationEngine onComplete={(data) => {
          console.log("Conversation completed! Showing results");
          setConversationData(data);
          setShowConversation(false); // Hide conversation, show results
        }} />
      </div>
    );
  }

  // Show main website with optional launch button for authenticated users
  return (
    <div className="min-h-screen">
      <PublicHeader>
        {isAuthenticated && (
          <LaunchButton 
            username="User" // TODO: Get actual username from auth context
            onTerminalComplete={() => {
              // Handle post-terminal actions for authenticated users
              console.log("Terminal completed for authenticated user");
            }}
          />
        )}
      </PublicHeader>
      <main>
        <HeroSection />
        <TerminalPreview onExpand={handleTerminalPreviewExpand} />
        <ServicesSection />
        <OutcomesSection />
        <IndustriesSection />
        <ProcessSection />
        <TrustSection />
        <CTASection />
      </main>

      {/* Terminal Overlay */}
      {showTerminalOverlay && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-black border border-gray-600 rounded-lg shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleTerminalOverlayClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
              aria-label="Close terminal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Terminal content */}
            <div className="w-full h-full rounded-lg overflow-hidden">
              <TerminalExperience 
                onComplete={() => {
                  // Handle terminal completion in overlay
                  setShowTerminalOverlay(false);
                  setShowConversation(true);
                }}
                isLoggedIn={isAuthenticated}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};