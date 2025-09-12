import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const UserTypesSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const userTypes = [
    {
      title: t('website.small_businesses_title'),
      description: t('website.small_businesses_description'),
      subtitle: t('website.small_businesses_subtitle'),
      features: [
        t('website.small_businesses_feature1'),
        t('website.small_businesses_feature2'),
        t('website.small_businesses_feature3'),
        t('website.small_businesses_feature4')
      ],
      benefit: t('website.small_businesses_benefit'),
      gradient: 'from-emerald-900/30 to-gray-900/30',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
      dotColor: 'bg-emerald-400',
      titleColor: 'text-emerald-300',
      benefitColor: 'text-emerald-400'
    },
    {
      title: t('website.individuals_title'),
      description: t('website.individuals_description'),
      subtitle: t('website.individuals_subtitle'),
      features: [],
      benefit: t('website.individuals_benefit'),
      gradient: 'from-cyan-900/30 to-gray-900/30',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/40',
      dotColor: 'bg-cyan-400',
      titleColor: 'text-cyan-300',
      benefitColor: 'text-cyan-400'
    },
    {
      title: t('website.companies_title'),
      description: t('website.companies_description'),
      subtitle: t('website.companies_subtitle'),
      features: [
        t('website.companies_feature1'),
        t('website.companies_feature2'),
        t('website.companies_feature3'),
        t('website.companies_feature4')
      ],
      benefit: t('website.companies_benefit'),
      gradient: 'from-purple-900/30 to-gray-900/30',
      borderColor: 'border-purple-500/20 hover:border-purple-500/40',
      dotColor: 'bg-purple-400',
      titleColor: 'text-purple-300',
      benefitColor: 'text-purple-400'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {userTypes.map((userType, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-br ${userType.gradient} border ${userType.borderColor} rounded-2xl p-8 backdrop-blur-sm transition-all duration-300`}
        >
          <h3 className={`text-xl font-bold ${userType.titleColor} mb-4`}>
            {userType.title}
          </h3>
          <p className="text-gray-300 mb-4">{userType.description}</p>
          <p className="text-gray-400 text-sm mb-6">{userType.subtitle}</p>
          
          {userType.features.length > 0 && (
            <div className="space-y-3 text-sm">
              {userType.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-start">
                  <div className={`w-2 h-2 ${userType.dotColor} rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          <p className={`${userType.benefitColor} text-sm ${userType.features.length > 0 ? 'mt-6' : 'mt-8'}`}>
            {userType.benefit}
          </p>
        </div>
      ))}
    </div>
  );
};