import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/PublicHeader";
import { InteractiveChatDemo } from "@/components/InteractiveChatDemo";
import { ArrowRight, ArrowLeft, MessageSquare, FileText, Smartphone, DollarSign, CheckCircle, Zap, Clock, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AppBuilderPage = () => {
  const { t, isRTL } = useLanguage();
  const [variant, setVariant] = useState('A');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appIdea: '',
    industry: '',
    timeline: ''
  });

  // A/B Test variants
  const variants = {
    A: {
      title: t('app_builder.hero.title_a'),
      subtitle: t('app_builder.hero.subtitle_a'),
      focus: "speed"
    },
    B: {
      title: t('app_builder.hero.title_b'),
      subtitle: t('app_builder.hero.subtitle_b'),
      focus: "risk"
    },
    C: {
      title: t('app_builder.hero.title_c'),
      subtitle: t('app_builder.hero.subtitle_c'),
      focus: "cost"
    },
    D: {
      title: t('app_builder.hero.title_d'),
      subtitle: t('app_builder.hero.subtitle_d'),
      focus: "simplicity"
    }
  };

  useEffect(() => {
    // Simple A/B test assignment
    const variants_keys = ['A', 'B', 'C', 'D'];
    const assigned = variants_keys[Math.floor(Math.random() * variants_keys.length)];
    setVariant(assigned);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'lead_generation',
        event_label: `variant_${variant}`,
        value: 1
      });
    }
    
    // Handle form submission
    console.log('Form submitted:', { ...formData, variant });
    alert('Thank you! We\'ll be in touch within 24 hours to start building your app prototype.');
  };

  const currentVariant = variants[variant as keyof typeof variants];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
        <div className="absolute inset-0">
          {/* Floating neon orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/15 to-cyan-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Social Proof Badge */}
            <div className="animate-fade-in mb-6">
              <Badge className="bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-sm">
                ✨ Interactive Project Validation System
              </Badge>
            </div>

            {/* Enhanced Dynamic Headlines */}
            <div className="animate-slide-up mb-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight font-display">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                  {currentVariant.title}
                </span>
              </h1>
            </div>

            <div className="animate-fade-in mb-12" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {currentVariant.subtitle}
              </p>
            </div>

            {/* Process Flow - Above Chat */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{t('app_builder.process.docs_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('app_builder.process.docs_description')}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{t('app_builder.process.prototype_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('app_builder.process.prototype_description')}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{t('app_builder.process.quote_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('app_builder.process.quote_description')}</p>
              </div>
            </div>
            
            {/* Interactive Chat Demo */}
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <InteractiveChatDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Lead Capture Form */}
      <section className="py-12 bg-black/20 backdrop-blur-xl relative overflow-hidden">
        {/* Form background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="border-cyan-500/30 shadow-2xl bg-black/40 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{t('app_builder.form.title')}</CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  {t('app_builder.form.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('app_builder.form.name_label')} *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('app_builder.form.name_label')}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('app_builder.form.email_label')} *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('app_builder.form.idea_label')} *</label>
                    <Textarea
                      required
                      value={formData.appIdea}
                      onChange={(e) => setFormData(prev => ({ ...prev, appIdea: e.target.value }))}
                      placeholder={t('app_builder.form.idea_placeholder')}
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('app_builder.form.industry_label')}</label>
                      <Input
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder={t('app_builder.form.industry_placeholder')}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('app_builder.form.timeline_label')}</label>
                      <Input
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        placeholder={t('app_builder.form.timeline_placeholder')}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-gradient-primary hover:scale-105 text-white shadow-glow py-6 text-xl font-bold transform transition-all duration-300"
                  >
                    {t('app_builder.form.submit')} {isRTL ? <ArrowLeft className="mr-2 h-6 w-6" /> : <ArrowRight className="ml-2 h-6 w-6" />}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    {t('app_builder.form.disclaimer')}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Trust & Features Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Section background effects */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('app_builder.trust.title').split(' Validation System')[0]} <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Validation System</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 bg-black/20 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg mr-3 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300">
                    <Zap className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">{t('app_builder.features.speed_title')}</h3>
                </div>
                <p className="text-gray-400">
                  {t('app_builder.features.speed_description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 bg-black/20 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg mr-3 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">{t('app_builder.features.risk_title')}</h3>
                </div>
                <p className="text-gray-400">
                  {t('app_builder.features.risk_description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-400/20 hover:border-pink-400/40 transition-all duration-300 bg-black/20 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] group">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-lg mr-3 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300">
                    <Clock className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">{t('app_builder.features.time_title')}</h3>
                </div>
                <p className="text-gray-400">
                  {t('app_builder.features.time_description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof */}
      <section className="py-12 bg-black/20 backdrop-blur-xl relative overflow-hidden">
        {/* Social proof background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mx-1 relative">
                <CheckCircle className="h-6 w-6 text-green-400 drop-shadow-lg" />
                <div className="absolute inset-0 rounded-full border border-green-400/30 animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
              </div>
            ))}
          </div>
          <p className="text-lg font-medium text-gray-200 mb-4 max-w-2xl mx-auto">
            "{t('app_builder.social_proof.quote')}"
          </p>
          <p className="text-sm text-gray-400">
            — <span className="text-cyan-400">{t('app_builder.social_proof.author')}</span>
          </p>
        </div>
      </section>
    </div>
  );
};