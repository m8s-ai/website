import { motion } from 'framer-motion';
import { FileText, List, Briefcase, Lightbulb, Palette, CheckCircle, Clock } from 'lucide-react';

export const Workflows = () => {
  const workflows = [
    {
      icon: FileText,
      title: 'PRD Generator',
      time: '10 min',
      description: 'Full product requirements document from a feature idea',
    },
    {
      icon: List,
      title: 'Epics & Stories',
      time: '15 min',
      description: 'Break down features into actionable dev tickets',
    },
    {
      icon: Briefcase,
      title: 'Product Brief',
      time: '5 min',
      description: 'Executive summary for stakeholder alignment',
    },
    {
      icon: Lightbulb,
      title: 'Brainstorm to Plan',
      time: '20 min',
      description: 'Turn messy ideas into structured project plans',
    },
    {
      icon: Palette,
      title: 'UX Design Doc',
      time: '15 min',
      description: 'User flows and wireframe specs for designers',
    },
    {
      icon: CheckCircle,
      title: 'Implementation Ready',
      time: '10 min',
      description: 'Verify all requirements are dev-ready before sprint',
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
            <span className="text-foreground">30+ Workflows. </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Here's 6.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each workflow is grounded in your actual codebase, tools, and data. Not generic templates — real context.
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
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-foreground">{workflow.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {workflow.time}
                    </div>
                  </div>
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
          + Architecture docs, API specs, test plans, release notes, and more...
        </motion.p>
      </div>
    </section>
  );
};
