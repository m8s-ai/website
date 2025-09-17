
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatWindowProvider } from "@/contexts/ChatWindowContext";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import { TerminalWebsite } from "./components/TerminalWebsite";
import { CompletionSummaryPage } from "./pages/CompletionSummaryPage";
import ClaudeFlowApp from "./pages/claude-flow/ClaudeFlowApp";
import Debug from "./pages/Debug";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";



const queryClient = new QueryClient();

const App = () => {
  

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Claude Flow Routes - Protected with Authentication */}
                    <Route path="/app/*" element={
                      <ProtectedRoute>
                        <ClaudeFlowApp />
                      </ProtectedRoute>
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
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
