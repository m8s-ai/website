import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = [
  { value: "50+", labelKey: "trust.stats.clients" },
  { value: "200+", labelKey: "trust.stats.automations" },
  { value: "99.9%", labelKey: "trust.stats.uptime" },
  { value: "60%", labelKey: "trust.stats.costReduction" }
];

export const TrustSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('trust.title')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('trust.subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.labelKey}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card rounded-2xl p-6 border border-border/20 hover:border-primary/50 transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {t(stat.labelKey)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {['testimonial1', 'testimonial2', 'testimonial3'].map((testimonialKey, index) => (
            <div
              key={testimonialKey}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/50 mb-4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{t(`trust.testimonials.${testimonialKey}.quote`)}"
                  </p>
                  <div className="border-t border-border/20 pt-4">
                    <div className="font-semibold text-foreground">
                      {t(`trust.testimonials.${testimonialKey}.author`)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(`trust.testimonials.${testimonialKey}.role`)}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {t(`trust.testimonials.${testimonialKey}.company`)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Client Logos Placeholder */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-muted-foreground mb-8 font-medium">
            {t('trust.trustedBy')}
          </p>
          <div className="flex justify-center items-center space-x-6 opacity-70 flex-wrap gap-4">
            <div className="flex items-center justify-center w-28 h-12 bg-muted/10 rounded border border-border/20 px-4">
              <span className="text-sm font-semibold text-muted-foreground">TechFlow</span>
            </div>
            <div className="flex items-center justify-center w-28 h-12 bg-muted/10 rounded border border-border/20 px-4">
              <span className="text-sm font-semibold text-muted-foreground">DataSync</span>
            </div>
            <div className="flex items-center justify-center w-28 h-12 bg-muted/10 rounded border border-border/20 px-4">
              <span className="text-sm font-semibold text-muted-foreground">ServicePro</span>
            </div>
            <div className="flex items-center justify-center w-28 h-12 bg-muted/10 rounded border border-border/20 px-4">
              <span className="text-sm font-semibold text-muted-foreground">GrowthMax</span>
            </div>
            <div className="flex items-center justify-center w-28 h-12 bg-muted/10 rounded border border-border/20 px-4">
              <span className="text-sm font-semibold text-muted-foreground">InnovateHub</span>
            </div>
            <div className="flex items-center justify-center w-28 h-12 bg-muted/10 rounded border border-border/20 px-4">
              <span className="text-sm font-semibold text-muted-foreground">FutureScale</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};