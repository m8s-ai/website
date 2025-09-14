import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, Headphones, Settings, Users, Stethoscope, Calculator, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const IndustriesSection = () => {
  const { t } = useLanguage();

  const industries = [
    {
      icon: CreditCard,
      title: t("industries.fintech.title"),
      description: t("industries.fintech.description"),
      useCases: [
        t("industries.fintech.solution1"),
        t("industries.fintech.solution2"),
        t("industries.fintech.solution3"),
        t("industries.fintech.solution4")
      ]
    },
    {
      icon: Headphones,
      title: t("industries.customer_experience.title"),
      description: t("industries.customer_experience.description"),
      useCases: [
        t("industries.customer_experience.solution1"),
        t("industries.customer_experience.solution2"),
        t("industries.customer_experience.solution3"),
        t("industries.customer_experience.solution4")
      ]
    },
    {
      icon: Settings,
      title: t("industries.back_office.title"),
      description: t("industries.back_office.description"),
      useCases: [
        t("industries.back_office.solution1"),
        t("industries.back_office.solution2"),
        t("industries.back_office.solution3"),
        t("industries.back_office.solution4")
      ]
    },
    {
      icon: Users,
      title: t("industries.horizontal.title"),
      description: t("industries.horizontal.description"),
      useCases: [
        t("industries.horizontal.solution1"),
        t("industries.horizontal.solution2"),
        t("industries.horizontal.solution3"),
        t("industries.horizontal.solution4")
      ]
    },
    {
      icon: Stethoscope,
      title: t("industries.medical.title"),
      description: t("industries.medical.description"),
      useCases: [
        t("industries.medical.solution1"),
        t("industries.medical.solution2"),
        t("industries.medical.solution3"),
        t("industries.medical.solution4")
      ]
    },
    {
      icon: Calculator,
      title: t("industries.accounting.title"),
      description: t("industries.accounting.description"),
      useCases: [
        t("industries.accounting.solution1"),
        t("industries.accounting.solution2"),
        t("industries.accounting.solution3"),
        t("industries.accounting.solution4")
      ]
    },
    {
      icon: Scale,
      title: t("industries.legal.title"),
      description: t("industries.legal.description"),
      useCases: [
        t("industries.legal.solution1"),
        t("industries.legal.solution2"),
        t("industries.legal.solution3"),
        t("industries.legal.solution4")
      ]
    }
  ];

  return (
    <section className="pt-12 md:pt-16 pb-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('industries.title')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('industries.subtitle')}
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {industries.map((industry, index) => (
            <div
              key={industry.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center group-hover:bg-gradient-primary/30 transition-colors">
                      <industry.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {industry.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CardDescription className="text-muted-foreground leading-relaxed text-base">
                    {industry.description}
                  </CardDescription>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">{t("industries.key_use_cases")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {industry.useCases.map((useCase) => (
                        <div key={useCase} className="flex items-start text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full ltr:mr-3 rtl:ml-3 mt-2 flex-shrink-0"></div>
                          <span>{useCase}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4">
            <Link to="/industries">
              {t('common.learn_more')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};