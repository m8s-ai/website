import React, { memo } from 'react';
import { Typography, Container, Button, Icon, Bullet } from '@/components/atoms';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FinalCTASectionProps {
  onStartProject: () => void;
  onLearnMore: () => void;
  className?: string;
}

const FinalCTASection = memo<FinalCTASectionProps>(({
  onStartProject,
  onLearnMore,
  className = ''
}) => {
  const { t, isRTL } = useLanguage();

  const robotIcon = <Icon name="robot" size="lg" color="white" className="brightness-0 invert" />;
  
  const guaranteeItems = [
    {
      text: t('website.final_cta_guarantee'),
      color: 'emerald' as const
    },
    {
      text: t('website.final_cta_time'),
      color: 'cyan' as const
    },
    {
      text: t('website.final_cta_expert'),
      color: 'purple' as const
    }
  ];

  return (
    <Container size="lg" margin="auto" className={className}>
      <Container
        background="gradient"
        border
        rounded="2xl"
        padding="xl"
        className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border-emerald-500/30 backdrop-blur-sm text-center"
      >
        <Typography variant="h1" gradient className="mb-6">
          {t('website.final_cta_title')}
        </Typography>
        
        <Typography variant="h4" color="gray" className="mb-8 max-w-3xl mx-auto">
          {t('website.final_cta_description')}
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            variant="primary"
            size="xl"
            onClick={onStartProject}
            icon={robotIcon}
            iconPosition="left"
            className="gap-3"
          >
            {t('website.final_cta_button')}
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full ml-2">FREE</span>
          </Button>
          
          <Button
            variant="outline"
            size="xl"
            onClick={onLearnMore}
            className="border-2"
          >
            Learn More First
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          {guaranteeItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className={`w-2 h-2 bg-${item.color}-400 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {item.text}
            </div>
          ))}
        </div>
      </Container>
    </Container>
  );
});

FinalCTASection.displayName = 'FinalCTASection';

export default FinalCTASection;