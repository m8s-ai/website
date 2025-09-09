import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAudioManager } from './AudioManager';
import { analyticsManager } from '@/utils/analyticsManager';
import { TerminalPreview } from './TerminalPreview';
import { TerminalOverlay } from './TerminalOverlay';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface TerminalWebsiteProps {
  className?: string;
}

const NAVIGATION_SECTIONS = [
  { id: "home", command: "Home", label: "Overview" },
  { id: "services", command: "Services", label: "What we do" },
  { id: "pricing", command: "Pricing", label: "Plans" },
  { id: "contact", command: "Contact", label: "Get in touch" },
  { id: "about", command: "About", label: "Our story" }
];

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$97",
    period: "/month",
    features: [
      "5 projects per month",
      "Basic POC prototypes", 
      "Project validation reports",
      "Email support"
    ],
    highlight: false
  },
  {
    name: "Professional",
    price: "$297", 
    period: "/month",
    features: [
      "25 projects per month",
      "Advanced POC features",
      "API access",
      "Priority support",
      "Custom integrations"
    ],
    highlight: true
  },
  {
    name: "Enterprise",
    price: "$997",
    period: "/month",
    features: [
      "Unlimited projects",
      "White-label solution",
      "Custom integrations",
      "Dedicated support",
      "Enterprise SLA"
    ],
    highlight: false
  }
];

const SERVICES_DATA = [
  {
    title: "Project Validation",
    description: "AI-powered analysis of your project concept through our proven 4-wave methodology",
    features: ["Feasibility Analysis", "Market Research", "Technical Assessment", "Risk Evaluation"]
  },
  {
    title: "Prototype Generation",
    description: "Rapid development of working prototypes and proof-of-concepts",
    features: ["Interactive Mockups", "Technical Demos", "User Flow Testing", "Performance Analysis"]
  },
  {
    title: "Development Architecture",
    description: "Complete technical specifications and implementation roadmaps",
    features: ["System Design", "Database Architecture", "API Specifications", "Deployment Strategy"]
  }
];

export const TerminalWebsite: React.FC<TerminalWebsiteProps> = ({ className = "" }) => {
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const { t, isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState('home');
  const [sessionStartTime] = useState(Date.now());
  const [showTerminalOverlay, setShowTerminalOverlay] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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
    // Open the terminal overlay
    setShowTerminalOverlay(true);
    
    // Focus the overlay content after a short delay to ensure it's rendered
    setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.focus();
      }
    }, 100);
  }, [audio, activeSection, sessionStartTime]);

  const handleTerminalPreviewExpand = useCallback(() => {
    // Handle terminal preview expansion to overlay
    console.log('Terminal preview expanding to overlay');
    setShowTerminalOverlay(true);
    
    // Focus the overlay content after a short delay to ensure it's rendered
    setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.focus();
      }
    }, 100);
  }, []);

  const handleTerminalOverlayClose = useCallback(() => {
    // Handle terminal overlay close
    console.log('Terminal overlay closing');
    setShowTerminalOverlay(false);
  }, []);

  // Handle overlay state changes - just manage scrolling
  useEffect(() => {
    if (showTerminalOverlay) {
      // Prevent scrolling on the background
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showTerminalOverlay]);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'home':
        return (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {t('website.welcome_title')}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                  {t('website.hero_subtitle')}
                </p>
                <p className="text-lg text-gray-400 max-w-5xl mx-auto leading-relaxed">
                  {t('website.hero_description')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  onClick={handleStartProject}
                >
                  <img src="/robot-favicon-white.svg" alt="Robot" className="w-5 h-5 brightness-0 invert" />
                  {t('website.start_project_now')}
                </button>
                <button className="border border-emerald-400 text-emerald-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-400 hover:text-black transition-all duration-300">
                  {t('website.explore_past_work')}
                </button>
              </div>
            </div>

            {/* Terminal Preview */}
            <TerminalPreview onExpand={handleTerminalPreviewExpand} />

            {/* What We Do */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-emerald-300 mb-6 text-center">{t('website.what_we_do')}</h2>
                <p className="text-gray-300 text-lg text-center">
                  {t('website.what_we_do_description')}
                </p>
              </div>
            </div>
            
            {/* For Different User Types */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Small Businesses */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900/30 border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-emerald-300 mb-4">{t('website.small_businesses_title')}</h3>
                <p className="text-gray-300 mb-4">{t('website.small_businesses_description')}</p>
                <p className="text-gray-400 text-sm mb-6">{t('website.small_businesses_subtitle')}</p>
                <div className="space-y-3 text-sm">
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-emerald-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.small_businesses_feature1')}</span>
                  </div>
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-emerald-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.small_businesses_feature2')}</span>
                  </div>
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-emerald-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.small_businesses_feature3')}</span>
                  </div>
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-emerald-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.small_businesses_feature4')}</span>
                  </div>
                </div>
                <p className="text-emerald-400 text-sm mt-6">{t('website.small_businesses_benefit')}</p>
              </div>

              {/* Individuals */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-gray-900/30 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">{t('website.individuals_title')}</h3>
                <p className="text-gray-300 mb-4">{t('website.individuals_description')}</p>
                <p className="text-gray-400 text-sm mb-6">{t('website.individuals_subtitle')}</p>
                <p className="text-cyan-400 text-sm mt-8">{t('website.individuals_benefit')}</p>
              </div>

              {/* Companies */}
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/30 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-purple-300 mb-4">{t('website.companies_title')}</h3>
                <p className="text-gray-300 mb-4">{t('website.companies_description')}</p>
                <p className="text-gray-400 text-sm mb-6">{t('website.companies_subtitle')}</p>
                <div className="space-y-3 text-sm">
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-purple-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.companies_feature1')}</span>
                  </div>
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-purple-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.companies_feature2')}</span>
                  </div>
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-purple-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.companies_feature3')}</span>
                  </div>
                  <div className={`flex items-start `}>
                    <div className={`w-2 h-2 bg-purple-400 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} mt-2`}></div>
                    <span className="text-gray-300">{t('website.companies_feature4')}</span>
                  </div>
                </div>
                <p className="text-purple-400 text-sm mt-6">{t('website.companies_benefit')}</p>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('services.title')}</h2>
              <p className="text-gray-400 text-lg">{t('services.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
              {SERVICES_DATA.map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-emerald-300">{t(`services.${service.title.toLowerCase().replace(/\s+/g, '_')}`)}</h3>
                    <span className="text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full">{t('services.available')}</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">{t(`services.${service.title.toLowerCase().replace(/\s+/g, '_')}_description`)}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.features.map((feature, fIndex) => (
                      <div key={fIndex} className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-emerald-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t(`services.${feature.toLowerCase().replace(/[\s&-]+/g, '_').replace(/[^a-z_]/g, '')}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('pricing.title')}</h2>
              <p className="text-gray-400 text-lg mb-2">{t('pricing.subtitle')}</p>
              <p className="text-gray-500 text-sm mb-8">{t('pricing.contact_details')}</p>
            </div>
            
            {/* Hide POC Validation Subscriptions section */}
            {false && <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PRICING_TIERS.map((tier, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border rounded-2xl p-8 backdrop-blur-sm relative flex flex-col h-full transition-all duration-300 ${
                    tier.highlight 
                      ? 'border-emerald-400/50 shadow-lg shadow-emerald-500/20 scale-105' 
                      : 'border-gray-700/50 hover:border-emerald-500/30'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-sm px-4 py-2 rounded-full font-bold">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center flex flex-col h-full">
                    <h3 className="text-xl font-bold text-white mb-10">{tier.name}</h3>
                    
                    <div className="space-y-4 mb-8 flex-grow">
                      {tier.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></div>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 mt-auto ${
                        tier.highlight 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white cursor-not-allowed opacity-75' 
                          : 'border border-amber-400 text-amber-400 cursor-not-allowed opacity-75'
                      }`}
                      disabled
                    >
                      Upcoming
                    </button>
                  </div>
                </div>
              ))}
            </div>}
            
            {/* Development Services */}
            <div className="max-w-4xl mx-auto mt-16">
              <div className="bg-gradient-to-br from-amber-900/30 to-gray-900/30 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-amber-300 mb-4">{t('pricing.development_services')}</h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    {t('pricing.development_description')}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                    <div className="space-y-3">
                      <div className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t('pricing.fullstack_development')}</span>
                      </div>
                      <div className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t('pricing.database_architecture_service')}</span>
                      </div>
                      <div className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t('pricing.api_integrations')}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t('pricing.production_deployment')}</span>
                      </div>
                      <div className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t('pricing.ongoing_maintenance')}</span>
                      </div>
                      <div className={`flex items-center `}>
                        <div className={`w-2 h-2 bg-amber-400 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}></div>
                        <span className="text-gray-300">{t('pricing.team_training')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('contact.title')}</h2>
              <p className="text-gray-400 text-lg">{t('contact.subtitle')}</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-emerald-300 mb-6">{t('contact.contact_information')}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">{t('contact.email')}</div>
                      <div className="text-white">contact@m8s.ai</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">{t('contact.phone')}</div>
                      <div className="text-white" dir="ltr">+1 (438) 8676782</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">{t('contact.response_time')}</div>
                      <div className="text-white">{t('contact.response_time_value')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">{t('contact.availability')}</div>
                      <div className="text-white">{t('contact.availability_value')}</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700/50 pt-8 mt-8">
                    <h4 className="text-emerald-400 font-semibold mb-4 text-center">{t('contact.ready_to_validate')}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed text-center mb-6">
                      {t('contact.validation_description')}
                    </p>
                    
                    <button 
                      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                      onClick={async () => {
                        await audio.playSelectionSound();
                        
                        analyticsManager.trackNavigationEvent('contact_interaction', {
                          interaction_type: 'email_click',
                          contact_method: 'email',
                          email: 'contact@m8s.ai',
                          context: 'contact_section_cta',
                          session_duration: Math.round((Date.now() - sessionStartTime) / 1000)
                        });
                        
                        window.location.href = 'mailto:contact@m8s.ai?subject=Project Validation Request';
                      }}
                    >
                      {t('contact.start_your_project')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('about.title')}</h2>
              <p className="text-gray-400 text-lg">{t('about.subtitle')}</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-300 mb-4">{t('about.our_mission')}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {t('about.mission_description')}
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                  <h4 className="text-lg font-bold text-cyan-400 mb-6">{t('about.success_metrics')}</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('about.projects_validated')}</span>
                      <span className="text-cyan-400">{t('about.projects_validated_value')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('about.success_rate')}</span>
                      <span className="text-cyan-400">{t('about.success_rate_value')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('about.avg_completion')}</span>
                      <span className="text-cyan-400">{t('about.avg_completion_value')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('about.client_satisfaction')}</span>
                      <span className="text-cyan-400">{t('about.client_satisfaction_value')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Floating neon orbs - subtle version */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-400/8 to-purple-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-purple-400/6 to-emerald-400/6 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping" 
             style={{ animationDuration: '4s', animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" 
             style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" 
             style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center">
            {/* Left side: Logo + Home */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => handleNavigation('home')}
                className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
              >
                m8s.ai
              </button>
              <button
                onClick={() => handleNavigation('home')}
                className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                  activeSection === 'home' 
                    ? 'text-emerald-400 bg-emerald-400/10' 
                    : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                }`}
              >
                {t('nav.home')}
              </button>
            </div>
            
            {/* Center: Middle navigation */}
            <div className="flex space-x-6">
              {NAVIGATION_SECTIONS.slice(1, -1).map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                    activeSection === section.id 
                      ? 'text-emerald-400 bg-emerald-400/10' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                  }`}
                >
                  {t(`nav.${section.id}`)}
                </button>
              ))}
            </div>
            
            {/* Right side: About + Language Switcher */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('about')}
                className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                  activeSection === 'about' 
                    ? 'text-emerald-400 bg-emerald-400/10' 
                    : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                }`}
              >
                {t('nav.about')}
              </button>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-between items-center">
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('home')}
              className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              m8s.ai
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-emerald-400 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700/50">
              <div className="flex flex-col space-y-2 pt-4">
                {NAVIGATION_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      handleNavigation(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 font-medium text-sm transition-all duration-200 rounded-lg text-left ${
                      activeSection === section.id 
                        ? 'text-emerald-400 bg-emerald-400/10' 
                        : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                    }`}
                  >
                    {t(`nav.${section.id}`)}
                  </button>
                ))}
                <div className="pt-4 flex justify-center border-t border-gray-700/50 mt-4">
                  <div className="p-2 rounded-lg border border-gray-600/50 bg-gray-800/50">
                    <LanguageSwitcher onLanguageChange={() => setMobileMenuOpen(false)} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <div className="container mx-auto px-6">
          <div className="min-h-screen flex flex-col">
            {/* Section Content */}
            <section id={activeSection} className="flex-1 py-8">
              {renderSection(activeSection)}
            </section>
            
            {/* All sections for smooth scrolling */}
            {NAVIGATION_SECTIONS.slice(1).map((section) => (
              <section key={section.id} id={section.id} className="py-8">
                {renderSection(section.id)}
              </section>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              m8s.ai • Advanced Project Validation Systems • Est. 2024
            </div>
          </div>
        </div>
      </footer>

      {/* Terminal Overlay */}
      {showTerminalOverlay && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-start justify-center pt-8 px-4 pb-4"
          onKeyDown={(e) => {
            // Handle ESC key to close overlay
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              handleTerminalOverlayClose();
            }
            // Prevent arrow keys from scrolling the overlay window
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              e.stopPropagation();
              // Let the event bubble to ConversationEngine for menu navigation
              const conversationElement = e.currentTarget.querySelector('[data-conversation-engine]');
              if (conversationElement) {
                conversationElement.dispatchEvent(new KeyboardEvent('keydown', {
                  key: e.key,
                  bubbles: true,
                  cancelable: true
                }));
              }
            }
            // Let all other keys pass through to the terminal content
          }}
          onWheel={(e) => {
            // Prevent scrolling the background
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            // Prevent touch scrolling on mobile
            e.preventDefault();
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-900/90 backdrop-blur-md border border-gray-500/40 rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-600/50 rounded-t-xl">
              <div className="flex items-center space-x-3">
                {/* Traffic Light Buttons */}
                <div className="flex items-center">
                  <button
                    onClick={handleTerminalOverlayClose}
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
                    title="Close"
                  ></button>
                  <span className="w-2 inline-block" />
                  <button
                    className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
                    title="Minimize"
                    disabled
                  ></button>
                  <span className="w-2 inline-block" />
                  <button
                    className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
                    title="Maximize" 
                    disabled
                  ></button>
                </div>
                <div className="text-gray-300 text-sm font-mono">ARIA - Project Validation Terminal</div>
              </div>
              
              {/* ESC hint */}
              <div className="flex items-center">
                <div className="text-gray-500 text-xs font-mono">
                  Press ESC to close
                </div>
              </div>
            </div>
            
            {/* Terminal content with slight transparency */}
            <div 
              ref={overlayRef}
              className="w-full h-full rounded-b-xl overflow-auto bg-black/85 backdrop-blur-sm focus:outline-none terminal-scrollbar"
              tabIndex={0}
              autoFocus
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#10b981 #1f2937'
              }}
            >
              <TerminalOverlay 
                onComplete={() => {
                  // Handle terminal completion in overlay - close overlay and could show success message or navigate
                  console.log('ARIA terminal completed in overlay mode');
                  setShowTerminalOverlay(false);
                  // Could navigate to conversation or show success message
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};