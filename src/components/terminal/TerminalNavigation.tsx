import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface NavigationSection {
  id: string;
  command: string;
  label: string;
}

interface TerminalNavigationProps {
  sections: NavigationSection[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const TerminalNavigation: React.FC<TerminalNavigationProps> = ({
  sections,
  activeSection,
  onNavigate
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-6 py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          {/* Left side: Logo + Home */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('home')}
              className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              m8s.ai
            </button>
            <button
              onClick={() => handleNavigation('home')}
              className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                activeSection === 'home' 
                  ? 'text-emerald-400 bg-emerald-400/10' 
                  : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
              }`}
            >
              {t('nav.home')}
            </button>
          </div>
          
          {/* Center: Middle navigation */}
          <div className="flex space-x-6">
            {sections.slice(1, -1).map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigation(section.id)}
                className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                  activeSection === section.id 
                    ? 'text-emerald-400 bg-emerald-400/10' 
                    : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                }`}
              >
                {t(`nav.${section.id}`)}
              </button>
            ))}
          </div>
          
          {/* Right side: About + Language Switcher */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('about')}
              className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                activeSection === 'about' 
                  ? 'text-emerald-400 bg-emerald-400/10' 
                  : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
              }`}
            >
              {t('nav.about')}
            </button>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('home')}
            className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            m8s.ai
          </button>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-emerald-400 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-2 pt-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  className={`px-4 py-3 font-medium text-sm transition-all duration-200 rounded-lg text-left ${
                    activeSection === section.id 
                      ? 'text-emerald-400 bg-emerald-400/10' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                  }`}
                >
                  {t(`nav.${section.id}`)}
                </button>
              ))}
              <div className="pt-4 flex justify-center border-t border-gray-700/50 mt-4">
                <div className="p-2 rounded-lg border border-gray-600/50 bg-gray-800/50">
                  <LanguageSwitcher onLanguageChange={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};