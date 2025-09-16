
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatWindowProvider } from "@/contexts/ChatWindowContext";
import { analyticsManager } from "@/utils/analyticsManager";
import NotFound from "./pages/NotFound";
import { Protected } from "./components/Protected";
import { TerminalWebsite } from "./components/TerminalWebsite";
import { CompletionSummaryPage } from "./pages/CompletionSummaryPage";
import ClaudeFlowApp from "./pages/claude-flow/ClaudeFlowApp";
import Debug from "./pages/Debug";



const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    analyticsManager.track('app_initialized', {
      app_version: import.meta.env.REACT_APP_VERSION || '1.0.0',
      environment: import.meta.env.NODE_ENV || 'development'
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <ChatWindowProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<TerminalWebsite />} />
                  <Route path="/home" element={<TerminalWebsite />} />
                  <Route path="/completion-summary" element={<CompletionSummaryPage />} />
                  <Route path="/debug" element={<Debug />} />
                  
                  {/* Claude Flow Routes - Protected */}
                  <Route path="/claude-flow/*" element={
                    <Protected>
                      <ClaudeFlowApp />
                    </Protected>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              {/* I'm disabling the assistant button for now */}
              {/* <AssistantButton /> */}
            </TooltipProvider>
          </ChatWindowProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
