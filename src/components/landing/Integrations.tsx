import { motion } from 'framer-motion';

interface Integration {
  name: string;
  category: 'pm' | 'dev' | 'analytics' | 'comms';
}

export const Integrations = () => {
  const integrations: Integration[] = [
    // Project Management
    { name: 'Jira', category: 'pm' },
    { name: 'Linear', category: 'pm' },
    { name: 'Asana', category: 'pm' },
    { name: 'Monday', category: 'pm' },
    { name: 'Notion', category: 'pm' },
    { name: 'Confluence', category: 'pm' },
    // Development
    { name: 'GitHub', category: 'dev' },
    { name: 'GitLab', category: 'dev' },
    { name: 'Bitbucket', category: 'dev' },
    { name: 'VS Code', category: 'dev' },
    { name: 'Cursor', category: 'dev' },
    // Analytics (the "trap" integrations)
    { name: 'Mixpanel', category: 'analytics' },
    { name: 'Amplitude', category: 'analytics' },
    { name: 'Pendo', category: 'analytics' },
    { name: 'Heap', category: 'analytics' },
    { name: 'PostHog', category: 'analytics' },
    { name: 'Google Analytics', category: 'analytics' },
    // Communication
    { name: 'Slack', category: 'comms' },
    { name: 'Discord', category: 'comms' },
    { name: 'Teams', category: 'comms' },
  ];

  const categoryLabels = {
    pm: 'Project Management',
    dev: 'Development',
    analytics: 'Analytics',
    comms: 'Communication',
  };

  const categoryColors = {
    pm: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    dev: 'from-green-500/20 to-green-600/20 border-green-500/30',
    analytics: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    comms: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <section id="integrations" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Connect </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Everything
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One-time setup. M8S pulls context from all your tools so AI actually understands what you're building.
          </p>
        </motion.div>

        {/* Integrations by category */}
        <div className="space-y-8">
          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {categoryLabels[category]}
              </h3>
              <div className="flex flex-wrap gap-3">
                {groupedIntegrations[category]?.map((integration, index) => (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.03 }}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${categoryColors[category]} border backdrop-blur-sm hover:scale-105 transition-transform cursor-default`}
                  >
                    <span className="text-sm font-medium text-foreground">{integration.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* More integrations hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          + Databases, APIs, documentation platforms, and custom integrations
        </motion.p>
      </div>
    </section>
  );
};
