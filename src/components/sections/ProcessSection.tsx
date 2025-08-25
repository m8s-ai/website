import { Search, Lightbulb, Rocket, Cog } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "We analyze your current processes to identify automation opportunities and quick wins.",
    details: ["Process Assessment", "Opportunity Mapping", "ROI Analysis"]
  },
  {
    icon: Lightbulb,
    title: "Pilot",
    description: "Rapid prototyping and testing of AI solutions with measurable success metrics.",
    details: ["Proof of Concept", "Performance Testing", "Success Metrics"]
  },
  {
    icon: Rocket,
    title: "Scale",
    description: "Full implementation with enterprise-grade infrastructure and change management.",
    details: ["Full Deployment", "Team Training", "Change Management"]
  },
  {
    icon: Cog,
    title: "Operate",
    description: "Ongoing optimization, monitoring, and support to ensure continued success.",
    details: ["Performance Monitoring", "Continuous Optimization", "Support & Maintenance"]
  }
];

export const ProcessSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-card opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('process.title')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('process.subtitle')}
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-primary/30 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="animate-fade-in text-center group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step Number - Removed */}

                <div className="glass-card rounded-2xl p-8 border border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-primary/30 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline for Mobile */}
        <div className="lg:hidden mt-12">
          <div className="flex justify-center">
            <div className="w-1 bg-gradient-primary/30 rounded-full relative">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-4 h-4 bg-gradient-primary rounded-full transform -translate-x-1/2"
                  style={{ top: `${(index + 1) * 25}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};