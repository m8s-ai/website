import { AutomationCard } from "@/components/AutomationCard";
import { Header } from "@/components/Header";
import { mockAutomations, categories } from "@/data/mockData";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { t } = useLanguage();

  console.log('Total mockAutomations:', mockAutomations.length);
  
  const filteredAutomations = mockAutomations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || automation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('Filtered automations:', filteredAutomations.length, 'Category:', selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 leading-tight">
              {t('marketplace.title')}
            </h1>
            <div className="absolute -inset-4 bg-gradient-primary/10 blur-3xl rounded-full animate-pulse"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            {t('marketplace.subtitle')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="glass-card rounded-2xl p-8 mb-12 max-w-5xl mx-auto border border-border/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={t('marketplace.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 bg-background/50 border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl text-base backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
            </div>
            
            {/* Category Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground font-medium">
                <Filter className="h-5 w-5 text-primary" />
                <span>Filter by category:</span>
              </div>
               <div className="flex flex-wrap gap-3">
                {categories.filter(category => category !== "All").map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category 
                        ? "bg-gradient-primary text-white shadow-glow" 
                        : "glass border-border/30 hover:border-primary/50 hover:bg-primary/10"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex justify-between items-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="glass rounded-xl px-6 py-3 border border-border/20">
            <span className="text-muted-foreground font-medium">Showing</span>
            <span className="ml-2 font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">{filteredAutomations.length}</span>
            <span className="ml-2 text-muted-foreground font-medium">{t('marketplace.automations_found')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAutomations.map((automation, index) => (
            <div
              key={automation.id}
              className="animate-slide-up"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <AutomationCard automation={automation} />
            </div>
          ))}
        </div>

        {filteredAutomations.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="glass-card rounded-2xl p-12 max-w-md mx-auto border border-border/20">
              <div className="w-16 h-16 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('marketplace.no_automations')}</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria to find the perfect automation workflow.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};