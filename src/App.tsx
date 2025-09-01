
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HomePage } from "./pages/HomePage";
import { Marketplace } from "./pages/Marketplace";
import { AutomationDetail } from "./pages/AutomationDetail";
import { SolutionsPage } from "./pages/SolutionsPage";
import { IndustriesPage } from "./pages/IndustriesPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import { Protected } from "./components/Protected";
import { AssistantButton } from "./components/AssistantChat";


const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
            <Route path="/automation/:id" element={<Protected><AutomationDetail /></Protected>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <AssistantButton />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
