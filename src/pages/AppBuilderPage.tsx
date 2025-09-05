import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/PublicHeader";
import { ArrowRight, MessageSquare, FileText, Smartphone, DollarSign, CheckCircle, Zap, Clock, Shield } from "lucide-react";
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
      title: "From Idea to Working App in 30 Minutes",
      subtitle: "See your app come to life before you invest a penny",
      focus: "speed"
    },
    B: {
      title: "See Your App Before You Build It",
      subtitle: "Get a working prototype to test with users and investors",
      focus: "risk"
    },
    C: {
      title: "Know Exactly What Your App Will Cost",
      subtitle: "Accurate pricing and timeline before you commit",
      focus: "cost"
    },
    D: {
      title: "No Technical Knowledge Required",
      subtitle: "Our AI handles the complex stuff, you focus on your vision",
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
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Social Proof Badge */}
            <div className="animate-fade-in mb-6">
              <Badge className="bg-gradient-primary/10 border-primary/20 text-primary">
                ✨ Interactive Project Validation System
              </Badge>
            </div>

            {/* Dynamic A/B Testing Headlines */}
            <div className="animate-slide-up mb-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight font-display">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {currentVariant.title}
                </span>
              </h1>
            </div>

            <div className="animate-fade-in mb-8" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {currentVariant.subtitle}
              </p>
            </div>

            {/* Process Flow */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Chat About Your Idea</h3>
                <p className="text-sm text-muted-foreground">Tell us your app vision in plain English</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Get Professional Docs</h3>
                <p className="text-sm text-muted-foreground">PRD, architecture & flow diagrams</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">See Working Prototype</h3>
                <p className="text-sm text-muted-foreground">Test your app in real-time</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Get Accurate Quote</h3>
                <p className="text-sm text-muted-foreground">Know exactly what it costs to build</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Get Your App Prototype in 24 Hours</CardTitle>
                <CardDescription className="text-lg">
                  Tell us about your app idea and we'll create a working prototype you can test and share
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
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
                    <label className="block text-sm font-medium mb-2">Describe Your App Idea *</label>
                    <Textarea
                      required
                      value={formData.appIdea}
                      onChange={(e) => setFormData(prev => ({ ...prev, appIdea: e.target.value }))}
                      placeholder="Tell us what your app should do, who it's for, and what problems it solves..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <Input
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g., Healthcare, Finance, E-commerce"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Desired Timeline</label>
                      <Input
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        placeholder="e.g., 3 months, ASAP, Q2 2025"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-gradient-primary hover:scale-105 text-white shadow-glow py-6 text-xl font-bold transform transition-all duration-300"
                  >
                    Get My App Prototype <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    No commitment required • Free prototype review • 24-hour turnaround
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Smart Founders Choose Our <span className="bg-gradient-primary bg-clip-text text-transparent">Validation System</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Lightning Fast</h3>
                </div>
                <p className="text-muted-foreground">
                  Get your working prototype in 24 hours, not weeks. Perfect for investor meetings and user testing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Risk-Free Validation</h3>
                </div>
                <p className="text-muted-foreground">
                  See exactly what you're getting before investing in full development. No surprises, no regrets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Save Months</h3>
                </div>
                <p className="text-muted-foreground">
                  Skip the traditional discovery phase. Our AI conversation extracts everything needed for accurate planning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <CheckCircle key={i} className="h-6 w-6 text-green-500 mx-1" />
            ))}
          </div>
          <p className="text-lg font-medium text-muted-foreground mb-4">
            "This prototype helped us raise $2M in seed funding. Investors could actually see and test our vision."
          </p>
          <p className="text-sm text-muted-foreground">
            — Sarah Chen, CEO of TechStart (Y Combinator W23)
          </p>
        </div>
      </section>
    </div>
  );
};