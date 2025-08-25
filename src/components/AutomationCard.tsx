import { AutomationNugget } from "@/types/automation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface AutomationCardProps {
  automation: AutomationNugget;
}

export const AutomationCard = ({ automation }: AutomationCardProps) => {
  const { isRTL } = useLanguage();
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-accent text-accent-foreground";
    if (score >= 80) return "bg-primary text-primary-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <Link to={`/automation/${automation.id}`} className="block group">
      <Card className="h-full glass-card hover:shadow-card-hover transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1 border border-border/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardContent className="p-6 h-full flex flex-col relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1 mr-3">
              {automation.name}
            </h3>
            <Badge className={`font-bold text-xs px-3 py-1 rounded-full ${getScoreColor(automation.score)} shadow-sm`}>
              {automation.score}
            </Badge>
          </div>
          
          <div className="mb-6">
            <Badge variant="secondary" className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm">
              {automation.category}
            </Badge>
          </div>
          
          <div className="flex-1 flex items-end">
            <div className="flex items-center text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:gap-3 gap-2">
              <span className="text-sm font-medium">Explore Workflow</span>
              {isRTL ? (
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              ) : (
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        </div>
      </Card>
    </Link>
  );
};