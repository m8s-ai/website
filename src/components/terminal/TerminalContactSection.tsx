import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyticsManager } from '@/utils/analyticsManager';

interface TerminalContactSectionProps {
  sessionStartTime: number;
  audio: {
    playSelectionSound: () => Promise<void>;
  };
}

export const TerminalContactSection: React.FC<TerminalContactSectionProps> = ({
  sessionStartTime,
  audio
}) => {
  const { t } = useLanguage();

  const handleContactClick = async () => {
    await audio.playSelectionSound();
    
    analyticsManager.trackNavigationEvent('contact_interaction', {
      interaction_type: 'email_click',
      contact_method: 'email',
      email: 'contact@m8s.ai',
      context: 'contact_section_cta',
      session_duration: Math.round((Date.now() - sessionStartTime) / 1000)
    });
    
    window.location.href = 'mailto:contact@m8s.ai?subject=Project Validation Request';
  };

  const contactInfo = [
    {
      label: t('contact.email'),
      value: 'contact@m8s.ai',
      dir: 'ltr'
    },
    {
      label: t('contact.phone'),
      value: '+1 (438) 8676782',
      dir: 'ltr'
    },
    {
      label: t('contact.response_time'),
      value: t('contact.response_time_value'),
      dir: undefined
    },
    {
      label: t('contact.availability'),
      value: t('contact.availability_value'),
      dir: undefined
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('contact.title')}
        </h2>
        <p className="text-gray-400 text-lg">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-emerald-300 mb-6">
                {t('contact.contact_information')}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="text-center">
                  <div className="text-emerald-400 font-semibold mb-2">
                    {info.label}
                  </div>
                  <div className="text-white" dir={info.dir}>
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700/50 pt-8 mt-8">
              <h4 className="text-emerald-400 font-semibold mb-4 text-center">
                {t('contact.ready_to_validate')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed text-center mb-6">
                {t('contact.validation_description')}
              </p>
              
              <button 
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                onClick={handleContactClick}
              >
                {t('contact.start_your_project')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};