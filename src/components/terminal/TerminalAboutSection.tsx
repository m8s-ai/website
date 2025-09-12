import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const TerminalAboutSection: React.FC = () => {
  const { t } = useLanguage();

  const metrics = [
    {
      label: t('about.projects_validated'),
      value: t('about.projects_validated_value')
    },
    {
      label: t('about.success_rate'),
      value: t('about.success_rate_value')
    },
    {
      label: t('about.avg_completion'),
      value: t('about.avg_completion_value')
    },
    {
      label: t('about.client_satisfaction'),
      value: t('about.client_satisfaction_value')
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('about.title')}
        </h2>
        <p className="text-gray-400 text-lg">
          {t('about.subtitle')}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-emerald-300 mb-4">
            {t('about.our_mission')}
          </h3>
          <p className="text-gray-300 leading-relaxed text-lg">
            {t('about.mission_description')}
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <h4 className="text-lg font-bold text-cyan-400 mb-6">
              {t('about.success_metrics')}
            </h4>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-300">{metric.label}</span>
                  <span className="text-cyan-400">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};