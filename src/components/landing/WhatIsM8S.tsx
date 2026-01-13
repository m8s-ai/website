import { motion } from 'framer-motion';
import { Users, Workflow, FileOutput, Send } from 'lucide-react';

export const WhatIsM8S = () => {
  const steps = [
    {
      icon: Users,
      step: '1',
      title: 'Meet Your AI Team',
      description: 'M8S agents (PM, Architect, Developer, QA) work alongside you with clear roles and shared context.',
    },
    {
      icon: Workflow,
      step: '2',
      title: 'Choose a Flow',
      description: 'Select structured flows: Ideation → PRD, PRD → Epics & Stories, Codebase → Documentation, and more.',
    },
    {
      icon: FileOutput,
      step: '3',
      title: 'Get Real Output',
      description: 'Generate PRDs, epics, stories, diagrams, and slides — all grounded in your code and product decisions.',
    },
    {
      icon: Send,
      step: '4',
      title: 'Ship to Your Tools',
      description: 'Push stories to Jira, specs to Cursor, or docs to Notion. Connect the output to your favorite coding platform.',
    },
  ];

  return (
    <section id="solution" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
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
            <span className="text-foreground">One Platform. </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              One AI Team.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            M8S is a collaborative experience where AI agents work alongside you — step by step, within a shared context of code, documents, and product decisions.
          </p>
        </motion.div>

        {/* Steps - 4 columns inline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-2xl text-center hover:shadow-card-hover transition-all duration-300 h-full">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 mb-4 mt-2">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
