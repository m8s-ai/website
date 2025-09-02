import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Social Proof Badge */}
          <div className="animate-fade-in mb-6" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 border border-primary/20 text-sm font-medium text-primary">
              {t('hero.trusted_by_founders')}
            </div>
          </div>

          {/* Main Headline */}
          <div className="animate-slide-up mb-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight font-display">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('hero.we_build_apps')}
              </span>
              <br />
              <span className="text-foreground">
                {t('hero.that_make_you_rich')}
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <div className="animate-fade-in mb-8" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Revenue Guarantee */}
          <div className="animate-pulse mb-6" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-lg font-bold text-green-400 shadow-glow">
              {t('hero.revenue_guarantee')}
            </div>
          </div>

          {/* Urgency Banner */}
          <div className="animate-bounce mb-8" style={{ animationDelay: '0.35s' }}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400">
              {t('hero.next_batch_spots')}
            </div>
          </div>

          {/* CTA Button - Single, Powerful */}
          <div className="animate-scale-in mb-12" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="bg-gradient-primary hover:scale-105 text-white shadow-glow px-12 py-6 text-xl font-bold transform transition-all duration-300">
              <Link to="/contact" className="flex items-center gap-3">
                {t('hero.book_strategy_call')}
                {isRTL ? <ArrowLeft className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
              </Link>
            </Button>
          </div>

          {/* Bottom Social Proof */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-sm md:text-base text-muted-foreground font-medium opacity-80">
              {t('hero.social_proof')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};