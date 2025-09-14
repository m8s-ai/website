import React, { memo } from 'react';
import { Typography, Button, Container, Icon } from '@/components/atoms';
import { useLanguage } from '@/contexts/LanguageContext';

export interface HeroSectionProps {
  onStartProject: () => void;
  onLearnMore: () => void;
  className?: string;
}

const HeroSection = memo<HeroSectionProps>(({
  onStartProject,
  onLearnMore,
  className = ''
}) => {
  const { t } = useLanguage();

  const robotIcon = <Icon name="robot" size="md" color="white" className="brightness-0 invert" />;

  return (
    <div className={`text-center space-y-8 ${className}`}>
      <div className="space-y-4">
        <Typography variant="h1" gradient>
          {t('website.welcome_title')}
        </Typography>
        
        <Typography variant="h3" color="gray" className="max-w-4xl mx-auto">
          {t('website.hero_subtitle')}
        </Typography>
        
        <Typography variant="h5" color="muted" className="max-w-5xl mx-auto">
          {t('website.hero_description')}
        </Typography>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartProject}
          icon={robotIcon}
          iconPosition="left"
        >
          {t('website.start_project_now')}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onLearnMore}
        >
          {t('website.learn_more_about_m8s')}
        </Button>
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;