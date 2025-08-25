import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Brain, Cog, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const ServicesSection = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Bot,
      title: t("services.ai_automation.title"),
      description: t("services.ai_automation.description"),
      features: [
        t("services.ai_automation.feature1"),
        t("services.ai_automation.feature2"),
        t("services.ai_automation.feature3")
      ]
    },
    {
      icon: Brain,
      title: t("services.generative_ai.title"),
      description: t("services.generative_ai.description"),
      features: [
        t("services.generative_ai.feature1"),
        t("services.generative_ai.feature2"),
        t("services.generative_ai.feature3")
      ]
    },
    {
      icon: Cog,
      title: t("services.enterprise_ai.title"),
      description: t("services.enterprise_ai.description"),
      features: [
        t("services.enterprise_ai.feature1"),
        t("services.enterprise_ai.feature2"),
        t("services.enterprise_ai.feature3")
      ]
    },
    {
      icon: Users,
      title: t("services.consulting.title"),
      description: t("services.consulting.description"),
      features: [
        t("services.consulting.feature1"),
        t("services.consulting.feature2"),
        t("services.consulting.feature3")
      ]
    },
    {
      icon: Zap,
      title: t("services.rpa.title"),
      description: t("services.rpa.description"),
      features: [
        t("services.rpa.feature1"),
        t("services.rpa.feature2"),
        t("services.rpa.feature3")
      ]
    }
  ];
  
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('services.title')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gradient-primary/30 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4">
            <Link to="/solutions">
              {t('common.learn_more')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};