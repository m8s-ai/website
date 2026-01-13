import { motion } from 'framer-motion';
import { Database, Zap, FileText, PresentationIcon } from 'lucide-react';

export const BuiltForPMs = () => {
  const benefits = [
    {
      icon: Database,
      title: 'Query Your Codebase',
      description: 'Ask "What does the checkout flow do?" and get real answers. Stay aligned with actual product context.',
    },
    {
      icon: Zap,
      title: 'Faster PRDs & Stories',
      description: 'Generate PRDs, epics, and stories faster and more accurately than ever before.',
    },
    {
      icon: FileText,
      title: 'Quality You Haven\'t Seen',
      description: 'Specifications grounded in real code, real decisions, real data. No more gaps between docs and reality.',
    },
    {
      icon: PresentationIcon,
      title: 'Charts, Diagrams & Slides',
      description: 'Create visuals directly from code, PRDs, and product decisions. No context switching.',
    },
  ];

  return (
    <section id="for-pms" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Built for Product Managers. </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Unique Strengths.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay continuously aligned with real product context. Generate outputs at a level of quality not seen before.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
