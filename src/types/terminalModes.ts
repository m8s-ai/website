export type TerminalMode = 'project' | 'qa' | 'demo' | 'support';

export interface TerminalBotConfig {
  id: TerminalMode;
  name: string;
  description: string;
  initialPrompt?: string;
  capabilities: string[];
  analyticsCategory: string;
}

export const TERMINAL_BOT_CONFIGS: Record<TerminalMode, TerminalBotConfig> = {
  project: {
    id: 'project',
    name: 'Project Validation Bot',
    description: 'AI-powered project analysis and validation through our proven 4-wave methodology',
    initialPrompt: 'Welcome to ARIA - Project Validation System. I\'ll help you validate your project concept.',
    capabilities: [
      'Feasibility Analysis',
      'Market Research', 
      'Technical Assessment',
      'Risk Evaluation',
      'Business Model Validation'
    ],
    analyticsCategory: 'project_validation'
  },
  qa: {
    id: 'qa',
    name: 'Q&A Assistant',
    description: 'Get answers about m8s.ai services, capabilities, and how we can help your business',
    initialPrompt: 'Hi! I\'m here to answer any questions about m8s.ai and our services.',
    capabilities: [
      'Service Information',
      'Pricing Details',
      'Process Explanation',
      'Case Studies',
      'Technical Support'
    ],
    analyticsCategory: 'qa_interaction'
  },
  demo: {
    id: 'demo',
    name: 'Demo Assistant',
    description: 'Interactive demonstration of our AI capabilities and project validation process',
    initialPrompt: 'Welcome to the m8s.ai demo! Let me show you how our AI validation works.',
    capabilities: [
      'Live Demo',
      'Feature Showcase',
      'Interactive Examples',
      'Process Walkthrough'
    ],
    analyticsCategory: 'demo_interaction'
  },
  support: {
    id: 'support',
    name: 'Technical Support',
    description: 'Get help with technical issues, integration support, and troubleshooting',
    initialPrompt: 'I\'m here to help with any technical questions or issues you might have.',
    capabilities: [
      'Technical Troubleshooting',
      'Integration Support',
      'API Documentation',
      'Best Practices'
    ],
    analyticsCategory: 'support_interaction'
  }
};

export interface TerminalModeManager {
  currentMode: TerminalMode;
  setMode: (mode: TerminalMode) => void;
  getConfig: (mode: TerminalMode) => TerminalBotConfig;
  getAllModes: () => TerminalBotConfig[];
}