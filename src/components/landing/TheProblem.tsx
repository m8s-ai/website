import { motion } from 'framer-motion';
import { Zap, FileX, Users } from 'lucide-react';

export const TheProblem = () => {
  const problems = [
    {
      icon: Zap,
      title: 'AI in Silos',
      description: 'Each role works in their own environment. No shared context, no structured collaboration. Fragmented output with no continuity.',
    },
    {
      icon: FileX,
      title: 'PRDs Disconnected from Code',
      description: 'PRDs are incomplete, not connected to the codebase, and outdated fast. This causes delays, misalignment, and rework.',
    },
    {
      icon: Users,
      title: 'The Wild West',
      description: 'No consistent process. No standards. Hard to onboard new team members. Quality and velocity are hard to sustain.',
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-destructive/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Product Development is <span className="text-destructive">Broken</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI usage today happens in silos. The result? Fragmented output, no continuity, and chaos instead of productivity.
          </p>
        </motion.div>

        {/* Problems grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl text-center border border-destructive/20 hover:border-destructive/40 transition-all duration-300"
            >
              <div className="inline-flex p-4 rounded-xl bg-destructive/10 mb-4">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
