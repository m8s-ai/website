import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioManager } from './AudioManager';

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
  const navigate = useNavigate();
  const audio = useAudioManager({ isEnabled: true, volume: 0.3 });
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigation = useCallback(async (sectionId: string) => {
    await audio.playSelectionSound();
    setActiveSection(sectionId);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [audio]);

  const handleStartProject = useCallback(async () => {
    await audio.playSelectionSound();
    // Clear the terminal visited flag so user can access terminal again
    localStorage.removeItem('terminal_visited');
    // Navigate to terminal experience with skip boot parameter
    navigate('/?skipBoot=true');
  }, [audio, navigate]);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'home':
        return (
          <div className="space-y-16" dir="ltr">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to m8s
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                  A Full AI Team, Led by Elite Human Architects, Building Your Next Big Thing
                </p>
                <p className="text-lg text-gray-400 max-w-5xl mx-auto leading-relaxed">
                  From automations for small businesses to enterprise-scale systems, our AI m8s deliver solutions faster, smarter, and with uncompromising quality — all under the guidance of architects with startup, freelancing, and Unit 8200 intelligence experience.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  onClick={handleStartProject}
                >
                  <img src="/robot-favicon-white.svg" alt="Robot" className="w-5 h-5 brightness-0 invert" />
                  Start a project now
                </button>
                <button className="border border-emerald-400 text-emerald-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-400 hover:text-black transition-all duration-300">
                  Explore past work
                </button>
              </div>
            </div>

            {/* What We Do */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-emerald-300 mb-6 text-center">💼 What We Do</h2>
                <p className="text-gray-300 text-lg text-center">
                  We build AI-powered solutions for everyone — from solo entrepreneurs to global enterprises. Whatever your size, you get a full team of experts to make it happen.
                </p>
              </div>
            </div>
            
            {/* For Different User Types */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Small Businesses */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900/30 border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-emerald-300 mb-4">🌱 For Small Businesses</h3>
                <p className="text-gray-300 mb-4">Stop wasting hours on admin — focus on what you really do best.</p>
                <p className="text-gray-400 text-sm mb-6">We design smart systems that:</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Manage clients & patients seamlessly</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Automate bookings, invoices, and forms</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Integrate WhatsApp, email, and AI bots</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Generate ideas, content, and marketing</span>
                  </div>
                </div>
                <p className="text-emerald-400 text-sm mt-6">👉 Save time, cut costs, work like 10x your size</p>
              </div>

              {/* Individuals */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-gray-900/30 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">🙋 For Individuals</h3>
                <p className="text-gray-300 mb-4">Got an idea? We bring it to life.</p>
                <p className="text-gray-400 text-sm mb-6">From personal branding apps to web & mobile projects, we make sure your vision doesn't stay just a dream.</p>
                <p className="text-cyan-400 text-sm mt-8">👉 You bring the spark. The m8s build the fire.</p>
              </div>

              {/* Companies */}
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/30 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-purple-300 mb-4">🏢 For Companies</h3>
                <p className="text-gray-300 mb-4">Need serious tech at startup speed?</p>
                <p className="text-gray-400 text-sm mb-6">We specialize in:</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Fast proof-of-concepts to validate ideas</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Clean, scalable code for production</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">Agile delivery (step by step)</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">End-to-end quality (analyst → QA)</span>
                  </div>
                </div>
                <p className="text-purple-400 text-sm mt-6">👉 Move faster, test smarter, launch stronger</p>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-12" dir="ltr">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-gray-400 text-lg">Choose your path to success</p>
            </div>
            
            <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
              {SERVICES_DATA.map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-emerald-300">{service.title}</h3>
                    <span className="text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full">Available</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">{service.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">{feature}</span>
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
          <div className="space-y-12" dir="ltr">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">POC Validation Subscriptions</h2>
              <p className="text-gray-400 text-lg mb-2">Monthly access to project validation & POC generation</p>
              <p className="text-gray-500 text-sm mb-8">* Full project development pricing available after POC validation - contact for quote</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
            </div>
            
            {/* Full Development Notice */}
            <div className="max-w-4xl mx-auto mt-16">
              <div className="bg-gradient-to-br from-amber-900/30 to-gray-900/30 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-amber-300 mb-4">🚀 Full Project Development</h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    After POC validation, we provide custom quotes for complete project development including:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">Full-stack development</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">Database architecture</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">API integrations</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">Production deployment</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">Ongoing maintenance</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                        <span className="text-gray-300">Team training</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="bg-transparent border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                    onClick={() => handleNavigation('contact')}
                  >
                    Request Development Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-12" dir="ltr">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
              <p className="text-gray-400 text-lg">Ready to start your project?</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-emerald-300 mb-6">Contact Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">Email</div>
                      <div className="text-white">contact@m8s.ai</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">Phone</div>
                      <div className="text-white">+1 (438) 8676782</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">Response Time</div>
                      <div className="text-white">&lt; 24 hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold mb-2">Availability</div>
                      <div className="text-white">24/7 Support</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700/50 pt-8 mt-8">
                    <h4 className="text-emerald-400 font-semibold mb-4 text-center">Ready to validate your project?</h4>
                    <p className="text-gray-300 text-sm leading-relaxed text-center mb-6">
                      Send us your project details and we'll deploy our AI validation system within 24 hours. 
                      Include project type, target audience, and timeline for optimal results.
                    </p>
                    
                    <button 
                      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                      onClick={async () => {
                        await audio.playSelectionSound();
                        window.location.href = 'mailto:contact@m8s.ai?subject=Project Validation Request';
                      }}
                    >
                      Start Your Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-12" dir="ltr">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About m8s</h2>
              <p className="text-gray-400 text-lg">Our mission and technology</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-300 mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  m8s (Mates) is an advanced AI-powered project validation platform engineered to eliminate 
                  the uncertainty in software development. Our neural networks analyze thousands of project 
                  variables to deliver precise feasibility assessments and implementation strategies.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                  <h4 className="text-lg font-bold text-cyan-400 mb-6">Success Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Projects Validated:</span>
                      <span className="text-cyan-400">1,247+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Success Rate:</span>
                      <span className="text-cyan-400">96.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg. Completion:</span>
                      <span className="text-cyan-400">18 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Client Satisfaction:</span>
                      <span className="text-cyan-400">99.2%</span>
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white ${className}`}>
      {/* Subtle background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
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
          <div className="flex flex-wrap justify-center md:justify-between items-center space-y-2 md:space-y-0">
            <div className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              m8s.ai
            </div>
            <div className="flex flex-wrap justify-center space-x-1 md:space-x-6 order-2 md:order-none">
              {NAVIGATION_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg ${
                    activeSection === section.id 
                      ? 'text-emerald-400 bg-emerald-400/10' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
                  }`}
                >
                  {section.command}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        <div className="container mx-auto px-6">
          <div className="min-h-screen flex flex-col">
            {/* Section Content */}
            <section id={activeSection} className="flex-1 py-16">
              {renderSection(activeSection)}
            </section>
            
            {/* All sections for smooth scrolling */}
            {NAVIGATION_SECTIONS.slice(1).map((section) => (
              <section key={section.id} id={section.id} className="py-16">
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
            <div className="text-gray-400 text-sm" dir="ltr">
              m8s.AI • Advanced Project Validation Systems • Est. 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};