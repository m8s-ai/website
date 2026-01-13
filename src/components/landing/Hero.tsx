import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-8 px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-30" />

      {/* Content area */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">For Product Teams</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">Your </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-pink-500">
            AI Product Team
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          A single platform from ideation to development-ready stories.
          <br className="hidden md:block" />
          <span className="text-foreground font-medium">M8S agents work alongside you to prioritize, write specs, and keep everyone aligned.</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="https://calendly.com/m8s"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-5 h-5" />
            Book a Demo
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          Built by a developer who uses M8S daily
        </motion.p>
      </div>

      {/* M8S Product Screenshot - Fades from bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4"
      >
        <div className="relative">
          {/* Glow effect behind the image */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60" />
          
          {/* Product screenshot with glass frame */}
          <div className="relative glass-card rounded-2xl p-2 shadow-2xl overflow-hidden">
            {/* Browser-like top bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-black/20 rounded-t-xl border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/5 text-xs text-muted-foreground">
                  app.m8s.ai
                </div>
              </div>
            </div>
            
            {/* Screenshot image */}
            <img 
              src="/m8s-hero-brand.png" 
              alt="M8S Platform - AI-powered product management" 
              className="w-full h-auto rounded-b-xl select-none"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.3) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          </div>
          
          {/* Bottom glow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-primary/40 via-accent/30 to-transparent blur-3xl" />
        </div>
      </motion.div>
    </section>
  );
};
