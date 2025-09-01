import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingCart, Settings, Mail, Calendar, Shield, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const ServicesSection = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: MessageCircle,
      title: t("services.chatbot.title"),
      subtitle: t("services.chatbot.subtitle"),
      description: t("services.chatbot.description"),
      features: [
        t("services.chatbot.feature1"),
        t("services.chatbot.feature2"),
        t("services.chatbot.feature3")
      ]
    },
    {
      icon: ShoppingCart,
      title: t("services.crm_sales.title"),
      subtitle: t("services.crm_sales.subtitle"),
      description: t("services.crm_sales.description"),
      features: [
        t("services.crm_sales.feature1"),
        t("services.crm_sales.feature2"),
        t("services.crm_sales.feature3"),
        t("services.crm_sales.feature4"),
        t("services.crm_sales.feature5")
      ]
    },
    {
      icon: Mail,
      title: t("services.emails.title"),
      subtitle: t("services.emails.subtitle"),
      description: "",
      features: [
        t("services.emails.feature1"),
        t("services.emails.feature2"),
        t("services.emails.feature3"),
        t("services.emails.feature4"),
        t("services.emails.feature5")
      ]
    },
    {
      icon: Calendar,
      title: t("services.calendars.title"),
      subtitle: t("services.calendars.subtitle"),
      description: "",
      features: [
        t("services.calendars.feature1"),
        t("services.calendars.feature2"),
        t("services.calendars.feature3"),
        t("services.calendars.feature4"),
        t("services.calendars.feature5")
      ]
    },
    {
      icon: Shield,
      title: t("services.security.title"),
      subtitle: t("services.security.subtitle"),
      description: "",
      features: [
        t("services.security.feature1"),
        t("services.security.feature2"),
        t("services.security.feature3"),
        t("services.security.feature4")
      ]
    },
    {
      icon: FileText,
      title: t("services.processing.title"),
      subtitle: t("services.processing.subtitle"),
      description: "",
      features: [
        t("services.processing.feature1"),
        t("services.processing.feature2"),
        t("services.processing.feature3"),
        t("services.processing.feature4"),
        t("services.processing.feature5")
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

        {/* Custom AI Automations Section */}
        <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card border-border/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('services.custom_ai.title')}
              </span>
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('services.custom_ai.description')}
            </p>
          </div>
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