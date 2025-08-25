import { PublicHeader } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Download, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";


export const ResourcesPage = () => {
  const { t } = useLanguage();

  const resourceCategories = [
    {
      title: t('resources.guides.title'),
      icon: BookOpen,
      resources: [
        {
          title: t('resources.guides.whitepaper.title'),
          description: t('resources.guides.whitepaper.description'),
          type: t('resources.guides.whitepaper.type'),
          downloadLink: "#",
          readTime: t('resources.guides.whitepaper.duration')
        },
        {
          title: t('resources.guides.guide.title'),
          description: t('resources.guides.guide.description'),
          type: t('resources.guides.guide.type'),
          downloadLink: "#",
          readTime: t('resources.guides.guide.duration')
        },
        {
          title: t('resources.guides.framework.title'),
          description: t('resources.guides.framework.description'),
          type: t('resources.guides.framework.type'),
          downloadLink: "#",
          readTime: t('resources.guides.framework.duration')
        }
      ]
    },
    {
      title: t('resources.cases.title'),
      icon: FileText,
      resources: [
        {
          title: t('resources.cases.fintech.title'),
          description: t('resources.cases.fintech.description'),
          type: t('resources.cases.fintech.type'),
          downloadLink: "#",
          readTime: t('resources.cases.fintech.duration')
        },
        {
          title: t('resources.cases.manufacturing.title'),
          description: t('resources.cases.manufacturing.description'),
          type: t('resources.cases.manufacturing.type'),
          downloadLink: "#",
          readTime: t('resources.cases.manufacturing.duration')
        }
      ]
    },
    {
      title: t('resources.webinars.title'),
      icon: Video,
      resources: [
        {
          title: t('resources.webinars.future.title'),
          description: t('resources.webinars.future.description'),
          type: t('resources.webinars.future.type'),
          downloadLink: "#",
          readTime: t('resources.webinars.future.duration')
        },
        {
          title: t('resources.webinars.generative.title'),
          description: t('resources.webinars.generative.description'),
          type: t('resources.webinars.generative.type'),
          downloadLink: "#",
          readTime: t('resources.webinars.generative.duration')
        }
      ]
    }
  ];

  const blogPosts = [
    {
      title: t('resources.insights.trends.title'),
      excerpt: t('resources.insights.trends.description'),
      category: t('resources.insights.trends.category'),
      readTime: t('resources.insights.trends.duration'),
      date: t('resources.insights.trends.date')
    },
    {
      title: t('resources.insights.ethics.title'),
      excerpt: t('resources.insights.ethics.description'),
      category: t('resources.insights.ethics.category'),
      readTime: t('resources.insights.ethics.duration'),
      date: t('resources.insights.ethics.date')
    },
    {
      title: t('resources.insights.business.title'),
      excerpt: t('resources.insights.business.description'),
      category: t('resources.insights.business.category'),
      readTime: t('resources.insights.business.duration'),
      date: t('resources.insights.business.date')
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
                <span className="text-foreground">Knowledge</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('resources.title')}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('resources.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {resourceCategories.map((category) => (
                <div key={category.title}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.resources.map((resource) => (
                      <Card key={resource.title} className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {resource.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                          </div>
                          <CardTitle className="text-xl text-foreground">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="text-muted-foreground">
                            {resource.description}
                          </CardDescription>
                          <Button asChild variant="outline" className="w-full">
                            <a href={resource.downloadLink} className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              {t('resources.download')}
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-card opacity-30"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">{t('resources.insights.title').split(' ')[0]}</span>{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('resources.insights.title').split(' ')[1]}</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('resources.insights.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogPosts.map((post) => (
                <Card key={post.title} className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-foreground hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-muted-foreground">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        {t('resources.read_more')} <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="px-8 py-4">
                {t('resources.view_all_posts')}
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-3xl p-12 border border-border/20 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-foreground">{t('resources.newsletter.title').split(' ')[0]}</span>{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('resources.newsletter.title').split(' ')[1]}</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('resources.newsletter.description')}
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                <Link to="/contact">
                  {t('resources.newsletter.button')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};