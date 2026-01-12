import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const Credibility = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-12 rounded-3xl text-center relative"
        >
          {/* Quote icon */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent">
              <Quote className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Quote text */}
          <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mt-4 mb-8">
            "I built M8S because I was tired of repeating myself. Every project, same questions: 'Where's the PRD?' 'What's already built?' 'Who owns this?' Now I use M8S daily as a contractor — it's how I deliver faster than agencies 3x my size."
          </blockquote>

          {/* Author */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent p-0.5 mb-3">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  IA
                </span>
              </div>
            </div>
            <div className="font-semibold text-foreground">Idan Ayalon</div>
            <div className="text-sm text-muted-foreground">Founder & Daily User</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
