import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="glass-card border-b border-border/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl shadow-glow animate-glow">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                <span className="brand-text">{t('common.automate')}</span> Market
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Internal Automation Flows
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};