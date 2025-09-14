import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';
import { useLanguage } from '@/contexts/LanguageContext';

// Atomic Design Components
import { Container, Typography, Button } from './atoms';
import { ComparisonSection, type ComparisonItem } from './molecules';
import { 
  HeroSection,
  type NavigationSection
} from './organisms';
import { MainLayout, SectionLayout, TerminalModal } from './templates';

// Import sections normally for now - the Vite chunking will handle optimization
import { TerminalPreview } from './TerminalPreview';
import { TechnologiesSection } from './sections/TechnologiesSection';
import { 
  UserTypesSection,
  HowItWorksSection,
  SuccessStoriesSection,
  FAQSection,
  FinalCTASection
} from './organisms';

interface TerminalWebsiteProps {
  className?: string;
}

// Constants moved outside component for better performance
const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: "home", command: "Home", label: "Overview" },
  { id: "services", command: "Services", label: "What we do" },
  { id: "pricing", command: "Pricing", label: "Plans" },
  { id: "contact", command: "Contact", label: "Get in touch" },
  { id: "about", command: "About", label: "Our story" }
];

// Memoized section components for performance
const MemoizedWhatWeDoSection = memo(() => {
  const { t } = useLanguage();
  
  return (
    <Container size="lg" margin="auto">
      <Container
        background="glass"
        border
        rounded="2xl"
        padding="lg"
      >
        <Typography variant="h3" color="primary" align="center" className="mb-6">
          {t('website.what_we_do')}
        </Typography>
        <Typography variant="h5" color="gray" align="center">
          {t('website.what_we_do_description')}
        </Typography>
      </Container>
    </Container>
  );
});
MemoizedWhatWeDoSection.displayName = 'WhatWeDoSection';

const MemoizedWhyValidateSection = memo<{ onStartProject: () => void }>(({ onStartProject }) => {
  const { t } = useLanguage();
  
  const withoutItems: ComparisonItem[] = [
    { text: t('website.why_validate_without_item1') },
    { text: t('website.why_validate_without_item2') },
    { text: t('website.why_validate_without_item3') },
    { text: t('website.why_validate_without_item4') }
  ];

  const withItems: ComparisonItem[] = [
    { text: t('website.why_validate_with_item1') },
    { text: t('website.why_validate_with_item2') },
    { text: t('website.why_validate_with_item3') },
    { text: t('website.why_validate_with_item4') }
  ];

  return (
    <div className="space-y-8">
      <ComparisonSection
        title={t('website.why_validate_title')}
        subtitle={t('website.dont_become_statistic')}
        leftTitle={t('website.why_validate_without_title')}
        rightTitle={t('website.why_validate_with_title')}
        leftItems={withoutItems}
        rightItems={withItems}
        leftColor="red"
        rightColor="emerald"
      />
      
      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartProject}
        >
          {t('website.dont_risk_validate_first')}
        </Button>
      </div>
    </div>
  );
});
MemoizedWhyValidateSection.displayName = 'WhyValidateSection';

// Contact Section Component
const MemoizedContactSection = memo(() => {
  const { t } = useLanguage();
  const [sessionStartTime] = useState(Date.now());
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });

  const handleContactClick = useCallback(async () => {
    await audio.playSelectionSound();

    analyticsManager.trackNavigationEvent('contact_interaction', {
      interaction_type: 'email_click',
      contact_method: 'email',
      email: 'contact@m8s.ai',
      context: 'contact_section_cta',
      session_duration: Math.round((Date.now() - sessionStartTime) / 1000)
    });

    window.location.href = 'mailto:contact@m8s.ai?subject=Project Validation Request';
  }, [audio, sessionStartTime]);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <Typography variant="h2" color="white" className="mb-4">
          {t('contact.title')}
        </Typography>
        <Typography variant="h5" color="muted">
          {t('contact.subtitle')}
        </Typography>
      </div>

      <Container size="md" margin="auto">
        <Container
          background="glass"
          border
          rounded="2xl"
          padding="lg"
        >
          <div className="space-y-8">
            <div className="text-center">
              <Typography variant="h4" color="primary" className="mb-6">
                {t('contact.contact_information')}
              </Typography>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <Typography variant="body" color="primary" className="font-semibold mb-2">
                  {t('contact.email')}
                </Typography>
                <Typography variant="body" color="white">
                  contact@m8s.ai
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="body" color="primary" className="font-semibold mb-2">
                  {t('contact.phone')}
                </Typography>
                <Typography variant="body" color="white" className="ltr">
                  +1 (438) 8676782
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="body" color="primary" className="font-semibold mb-2">
                  {t('contact.response_time')}
                </Typography>
                <Typography variant="body" color="white">
                  {t('contact.response_time_value')}
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="body" color="primary" className="font-semibold mb-2">
                  {t('contact.availability')}
                </Typography>
                <Typography variant="body" color="white">
                  {t('contact.availability_value')}
                </Typography>
              </div>
            </div>

            <div className="border-t border-gray-700/50 pt-8 mt-8">
              <Typography variant="h5" color="primary" className="font-semibold mb-4 text-center">
                {t('contact.ready_to_validate')}
              </Typography>
              <Typography variant="caption" color="gray" className="text-center mb-6 block">
                {t('contact.validation_description')}
              </Typography>

              <Button
                variant="primary"
                size="lg"
                onClick={handleContactClick}
                className="w-full"
              >
                {t('contact.start_your_project')}
              </Button>
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
});
MemoizedContactSection.displayName = 'ContactSection';

// About Section Component
const MemoizedAboutSection = memo(() => {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <Typography variant="h2" color="white" className="mb-4">
          {t('about.title')}
        </Typography>
        <Typography variant="h5" color="muted">
          {t('about.subtitle')}
        </Typography>
      </div>

      <Container size="lg" margin="auto" className="space-y-8">
        <Container
          background="glass"
          border
          rounded="2xl"
          padding="lg"
        >
          <Typography variant="h4" color="primary" className="mb-4">
            {t('about.our_mission')}
          </Typography>
          <Typography variant="h5" color="gray">
            {t('about.mission_description')}
          </Typography>
        </Container>

        <Container size="md" margin="auto">
          <Container
            background="glass"
            border
            rounded="2xl"
            padding="lg"
          >
            <Typography variant="h5" color="secondary" className="mb-6">
              {t('about.success_metrics')}
            </Typography>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Typography variant="body" color="gray">
                  {t('about.projects_validated')}
                </Typography>
                <Typography variant="body" color="secondary">
                  {t('about.projects_validated_value')}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body" color="gray">
                  {t('about.success_rate')}
                </Typography>
                <Typography variant="body" color="secondary">
                  {t('about.success_rate_value')}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body" color="gray">
                  {t('about.avg_completion')}
                </Typography>
                <Typography variant="body" color="secondary">
                  {t('about.avg_completion_value')}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body" color="gray">
                  {t('about.client_satisfaction')}
                </Typography>
                <Typography variant="body" color="secondary">
                  {t('about.client_satisfaction_value')}
                </Typography>
              </div>
            </div>
          </Container>
        </Container>
      </Container>
    </div>
  );
});
MemoizedAboutSection.displayName = 'AboutSection';

// Pricing Section Component
const MemoizedPricingSection = memo(() => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <Typography variant="h2" color="white" className="mb-4">
          {t('pricing.title')}
        </Typography>
        <Typography variant="h5" color="muted" className="mb-2">
          {t('pricing.subtitle')}
        </Typography>
        <Typography variant="caption" color="muted" className="mb-8">
          {t('pricing.contact_details')}
        </Typography>
      </div>

      {/* Development Services */}
      <Container size="lg" margin="auto" className="mt-16">
        <Container
          background="gradient"
          border
          rounded="2xl"
          padding="lg"
          className="bg-gradient-to-br from-amber-900/30 to-gray-900/30 border-amber-500/20"
        >
          <div className="text-center">
            <Typography variant="h3" color="warning" className="mb-4">
              {t('pricing.development_services')}
            </Typography>
            <Typography variant="h5" color="gray" className="mb-6">
              {t('pricing.development_description')}
            </Typography>
            
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="space-y-3">
                {[
                  t('pricing.fullstack_development'),
                  t('pricing.database_architecture_service'),
                  t('pricing.api_integrations')
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`} />
                    <Typography variant="body" color="gray">{item}</Typography>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  t('pricing.production_deployment'),
                  t('pricing.ongoing_maintenance'),
                  t('pricing.team_training')
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`} />
                    <Typography variant="body" color="gray">{item}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
});
MemoizedPricingSection.displayName = 'PricingSection';

export const TerminalWebsite: React.FC<TerminalWebsiteProps> = memo(({ className = "" }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const [activeSection, setActiveSection] = useState('home');
  const [sessionStartTime] = useState(Date.now());
  const [showTerminalOverlay, setShowTerminalOverlay] = useState(false);

  // Track website load
  useEffect(() => {
    analyticsManager.trackNavigationEvent('website_loaded', {
      initial_section: 'home',
      referrer: document.referrer || 'direct'
    });
  }, []);

  const handleNavigation = useCallback(async (sectionId: string) => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    
    analyticsManager.trackNavigationEvent('menu_clicked', {
      section_selected: sectionId,
      previous_section: activeSection,
      session_duration: sessionDuration
    });

    await audio.playSelectionSound();
    setActiveSection(sectionId);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [audio, activeSection, sessionStartTime]);

  const handleStartProject = useCallback(async () => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    
    analyticsManager.trackNavigationEvent('cta_clicked', {
      button_type: 'start_project',
      button_location: 'hero_section',
      current_section: activeSection,
      session_duration: sessionDuration
    });

    await audio.playSelectionSound();
    setShowTerminalOverlay(true);
  }, [audio, activeSection, sessionStartTime]);

  const handleLearnMoreAboutM8s = useCallback(async () => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    
    analyticsManager.trackNavigationEvent('cta_clicked', {
      button_type: 'learn_more_about_m8s',
      button_location: 'hero_section',
      current_section: activeSection,
      session_duration: sessionDuration
    });

    await audio.playSelectionSound();
    setShowTerminalOverlay(true);
  }, [audio, activeSection, sessionStartTime]);

  const handleTerminalPreviewExpand = useCallback(() => {
    console.log('Terminal preview expanding to overlay');
    setShowTerminalOverlay(true);
  }, []);

  const handleTerminalOverlayClose = useCallback(() => {
    console.log('Terminal overlay closing');
    setShowTerminalOverlay(false);
  }, []);

  const renderSection = useCallback((sectionId: string) => {
    switch (sectionId) {
      case 'home':
        return (
          <div className="space-y-16">
            {/* Hero Section */}
            <HeroSection
              onStartProject={handleStartProject}
              onLearnMore={handleLearnMoreAboutM8s}
            />

            {/* Terminal Preview */}
            <TerminalPreview onExpand={handleTerminalPreviewExpand} />

            {/* What We Do */}
            <MemoizedWhatWeDoSection />

            {/* User Types */}
            <UserTypesSection />
            
            {/* How It Works */}
            <HowItWorksSection />

            {/* Success Stories */}
            <SuccessStoriesSection />

            {/* Why Validate */}
            <MemoizedWhyValidateSection onStartProject={handleStartProject} />

            {/* FAQ */}
            <FAQSection />

            {/* Final CTA */}
            <FinalCTASection
              onStartProject={handleStartProject}
              onLearnMore={handleLearnMoreAboutM8s}
            />

            {/* Technologies */}
            <TechnologiesSection />
          </div>
        );

      case 'pricing':
        return <MemoizedPricingSection />;

      case 'contact':
        return <MemoizedContactSection />;

      case 'about':
        return <MemoizedAboutSection />;

      default:
        return null;
    }
  }, [handleStartProject, handleLearnMoreAboutM8s, handleTerminalPreviewExpand]);

  return (
    <MainLayout
      navigationSections={NAVIGATION_SECTIONS}
      activeSection={activeSection}
      onNavigate={handleNavigation}
      className={className}
    >
      {/* Section Content */}
      <SectionLayout id={activeSection} className="flex-1">
        {renderSection(activeSection)}
      </SectionLayout>
      
      {/* All sections for smooth scrolling */}
      {NAVIGATION_SECTIONS.slice(1).map((section) => (
        <SectionLayout key={section.id} id={section.id}>
          {renderSection(section.id)}
        </SectionLayout>
      ))}

      {/* Terminal Overlay Modal */}
      <TerminalModal
        isOpen={showTerminalOverlay}
        onClose={handleTerminalOverlayClose}
        onComplete={() => {
          console.log('Terminal completed in overlay mode');
          setShowTerminalOverlay(false);
        }}
      />
    </MainLayout>
  );
});

TerminalWebsite.displayName = 'TerminalWebsite';