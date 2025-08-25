import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <div className="animate-slide-up mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('hero.accelerate_growth')}
              </span>
              <br />
              <span className="text-foreground">
                {t('hero.with_ai_automation')}
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <div className="animate-fade-in mb-12" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              {t('hero.subtitle')}
              <span className="text-primary font-semibold"> {t('hero.enterprise_ready')}</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-scale-in flex flex-col sm:flex-row gap-6 justify-center items-center" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4 text-lg font-semibold">
              <Link to="/contact" className="flex items-center gap-2">
                {t('hero.book_strategy_call')}
                {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/10">
              <Link to="/solutions" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {t('hero.explore_use_cases')}
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};