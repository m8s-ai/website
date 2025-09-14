import React, { memo } from 'react';
import { Typography, Container } from '@/components/atoms';
import { FAQItem } from '@/components/molecules';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FAQSectionProps {
  className?: string;
}

const FAQSection = memo<FAQSectionProps>(({
  className = ''
}) => {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('website.faq_question1'),
      answer: t('website.faq_answer1'),
      color: 'emerald' as const
    },
    {
      question: t('website.faq_question2'),
      answer: t('website.faq_answer2'),
      color: 'cyan' as const
    },
    {
      question: t('website.faq_question4'),
      answer: t('website.faq_answer4'),
      color: 'purple' as const
    },
    {
      question: t('website.faq_question3'),
      answer: t('website.faq_answer3'),
      color: 'emerald' as const
    },
    {
      question: t('website.faq_question5'),
      answer: t('website.faq_answer5'),
      color: 'cyan' as const
    }
  ];

  return (
    <Container size="lg" margin="auto" className={className}>
      <div className="text-center mb-12">
        <Typography variant="h2" color="white" className="mb-4">
          {t('website.faq_title')}
        </Typography>
        <Typography variant="h5" color="muted">
          {t('website.faq_subtitle')}
        </Typography>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            color={faq.color}
          />
        ))}
      </div>
    </Container>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;