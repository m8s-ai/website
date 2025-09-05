import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const CTASection = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <section className="pt-12 md:pt-16 pb-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-card rounded-3xl p-12 md:p-16 border border-border/20 max-w-4xl mx-auto text-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('cta.title')}
              </span>
            </h2>
          </div>

          <div className="animate-fade-in mb-12" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('cta.subtitle')}
            </p>
          </div>

          <div className="animate-scale-in flex flex-col sm:flex-row gap-6 justify-center items-center" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4 text-lg font-semibold">
              <Link to="/contact" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('cta.button')}
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/10 border-primary/30">
              <Link to="/app-builder" className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Try App Builder
                {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
              </Link>
            </Button>
          </div>

          <div className="animate-fade-in mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center text-center" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Free consultation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">No commitment required</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Custom roadmap included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};