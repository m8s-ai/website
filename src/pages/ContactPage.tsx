import { PublicHeader } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Mail, MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContactPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const contactMethods = [
    {
      icon: Phone,
      title: t('contact.phone'),
      description: t('contact.phone_description'),
      contact: "+1 (438) 867-6782",
      availability: t('contact.phone_availability')
    },
    {
      icon: Mail,
      title: t('contact.email'),
      description: t('contact.email_description'),
      contact: "support@automate-agency.ai",
      availability: t('contact.email_availability')
    }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    projectType: "ai-automation",
    timeline: "1-3-months",
    budget: "discuss",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending contact form to Make webhook...", formData);
      
      const payload = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        projectType: formData.projectType,
        timeline: formData.timeline,
        budget: formData.budget,
        message: formData.message,
        timestamp: new Date().toISOString(),
        source: "contact_form",
        page: window.location.pathname,
      };

      console.log("Payload being sent:", payload);

      await fetch("https://hook.eu2.make.com/uaywvrt71phw9uvgqoqkysv7i24zaori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast({
        title: t('contact.success'),
        description: t('contact.promise_description'),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        industry: "",
        projectType: "ai-automation",
        timeline: "1-3-months",
        budget: "discuss",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: t('contact.error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('contact.title')}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-border/20 p-8">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl text-foreground">{t('contact.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('contact.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">{t('contact.form.name')} *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder={language === 'he' ? 'שמוליק כהן' : 'John Doe'}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">{t('contact.form.email')} *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder={language === 'he' ? 'smulik@company.co.il' : 'john@company.com'}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="company">{t('contact.form.company')} *</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder={language === 'he' ? 'החברה שלך' : 'Your Company'}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">{t('contact.form.industry')}</Label>
                          <Select onValueChange={(value) => handleInputChange("industry", value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder={t('contact.form.industry.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="healthcare">{t('contact.form.industry.healthcare')}</SelectItem>
                              <SelectItem value="finance">{t('contact.form.industry.finance')}</SelectItem>
                              <SelectItem value="retail">{t('contact.form.industry.retail')}</SelectItem>
                              <SelectItem value="manufacturing">{t('contact.form.industry.manufacturing')}</SelectItem>
                              <SelectItem value="technology">{t('contact.form.industry.technology')}</SelectItem>
                              <SelectItem value="education">{t('contact.form.industry.education')}</SelectItem>
                              <SelectItem value="other">{t('contact.form.industry.other')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="projectType">{t('contact.form.project_type')}</Label>
                          <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder={t('contact.form.project_type.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ai-automation">{t('contact.form.project_type.ai_automation')}</SelectItem>
                              <SelectItem value="process-optimization">{t('contact.form.project_type.process_optimization')}</SelectItem>
                              <SelectItem value="data-analysis">{t('contact.form.project_type.data_analysis')}</SelectItem>
                              <SelectItem value="custom-integration">{t('contact.form.project_type.custom_integration')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="timeline">{t('contact.form.timeline')}</Label>
                          <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder={t('contact.form.timeline.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="urgent">{t('contact.form.timeline.urgent')}</SelectItem>
                              <SelectItem value="1-3-months">{t('contact.form.timeline.1_3_months')}</SelectItem>
                              <SelectItem value="3-6-months">{t('contact.form.timeline.3_6_months')}</SelectItem>
                              <SelectItem value="6-plus-months">{t('contact.form.timeline.6_plus_months')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="budget">{t('contact.form.budget')}</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder={t('contact.form.budget.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discuss">{t('contact.form.budget.discuss')}</SelectItem>
                            <SelectItem value="10k-25k">{t('contact.form.budget.10k_25k')}</SelectItem>
                            <SelectItem value="25k-50k">{t('contact.form.budget.25k_50k')}</SelectItem>
                            <SelectItem value="50k-100k">{t('contact.form.budget.50k_100k')}</SelectItem>
                            <SelectItem value="100k-plus">{t('contact.form.budget.100k_plus')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">{t('contact.form.message')} *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder={t('contact.form.message.placeholder')}
                          required
                          className="mt-2 min-h-[120px]"
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow" disabled={isSubmitting}>
                        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Contact Methods */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">{t('contact.get_in_touch')}</h3>
                  {contactMethods.map((method) => (
                    <Card key={method.title} className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <method.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{method.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                            <p className="font-medium text-foreground">{method.contact}</p>
                            <p className="text-xs text-muted-foreground">{method.availability}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card className="glass-card border-border/20 p-6">
                  <h4 className="font-semibold text-foreground mb-4">{t('contact.quick_actions')}</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="#" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('contact.schedule_call')}
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="#" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('contact.book_assessment')}
                      </a>
                    </Button>
                  </div>
                </Card>

                {/* Response Promise */}
                <Card className="glass-card border-border/20 p-6 bg-gradient-primary/5">
                  <h4 className="font-semibold text-foreground mb-2">{t('contact.promise')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('contact.promise_description')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};