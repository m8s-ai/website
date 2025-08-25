import { TrendingUp, Users, Clock, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const OutcomesSection = () => {
  const { t } = useLanguage();
  
  const outcomes = [
    {
      icon: Clock,
      title: t("outcomes.cost_reduction.title"),
      description: t("outcomes.cost_reduction.description"),
      metric: t("outcomes.cost_reduction.value"),
      metricLabel: t("outcomes.cost_reduction.label")
    },
    {
      icon: Users,
      title: t("outcomes.customer_experience.title"),
      description: t("outcomes.customer_experience.description"),
      metric: t("outcomes.customer_experience.value"),
      metricLabel: t("outcomes.customer_experience.label")
    },
    {
      icon: TrendingUp,
      title: t("outcomes.decision_making.title"),
      description: t("outcomes.decision_making.description"),
      metric: t("outcomes.decision_making.value"),
      metricLabel: t("outcomes.decision_making.label")
    },
    {
      icon: Target,
      title: t("outcomes.productivity.title"),
      description: t("outcomes.productivity.description"),
      metric: t("outcomes.productivity.value"),
      metricLabel: t("outcomes.productivity.label")
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('outcomes.title')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('outcomes.subtitle')}
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.title}
              className="animate-fade-in text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card rounded-2xl p-8 border border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-primary/30 transition-colors">
                  <outcome.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Metric */}
                <div className="mb-4">
                  <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
                    {outcome.metric}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {outcome.metricLabel}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {outcome.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};