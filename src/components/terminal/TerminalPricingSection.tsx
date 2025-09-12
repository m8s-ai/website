import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TerminalPricingSectionProps {
  sessionStartTime: number;
  audio: {
    playSelectionSound: () => Promise<void>;
  };
}

export const TerminalPricingSection: React.FC<TerminalPricingSectionProps> = ({
  sessionStartTime,
  audio
}) => {
  const { t, isRTL } = useLanguage();

  const developmentFeatures = [
    {
      left: [
        t('pricing.fullstack_development'),
        t('pricing.database_architecture_service'),
        t('pricing.api_integrations')
      ],
      right: [
        t('pricing.production_deployment'),
        t('pricing.ongoing_maintenance'),
        t('pricing.team_training')
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('pricing.title')}
        </h2>
        <p className="text-gray-400 text-lg mb-2">
          {t('pricing.subtitle')}
        </p>
        <p className="text-gray-500 text-sm mb-8">
          {t('pricing.contact_details')}
        </p>
      </div>
      
      {/* Development Services */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-gradient-to-br from-amber-900/30 to-gray-900/30 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-amber-300 mb-4">
              {t('pricing.development_services')}
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              {t('pricing.development_description')}
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="space-y-3">
                {developmentFeatures[0].left.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {developmentFeatures[0].right.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};