import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Laptop, Smartphone, ShoppingCart, Bot, CreditCard, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const ServicesSection = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Laptop,
      title: t("services.saas.title"),
      subtitle: t("services.saas.subtitle"),
      description: t("services.saas.description"),
      features: [
        t("services.saas.feature1"),
        t("services.saas.feature2"),
        t("services.saas.feature3")
      ]
    },
    {
      icon: Smartphone,
      title: t("services.mobile.title"),
      subtitle: t("services.mobile.subtitle"),
      description: t("services.mobile.description"),
      features: [
        t("services.mobile.feature1"),
        t("services.mobile.feature2"),
        t("services.mobile.feature3"),
        t("services.mobile.feature4"),
        t("services.mobile.feature5")
      ]
    },
    {
      icon: ShoppingCart,
      title: t("services.ecommerce.title"),
      subtitle: t("services.ecommerce.subtitle"),
      description: t("services.ecommerce.description"),
      features: [
        t("services.ecommerce.feature1"),
        t("services.ecommerce.feature2"),
        t("services.ecommerce.feature3"),
        t("services.ecommerce.feature4"),
        t("services.ecommerce.feature5")
      ]
    },
    {
      icon: Bot,
      title: t("services.ai_powered.title"),
      subtitle: t("services.ai_powered.subtitle"),
      description: t("services.ai_powered.description"),
      features: [
        t("services.ai_powered.feature1"),
        t("services.ai_powered.feature2"),
        t("services.ai_powered.feature3"),
        t("services.ai_powered.feature4")
      ]
    },
    {
      icon: CreditCard,
      title: t("services.fintech.title"),
      subtitle: t("services.fintech.subtitle"),
      description: t("services.fintech.description"),
      features: [
        t("services.fintech.feature1"),
        t("services.fintech.feature2"),
        t("services.fintech.feature3"),
        t("services.fintech.feature4"),
        t("services.fintech.feature5")
      ]
    },
    {
      icon: Store,
      title: t("services.marketplace.title"),
      subtitle: t("services.marketplace.subtitle"),
      description: t("services.marketplace.description"),
      features: [
        t("services.marketplace.feature1"),
        t("services.marketplace.feature2"),
        t("services.marketplace.feature3"),
        t("services.marketplace.feature4"),
        t("services.marketplace.feature5")
      ]
    }
  ];
  
  return (
    <section className="pt-12 md:pt-16 pb-24 relative">
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
                    {service.subtitle}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground font-medium">
                    {service.title}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.description && (
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  )}
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full ltr:mr-3 rtl:ml-3 mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Urgency CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="glass-card border-border/20 rounded-2xl p-8 max-w-2xl mx-auto mb-8">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400 animate-pulse">
                ⚡ Limited Time: 3 Spots Left for Q1 2025
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Build Your Million-Dollar App?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Join the ranks of successful founders. Book your free strategy call now.
            </p>
            <Button asChild size="lg" className="bg-gradient-primary hover:scale-105 text-white shadow-glow px-12 py-4 text-xl font-bold transform transition-all duration-300">
              <Link to="/contact">
                Book Your FREE Strategy Call →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};