import React, { memo } from 'react';
import { Typography, Container } from '@/components/atoms';
import { TestimonialCard } from '@/components/molecules';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SuccessStoriesSectionProps {
  className?: string;
}

const SuccessStoriesSection = memo<SuccessStoriesSectionProps>(({
  className = ''
}) => {
  const { t } = useLanguage();

  const stories = [
    {
      name: 'Rotem Perets',
      role: 'VP Engineering at Package AI',
      company: t('website.success_story1_company'),
      description: t('website.success_story1_description'),
      result: t('website.success_story1_result'),
      avatarSrc: 'https://media.licdn.com/dms/image/v2/C4D03AQH--QNM9GpwVw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1571067730855?e=1760572800&v=beta&t=Rs-8D2X9V_H314VN0Ia3gwPvQbHuhvbxYmqaOx20LmI',
      color: 'cyan' as const
    },
    {
      name: 'Dr. Oved Daniel',
      role: 'Board Member, International Headache Society',
      company: t('website.success_story2_company'),
      description: t('website.success_story2_description'),
      result: t('website.success_story2_result'),
      avatarSrc: 'https://media.licdn.com/dms/image/v2/D4D03AQECGwtaNrsIEQ/profile-displayphoto-scale_200_200/B4DZj3AsS7H0Ac-/0/1756490811897?e=1760572800&v=beta&t=sYL6Ik6V446XBshaML6KjRjQL5A5YEJrZg8mEGZYYRA',
      color: 'purple' as const
    },
    {
      name: 'Maoz Mussel',
      role: 'Software Developer/Manager',
      company: t('website.success_story3_company'),
      description: t('website.success_story3_description'),
      result: t('website.success_story3_result'),
      avatarSrc: 'https://media.licdn.com/dms/image/v2/C5103AQEFCZFVH4VjIQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1516291988350?e=1760572800&v=beta&t=oLWKcKjnWTtKlsUk-ZwqqK6uS15IpL9N7UXEgx-SMHA',
      color: 'emerald' as const
    }
  ];

  return (
    <Container size="lg" margin="auto" className={className}>
      <div className="text-center mb-12">
        <Typography variant="h2" color="white" className="mb-4">
          {t('website.success_stories_title')}
        </Typography>
        <Typography variant="h5" color="muted">
          {t('website.success_stories_subtitle')}
        </Typography>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <TestimonialCard
            key={index}
            name={story.name}
            role={story.role}
            company={story.company}
            description={story.description}
            result={story.result}
            avatarSrc={story.avatarSrc}
            color={story.color}
          />
        ))}
      </div>
    </Container>
  );
});

SuccessStoriesSection.displayName = 'SuccessStoriesSection';

export default SuccessStoriesSection;