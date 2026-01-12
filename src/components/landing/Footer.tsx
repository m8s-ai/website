export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & copyright */}
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              M8S
            </span>
            <span className="text-sm text-muted-foreground">
              © {currentYear} M8S. All rights reserved.
            </span>
          </div>

          {/* Contact */}
          <a 
            href="mailto:hello@m8s.ai" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            hello@m8s.ai
          </a>
        </div>
      </div>
    </footer>
  );
};
