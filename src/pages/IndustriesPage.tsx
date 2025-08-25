import { PublicHeader } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CreditCard, Headphones, Settings, ArrowRight } from "lucide-react";
import { CustomerStoriesCarousel } from "@/components/sections/CustomerStoriesCarousel";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const IndustriesPage = () => {
  const { t } = useLanguage();

  const industries = [
    {
      icon: CreditCard,
      titleKey: "industries.fintech.title",
      descriptionKey: "industries.fintech.description",
      challengeKeys: [
        "industries.fintech.challenge1",
        "industries.fintech.challenge2", 
        "industries.fintech.challenge3",
        "industries.fintech.challenge4"
      ],
      solutionKeys: [
        "industries.fintech.solution1",
        "industries.fintech.solution2",
        "industries.fintech.solution3", 
        "industries.fintech.solution4"
      ],
      resultKeys: [
        "industries.fintech.result1",
        "industries.fintech.result2",
        "industries.fintech.result3"
      ]
    },
    {
      icon: Headphones,
      titleKey: "industries.customer_experience.title",
      descriptionKey: "industries.customer_experience.description",
      challengeKeys: [
        "industries.customer_experience.challenge1",
        "industries.customer_experience.challenge2",
        "industries.customer_experience.challenge3",
        "industries.customer_experience.challenge4"
      ],
      solutionKeys: [
        "industries.customer_experience.solution1",
        "industries.customer_experience.solution2",
        "industries.customer_experience.solution3",
        "industries.customer_experience.solution4"
      ],
      resultKeys: [
        "industries.customer_experience.result1",
        "industries.customer_experience.result2",
        "industries.customer_experience.result3"
      ]
    },
    {
      icon: Settings,
      titleKey: "industries.back_office.title",
      descriptionKey: "industries.back_office.description",
      challengeKeys: [
        "industries.back_office.challenge1",
        "industries.back_office.challenge2",
        "industries.back_office.challenge3",
        "industries.back_office.challenge4"
      ],
      solutionKeys: [
        "industries.back_office.solution1",
        "industries.back_office.solution2",
        "industries.back_office.solution3",
        "industries.back_office.solution4"
      ],
      resultKeys: [
        "industries.back_office.result1",
        "industries.back_office.result2",
        "industries.back_office.result3"
      ]
    },
    {
      icon: Building2,
      titleKey: "industries.horizontal.title",
      descriptionKey: "industries.horizontal.description",
      challengeKeys: [
        "industries.horizontal.challenge1",
        "industries.horizontal.challenge2",
        "industries.horizontal.challenge3",
        "industries.horizontal.challenge4"
      ],
      solutionKeys: [
        "industries.horizontal.solution1",
        "industries.horizontal.solution2",
        "industries.horizontal.solution3",
        "industries.horizontal.solution4"
      ],
      resultKeys: [
        "industries.horizontal.result1",
        "industries.horizontal.result2",
        "industries.horizontal.result3"
      ]
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
                <span className="text-foreground">{t('industries.page_title').split(' ')[0]} {t('industries.page_title').split(' ')[1]}</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('industries.page_title').split(' ')[2]}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('industries.page_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="space-y-24">
              {industries.map((industry, index) => (
                <div key={t(industry.titleKey)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Overview */}
                  <div className="lg:col-span-3">
                    <Card className="glass-card border-border/20 p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                          <industry.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">{t(industry.titleKey)}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {t(industry.descriptionKey)}
                      </p>
                    </Card>
                  </div>

                  {/* Challenges */}
                  <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">{t('industries.common_challenges')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {industry.challengeKeys.map((challengeKey) => (
                          <li key={challengeKey} className="flex items-start text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {t(challengeKey)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Solutions */}
                  <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">{t('industries.our_solutions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {industry.solutionKeys.map((solutionKey) => (
                          <li key={solutionKey} className="flex items-start text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {t(solutionKey)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Results */}
                  <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">{t('industries.typical_results')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {industry.resultKeys.map((resultKey) => (
                          <li key={resultKey} className="flex items-start text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {t(resultKey)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Stories Section */}
        <CustomerStoriesCarousel />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">{t('industries.ready_to_transform').split(' ')[0]} {t('industries.ready_to_transform').split(' ')[1]} {t('industries.ready_to_transform').split(' ')[2]}</span>{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('industries.ready_to_transform').split(' ').slice(3).join(' ')}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('industries.consultation_description')}
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-4">
                <Link to="/contact" className="flex items-center gap-2">
                  {t('industries.get_consultation')}
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