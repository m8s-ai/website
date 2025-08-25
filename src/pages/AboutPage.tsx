import { PublicHeader } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Users, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";


export const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description')
    },
    {
      icon: Lightbulb,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: Target,
      title: t('about.values.impact.title'),
      description: t('about.values.impact.description')
    },
    {
      icon: Users,
      title: t('about.values.partnership.title'),
      description: t('about.values.partnership.description')
    }
  ];

  const team = [
    {
      name: t('about.team.or.name'),
      role: t('about.team.or.role'),
      expertise: t('about.team.or.speciality'),
      bio: t('about.team.or.description'),
      linkedin: "https://www.linkedin.com/in/or-sela/",
      avatar: "/lovable-uploads/79ffa5ae-75fb-432d-b7cc-d968c5e7d79e.png"
    },
    {
      name: t('about.team.idan.name'),
      role: t('about.team.idan.role'),
      expertise: t('about.team.idan.speciality'),
      bio: t('about.team.idan.description'),
      linkedin: "https://www.linkedin.com/in/idan-ayalon/",
      avatar: "/lovable-uploads/221691a0-a7fd-4f18-8bdd-27fd641333cb.png"
    }
  ];

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
                <span className="text-foreground">{t('about.hero.title1')}</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('about.hero.title2')}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('about.hero.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold">
                  <span className="text-foreground">{t('about.mission.title').split(' ')[0]}</span>{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">{t('about.mission.title').split(' ')[1]}</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.mission.description1')}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.mission.description2')}
                </p>
                <Button asChild className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                  <Link to="/contact" className="flex items-center gap-2">
                    {t('about.mission.learn_more')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="glass-card rounded-2xl p-8 border border-border/20">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">50+</div>
                    <div className="text-muted-foreground">{t('about.stats.clients')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">200+</div>
                    <div className="text-muted-foreground">{t('about.stats.automations')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">5</div>
                    <div className="text-muted-foreground">{t('about.stats.experience')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">99.9%</div>
                    <div className="text-muted-foreground">{t('about.stats.uptime')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-card opacity-30"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">{t('about.values.title').split(' ')[0]}</span>{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('about.values.title').split(' ')[1]}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('about.values.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
              {values.map((value) => (
                <Card key={value.title} className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

       
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">{t('about.cta.title').split(' ')[0]} {t('about.cta.title').split(' ')[1]} {t('about.cta.title').split(' ')[2]}</span>{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('about.cta.title').split(' ')[3]}?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('about.cta.description')}
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4">
                <Link to="/contact" className="flex items-center gap-2">
                  {t('about.cta.button')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};