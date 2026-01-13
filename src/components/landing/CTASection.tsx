import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary/5" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-40" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-40" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-16 rounded-3xl text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Now Onboarding Teams</span>
          </div>

          {/* Main heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Structure. Speed. </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Real Collaboration.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            15-minute call. See how M8S creates a structured, fast, and collaborative product-building experience — powered by an AI team that works inside the same context as you.
          </p>

          {/* CTA button */}
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

          {/* Trust signals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Free trial included
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Personal onboarding
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              No credit card
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
