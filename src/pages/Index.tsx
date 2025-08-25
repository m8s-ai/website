// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <div className="animate-slide-up">
          <div className="relative inline-block mb-8">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Automate
              <br />
              <span className="animate-shimmer bg-gradient-to-r from-primary via-accent to-primary bg-[200%_auto] bg-clip-text">
                Everything
              </span>
            </h1>
            <div className="absolute -inset-8 bg-gradient-primary/10 blur-3xl rounded-full animate-pulse"></div>
          </div>
          
          <p className="text-2xl text-muted-foreground mb-12 font-medium leading-relaxed">
            Welcome to the future of workflow automation.
            <br />
            <span className="text-primary">Start building your amazing project here!</span>
          </p>
          
          <div className="glass-card rounded-2xl p-8 border border-border/20 max-w-2xl mx-auto">
            <p className="text-lg text-foreground/80">
              Ready to transform your business processes? Explore our premium n8n automation marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
