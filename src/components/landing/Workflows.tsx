import { motion } from 'framer-motion';
import { FileText, List, Briefcase, Lightbulb, Palette, CheckCircle } from 'lucide-react';

export const Workflows = () => {
  const workflows = [
    {
      icon: FileText,
      title: 'Ideation → PRD',
      description: 'Turn rough ideas into complete product requirements documents',
    },
    {
      icon: List,
      title: 'PRD → Epics & Stories',
      description: 'Break down PRDs into development-ready epics and user stories',
    },
    {
      icon: Briefcase,
      title: 'Codebase → Documentation',
      description: 'Generate architecture docs and API specs from your actual code',
    },
    {
      icon: Lightbulb,
      title: 'Feature → Delivery Plan',
      description: 'Map features to structured implementation plans with dependencies',
    },
    {
      icon: Palette,
      title: 'PRD → Flowcharts & Diagrams',
      description: 'Create visual flows and architecture diagrams from specifications',
    },
    {
      icon: CheckCircle,
      title: 'Decisions → Presentations',
      description: 'Turn product decisions into stakeholder-ready slides',
    },
  ];

  return (
    <section id="workflows" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Predefined Flows. </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Or Go Freestyle.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a structured flow for guided results, or just start a conversation — ask for a single PRD, explore your codebase, or let the AI team direct you. Your call.
          </p>
        </motion.div>

        {/* Workflows grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="glass-card p-6 rounded-2xl hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                  <workflow.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{workflow.title}</h3>
                  <p className="text-muted-foreground text-sm">{workflow.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More workflows hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          + Architecture docs, API specs, test plans, release notes, drawings, and more...
        </motion.p>
      </div>
    </section>
  );
};
