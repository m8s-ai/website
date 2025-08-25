import { PublicHeader } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, Cog, Users, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";


export const SolutionsPage = () => {
  const { t } = useLanguage();

  const solutions = [
    {
      icon: Bot,
      title: t('solutions.ai_automation.title'),
      description: t('solutions.ai_automation.description'),
      features: [
        t('solutions.ai_automation.feature1'),
        t('solutions.ai_automation.feature2'),
        t('solutions.ai_automation.feature3'),
        t('solutions.ai_automation.feature4')
      ],
      benefits: [
        t('solutions.ai_automation.benefit1'),
        t('solutions.ai_automation.benefit2'),
        t('solutions.ai_automation.benefit3')
      ]
    },
    {
      icon: Brain,
      title: t('solutions.generative_ai.title'),
      description: t('solutions.generative_ai.description'),
      features: [
        t('solutions.generative_ai.feature1'),
        t('solutions.generative_ai.feature2'),
        t('solutions.generative_ai.feature3'),
        t('solutions.generative_ai.feature4')
      ],
      benefits: [
        t('solutions.generative_ai.benefit1'),
        t('solutions.generative_ai.benefit2'),
        t('solutions.generative_ai.benefit3')
      ]
    },
    {
      icon: Cog,
      title: t('solutions.enterprise_ai.title'),
      description: t('solutions.enterprise_ai.description'),
      features: [
        t('solutions.enterprise_ai.feature1'),
        t('solutions.enterprise_ai.feature2'),
        t('solutions.enterprise_ai.feature3'),
        t('solutions.enterprise_ai.feature4')
      ],
      benefits: [
        t('solutions.enterprise_ai.benefit1'),
        t('solutions.enterprise_ai.benefit2'),
        t('solutions.enterprise_ai.benefit3')
      ]
    },
    {
      icon: Users,
      title: t('solutions.consulting.title'),
      description: t('solutions.consulting.description'),
      features: [
        t('solutions.consulting.feature1'),
        t('solutions.consulting.feature2'),
        t('solutions.consulting.feature3'),
        t('solutions.consulting.feature4')
      ],
      benefits: [
        t('solutions.consulting.benefit1'),
        t('solutions.consulting.benefit2'),
        t('solutions.consulting.benefit3')
      ]
    },
    {
      icon: Zap,
      title: t('solutions.rpa.title'),
      description: t('solutions.rpa.description'),
      features: [
        t('solutions.rpa.feature1'),
        t('solutions.rpa.feature2'),
        t('solutions.rpa.feature3'),
        t('solutions.rpa.feature4')
      ],
      benefits: [
        t('solutions.rpa.benefit1'),
        t('solutions.rpa.benefit2'),
        t('solutions.rpa.benefit3')
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('solutions.hero.title')}
                </span>
                <br />
                <span className="text-foreground">{t('solutions.hero.subtitle')}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('solutions.hero.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {solutions.map((solution, index) => (
                <div
                  key={solution.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                        <solution.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground">{solution.title}</h2>
                    </div>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground">{t('solutions.key_features')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {solution.features.map((feature) => (
                          <div key={feature} className="flex items-center text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground">{t('solutions.benefits')}</h3>
                      <div className="space-y-2">
                        {solution.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button asChild className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                      <Link to="/contact" className="flex items-center gap-2">
                        {t('common.learn_more')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Visual */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="glass-card rounded-2xl p-8 border border-border/20 h-80 flex items-center justify-center">
                      <div className="text-center">
                        <solution.icon className="h-24 w-24 text-primary/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">{t('solutions.visual.placeholder')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">{t('solutions.cta.title')}</span>{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('solutions.cta.subtitle')}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('solutions.cta.description')}
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4">
                <Link to="/contact">
                  {t('solutions.cta.button')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};