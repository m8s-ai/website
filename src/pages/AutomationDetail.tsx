import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { mockAutomations } from "@/data/mockData";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Star, Play, Youtube } from "lucide-react";

export const AutomationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const automation = mockAutomations.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!automation) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Automation Not Found</h2>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-accent text-accent-foreground";
    if (score >= 80) return "bg-primary text-primary-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  const handleUseAutomation = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = automation.url;
    link.download = `${automation.name.replace(/[^a-z0-9]/gi, '_')}_automation.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleYouTubeClick = () => {
    if (automation.youtube_url) {
      window.open(automation.youtube_url, '_blank');
    }
  };

  const getYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.replace('/', '').split('/')[0] || null;
      }
      const v = u.searchParams.get('v');
      if (v) return v;
      const match = u.pathname.match(/\/embed\/([\w-]+)/) || u.href.match(/v=([\w-]+)/);
      return match ? match[1] : null;
    } catch {
      const rx = /(youtu\.be\/([\w-]+)|v=([\w-]+))/;
      const m = url.match(rx);
      return m ? (m[2] || m[3]) : null;
    }
  };

  const ytId = automation.youtube_url ? getYouTubeId(automation.youtube_url) : null;
  const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
              </Button>
            </Link>
          </div>

          <Card className="glass-card border border-border/20 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                      {automation.name}
                    </h1>
                    <Badge className={`font-bold text-lg px-3 py-1 ${getScoreColor(automation.score)}`}>
                      <Star className="mr-1 h-4 w-4" />
                      {automation.score}
                    </Badge>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {automation.description}
                  </p>

                  <Button 
                    onClick={handleUseAutomation}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold"
                  >
                    Download Automation
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* YouTube Preview Section */}
          {automation.youtube_url && (
            <Card className="glass-card border border-border/20 mb-8">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                  <Youtube className="h-6 w-6 text-red-500" />
                  Video Tutorial
                </h3>
                <div 
                  className="relative group cursor-pointer rounded-xl overflow-hidden bg-gradient-secondary"
                  onClick={handleYouTubeClick}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={thumbnailUrl ?? "/placeholder.svg"}
                      alt={`${automation.name} - YouTube preview thumbnail`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                        <Play className="h-8 w-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-semibold text-lg">Watch Tutorial</p>
                    <p className="text-white/80 text-sm">Learn how to implement this automation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-card border border-border/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">About This Automation</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Quality Score</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-primary rounded-full transition-all duration-500"
                          style={{ width: `${automation.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {automation.score}/100
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Category</h4>
                    <Badge variant="secondary">{automation.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Platform</h4>
                    <Badge variant="outline">n8n Workflow</Badge>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};