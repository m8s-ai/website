import React, { memo, useState } from 'react';
import { Container, Typography, Icon } from '@/components/atoms';
import { NavButton } from '@/components/molecules';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NavigationSection {
  id: string;
  command: string;
  label: string;
}

export interface NavigationProps {
  sections: NavigationSection[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  className?: string;
}

const Navigation = memo<NavigationProps>(({
  sections,
  activeSection,
  onNavigate,
  className = ''
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50 ${className}`}>
      <Container size="full" padding="md" className="mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          {/* Left side: Logo + Home */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              m8s.ai
            </button>
            
            <NavButton
              label={t('nav.home')}
              isActive={activeSection === 'home'}
              onClick={() => onNavigate('home')}
            />
          </div>
          
          {/* Center: Middle navigation */}
          <div className="flex space-x-6">
            {sections.slice(1, -1).map((section) => (
              <NavButton
                key={section.id}
                label={t(`nav.${section.id}`)}
                isActive={activeSection === section.id}
                onClick={() => onNavigate(section.id)}
              />
            ))}
          </div>
          
          {/* Right side: About + Language Switcher */}
          <div className="flex items-center space-x-4">
            <NavButton
              label={t('nav.about')}
              isActive={activeSection === 'about'}
              onClick={() => onNavigate('about')}
            />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            m8s.ai
          </button>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-emerald-400 transition-colors p-2"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size="lg" />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-2 pt-4">
              {sections.map((section) => (
                <NavButton
                  key={section.id}
                  label={t(`nav.${section.id}`)}
                  isActive={activeSection === section.id}
                  onClick={() => handleMobileNavigate(section.id)}
                  className="px-4 py-3 text-left w-full"
                />
              ))}
              
              <div className="pt-4 flex justify-center border-t border-gray-700/50 mt-4">
                <div className="p-2 rounded-lg border border-gray-600/50 bg-gray-800/50">
                  <LanguageSwitcher onLanguageChange={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;