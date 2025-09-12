import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const WhatWeDoSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-emerald-300 mb-6 text-center">
          {t('website.what_we_do')}
        </h2>
        <p className="text-gray-300 text-lg text-center">
          {t('website.what_we_do_description')}
        </p>
      </div>
    </div>
  );
};