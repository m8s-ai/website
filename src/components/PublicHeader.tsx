import { Link } from "react-router-dom";
import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChatWindow } from "@/contexts/ChatWindowContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface PublicHeaderProps {
  children?: ReactNode;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { isChatExpanded } = useChatWindow();

  return (
    <header className={`glass-card border-b border-border/20 backdrop-blur-md sticky top-0 z-50 transition-all duration-500 ease-in-out ${isChatExpanded ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
      }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-glow animate-glow">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                <span className="brand-text">{t('common.automate')}</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-foreground hover:text-primary transition-colors font-medium">
              Services
            </Link>
            <Link to="/solutions" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.solutions')}
            </Link>
            <Link to="/industries" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.industries')}
            </Link>
            <Link to="/resources" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.resources')}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.about')}
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.marketplace')}
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {children}
            <LanguageSwitcher />
            <Button variant="ghost" asChild>
              <Link to="/contact">{t('nav.contact')}</Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
              <Link to="/contact">{t('nav.book_strategy_call')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/20">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link to="/services" className="text-foreground hover:text-primary transition-colors font-medium">
                Services
              </Link>
              <Link to="/solutions" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('nav.solutions')}
              </Link>
              <Link to="/industries" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('nav.industries')}
              </Link>
              <Link to="/resources" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('nav.resources')}
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('nav.about')}
              </Link>
              <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('nav.marketplace')}
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <LanguageSwitcher />
                </div>
                <Button variant="ghost" asChild>
                  <Link to="/contact">{t('nav.contact')}</Link>
                </Button>
                <Button asChild className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                  <Link to="/contact">{t('nav.book_strategy_call')}</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};