import React, { memo } from 'react';
import { Typography, Container } from '@/components/atoms';
import { StepCard } from '@/components/molecules';
import { useLanguage } from '@/contexts/LanguageContext';

export interface HowItWorksSectionProps {
  className?: string;
}

const HowItWorksSection = memo<HowItWorksSectionProps>(({
  className = ''
}) => {
  const { t } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t('website.how_it_works_step1_title'),
      description: t('website.how_it_works_step1_description'),
      color: 'emerald' as const
    },
    {
      number: 2,
      title: t('website.how_it_works_step2_title'),
      description: t('website.how_it_works_step2_description'),
      color: 'cyan' as const
    },
    {
      number: 3,
      title: t('website.how_it_works_step3_title'),
      description: t('website.how_it_works_step3_description'),
      color: 'purple' as const
    },
    {
      number: 4,
      title: t('website.how_it_works_step4_title'),
      description: t('website.how_it_works_step4_description'),
      color: 'emerald' as const
    }
  ];

  return (
    <Container size="lg" margin="auto" className={className}>
      <div className="text-center mb-12">
        <Typography variant="h2" color="white" className="mb-4">
          {t('website.how_it_works_title')}
        </Typography>
        <Typography variant="h5" color="muted">
          {t('website.how_it_works_subtitle')}
        </Typography>
      </div>
      
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            number={step.number}
            title={step.title}
            description={step.description}
            color={step.color}
          />
        ))}
      </div>
    </Container>
  );
});

HowItWorksSection.displayName = 'HowItWorksSection';

export default HowItWorksSection;