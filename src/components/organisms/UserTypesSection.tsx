import React, { memo } from 'react';
import { Container } from '@/components/atoms';
import { FeatureCard } from '@/components/molecules';
import { useLanguage } from '@/contexts/LanguageContext';

export interface UserTypeSectionProps {
  className?: string;
}

const UserTypesSection = memo<UserTypeSectionProps>(({
  className = ''
}) => {
  const { t } = useLanguage();

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
      color: 'emerald' as const
    },
    {
      title: t('website.individuals_title'),
      description: t('website.individuals_description'),
      subtitle: t('website.individuals_subtitle'),
      features: [],
      benefit: t('website.individuals_benefit'),
      color: 'cyan' as const
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
      color: 'purple' as const
    }
  ];

  return (
    <div className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ${className}`}>
      {userTypes.map((userType, index) => (
        <FeatureCard
          key={index}
          title={userType.title}
          description={userType.description}
          subtitle={userType.subtitle}
          features={userType.features}
          benefit={userType.benefit}
          color={userType.color}
        />
      ))}
    </div>
  );
});

UserTypesSection.displayName = 'UserTypesSection';

export default UserTypesSection;