import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TerminalHeroSectionProps {
  onStartProject: () => void;
  onLearnMore: () => void;
}

export const TerminalHeroSection: React.FC<TerminalHeroSectionProps> = ({
  onStartProject,
  onLearnMore
}) => {
  const { t } = useLanguage();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {t('website.welcome_title')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
          {t('website.hero_subtitle')}
        </p>
        <p className="text-lg text-gray-400 max-w-5xl mx-auto leading-relaxed">
          {t('website.hero_description')}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          onClick={onStartProject}
        >
          <img src="/robot-favicon-white.svg" alt="Robot" className="w-5 h-5 brightness-0 invert" />
          {t('website.start_project_now')}
        </button>
        <button 
          className="border border-emerald-400 text-emerald-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-400 hover:text-black transition-all duration-300"
          onClick={onLearnMore}
        >
          {t('website.learn_more_about_m8s')}
        </button>
      </div>
    </div>
  );
};