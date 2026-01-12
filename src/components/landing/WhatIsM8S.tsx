import { motion } from 'framer-motion';
import { Plug, Workflow, Bot } from 'lucide-react';

export const WhatIsM8S = () => {
  const steps = [
    {
      icon: Plug,
      step: '1',
      title: 'Connect',
      description: 'Link your Jira, GitHub, GitLab, Slack, Mixpanel, and more. One-time setup.',
    },
    {
      icon: Workflow,
      step: '2',
      title: 'Pick a Workflow',
      description: 'Choose from 30+ templates: PRDs, epics, architecture docs, and more.',
    },
    {
      icon: Bot,
      step: '3',
      title: 'AI Does the Work',
      description: 'M8S pulls real data from your tools and generates docs grounded in your codebase.',
    },
  ];

  return (
    <section id="solution" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
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
            <span className="text-foreground">The </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Solution
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            M8S is the AI ops layer that connects your tools and gives product teams workflows that actually work.
          </p>
        </motion.div>

        {/* Steps with arrows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
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
