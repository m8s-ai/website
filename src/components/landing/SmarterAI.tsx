import { motion } from 'framer-motion';
import { Brain, Zap, DollarSign } from 'lucide-react';

export const SmarterAI = () => {
  const features = [
    {
      icon: Brain,
      title: 'Right Model, Right Task',
      description: 'Complex reasoning gets deep-thinking models. Simple tasks get fast, cheap ones. You only pay for what you need.',
    },
    {
      icon: Zap,
      title: 'Code-Native Architecture',
      description: 'No grep. No brute-force file scanning. M8S understands code structure and navigates directly to what matters.',
    },
    {
      icon: DollarSign,
      title: '90% Lower Token Costs',
      description: 'Smart routing + efficient retrieval = dramatically lower AI costs compared to terminal-based agents.',
    },
  ];

  return (
    <section id="smarter-ai" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Smarter AI. </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Fraction of the Cost.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most AI tools burn through tokens with brute-force methods. M8S is different.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl text-center hover:shadow-card-hover transition-all duration-300 border border-green-500/10 hover:border-green-500/30"
            >
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-4">
                <feature.icon className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              Stop paying for AI that guesses. Pay for AI that knows.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
