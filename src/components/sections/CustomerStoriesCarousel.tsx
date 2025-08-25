import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customerStories } from "@/data/customerStories";

export const CustomerStoriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === customerStories.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextStory = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === customerStories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevStory = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? customerStories.length - 1 : prevIndex - 1
    );
  };

  const goToStory = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-card opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Customer</span>{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real results from real businesses. See how our automation solutions transformed operations and delivered measurable ROI.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Story Card */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {customerStories.map((story, index) => (
                <div key={story.id} className="w-full flex-shrink-0 px-4">
                  <Card className="glass-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Customer Info */}
                        <div className="lg:col-span-1 text-center lg:text-left">
                          <div className="w-20 h-20 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                            <span className="text-2xl font-bold text-primary">
                              {story.avatar}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {story.customerName}
                          </h3>
                          <p className="text-primary font-medium mb-1">
                            {story.customerTitle}
                          </p>
                          <p className="text-muted-foreground text-sm mb-4">
                            {story.company}
                          </p>
                          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                            <span className="text-xs font-medium text-primary">
                              {story.industry}
                            </span>
                          </div>
                        </div>

                        {/* Testimonial */}
                        <div className="lg:col-span-2">
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-foreground mb-2">
                              Solution: {story.automationName}
                            </h4>
                            <blockquote className="text-muted-foreground italic leading-relaxed text-lg">
                              "{story.testimonial}"
                            </blockquote>
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-xl border border-border/20">
                              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-green-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">
                                  {story.timeSaved}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Time Efficiency
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-xl border border-border/20">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">
                                  {story.moneySaved}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Cost Savings
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevStory}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 glass border-border/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextStory}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 glass border-border/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {customerStories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStory(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary shadow-glow"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Auto-play Toggle */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-muted-foreground hover:text-primary"
          >
            {isAutoPlaying ? "Pause" : "Play"} Auto-scroll
          </Button>
        </div>
      </div>
    </section>
  );
};