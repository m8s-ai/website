import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
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
          Built by Idan, a developer who uses M8S daily
        </motion.p>
      </div>
    </section>
  );
};
