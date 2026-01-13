import { motion } from 'framer-motion';
import { Database, FolderGit2, MessageSquare, FileText, Layers, Mail } from 'lucide-react';

export const Integrations = () => {
  const contextSources = [
    {
      icon: Mail,
      label: 'Conversations',
      examples: 'Email, Slack, client calls',
    },
    {
      icon: Layers,
      label: 'Projects',
      examples: 'Jira, Linear, Asana',
    },
    {
      icon: FolderGit2,
      label: 'Code',
      examples: 'GitHub, GitLab, Bitbucket',
    },
    {
      icon: FileText,
      label: 'Documents',
      examples: 'Notion, Confluence, Google Docs',
    },
    {
      icon: Database,
      label: 'Knowledge Base',
      examples: 'Wikis, internal tools, your docs',
    },
  ];

  return (
    <section id="integrations" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Context is </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Everything
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            M8S gathers context from your tools — so AI understands your product, your code, and your decisions.
          </p>
        </motion.div>

        {/* Context sources - simple horizontal layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {contextSources.map((source, index) => (
            <motion.div
              key={source.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="glass-card p-5 rounded-xl text-center hover:shadow-card-hover transition-all duration-300"
            >
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 mb-3">
                <source.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{source.label}</h3>
              <p className="text-xs text-muted-foreground">{source.examples}</p>
            </motion.div>
          ))}
        </div>

        {/* Simple message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          No need for extra knowledge to set up your own MCPs.
        </motion.p>
      </div>
    </section>
  );
};
