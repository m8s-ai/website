import { useState } from "react";
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

  // Debug logging
  console.log('HomePage render:', { showTerminal, isAuthenticated, showConversation });

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
        <ConversationEngine onComplete={() => console.log("Conversation completed!")} />
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
        <ServicesSection />
        <OutcomesSection />
        <IndustriesSection />
        <ProcessSection />
        <TrustSection />
        <CTASection />
      </main>
    </div>
  );
};