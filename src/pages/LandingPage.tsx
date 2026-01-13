import { useLanguage } from '@/contexts/LanguageContext';
import {
  Header,
  Hero,
  TheProblem,
  WhatIsM8S,
  Workflows,
  SmarterAI,
  Integrations,
  BuiltForPMs,
  CTASection,
  Footer,
  VideoShowcase,
} from '@/components/landing';

export const LandingPage = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main>
        <Hero />
        <TheProblem />
        <WhatIsM8S />
        <VideoShowcase />
        <Workflows />
        <BuiltForPMs />
        <SmarterAI />
        <Integrations />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
