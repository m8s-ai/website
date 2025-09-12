import type { Wave } from '@/types/conversation';

// Enhanced adaptive conversation flow
export const CONVERSATION_WAVES: Wave[] = [
  {
    id: 'wave1',
    name: 'Welcome & Path Selection',
    description: 'Bot selection',
    questions: [
      {
        id: 'welcome',
        text: 'Hi! I\'m your AI project consultant. I can help you learn about m8s or start defining your project with intelligent discovery. What would you prefer?',
        type: 'multiple-choice',
        options: ['Learn more about m8s', 'Start smart project discovery'],
        followUp: 'Perfect! Let me help you with that.',
        category: 'foundation'
      }
    ]
  },
  {
    id: 'wave2',
    name: 'Project Foundation Discovery',
    description: 'Core project understanding with adaptive depth',
    adaptive: true,
    minQuestions: 3,
    maxQuestions: 8,
    questions: [
      {
        id: 'project_idea',
        text: 'Tell me about your project vision. What would you like us to build or automate?',
        type: 'text',
        followUp: 'Interesting! Let me understand the business context better.',
        validation: (answer: string) => answer.length > 10,
        category: 'foundation',
        riskFlags: ['unclear requirements', 'scope creep potential']
      },
      {
        id: 'business_problem',
        text: 'What core business problem are you trying to solve with this project?',
        type: 'text',
        followUp: 'That\'s a valuable problem to solve. How are you handling this today?',
        validation: (answer: string) => answer.length > 5,
        category: 'business',
        adaptiveLogic: {
          condition: 'business_context_needed',
          nextQuestions: []
        }
      },
      {
        id: 'current_solution',
        text: 'How do you currently handle this process? What tools or methods do you use?',
        type: 'text',
        followUp: 'Understanding your current setup helps me design the best solution.',
        category: 'technical',
        technicalDepth: 'basic'
      },
      {
        id: 'project_scale',
        text: 'What kind of project scope are you thinking about?',
        type: 'multiple-choice',
        options: [
          'Quick proof-of-concept (validate the idea)',
          'Production-ready solution (full implementation)', 
          'Enterprise-scale system (comprehensive solution)',
          'Not sure - help me decide'
        ],
        followUp: 'That helps me understand the investment level and approach.',
        category: 'foundation',
        adaptiveLogic: {
          condition: 'scale_determines_questions',
          nextQuestions: []
        }
      },
      {
        id: 'success_criteria',
        text: 'How will you know this project is successful? What specific outcomes are you hoping for?',
        type: 'text',
        followUp: 'Clear success metrics are crucial for project success.',
        validation: (answer: string) => answer.length > 5,
        category: 'business'
      },
      {
        id: 'timeline_expectations',
        text: 'Do you have any timeline expectations or constraints?',
        type: 'multiple-choice',
        options: [
          'ASAP - this is urgent',
          'Within 1-3 months',
          'Within 6 months', 
          'Flexible timeline - quality over speed',
          'Not sure yet'
        ],
        followUp: 'Timeline helps me recommend the right approach.',
        category: 'resource',
        riskFlags: ['timeline pressure', 'unrealistic expectations']
      },
      {
        id: 'technical_experience',
        text: 'What\'s your team\'s technical background with similar projects?',
        type: 'multiple-choice',
        options: [
          'Very experienced - we know exactly what we want',
          'Some experience - we understand the basics',
          'Limited experience - we need guidance',
          'No technical background - full consulting needed'
        ],
        followUp: 'This helps me adjust my recommendations to your expertise level.',
        category: 'technical',
        technicalDepth: 'basic',
        adaptiveLogic: {
          condition: 'technical_depth_adjustment',
          nextQuestions: []
        }
      },
      {
        id: 'integration_needs',
        text: 'Will this need to integrate with existing systems, APIs, or databases?',
        type: 'multiple-choice',
        options: [
          'Yes - several integrations needed',
          'Yes - one or two key integrations',
          'Maybe - not sure yet',
          'No - standalone solution'
        ],
        followUp: 'Integration complexity significantly impacts the technical approach.',
        category: 'technical',
        technicalDepth: 'intermediate',
        riskFlags: ['integration complexity', 'dependency risks']
      }
    ]
  },
  {
    id: 'wave3',
    name: 'Contact & Next Steps',
    description: 'Gather contact info and plan follow-up',
    questions: [
      {
        id: 'contact_info',
        text: 'I\'d love to have our team create a detailed project plan for you. What\'s your name?',
        type: 'text',
        followUp: 'Great to meet you! What\'s the best email to send your project analysis?',
        validation: (answer: string) => answer.length > 1,
        category: 'foundation'
      },
      {
        id: 'email',
        text: 'What\'s your email address?',
        type: 'text',
        followUp: 'Perfect! We\'ll send you a comprehensive project analysis within 24 hours.',
        validation: (answer: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer.trim()),
        category: 'foundation'
      },
      {
        id: 'company',
        text: 'What company or organization is this for? (Optional)',
        type: 'text',
        followUp: 'Thanks! This helps us tailor our recommendations.',
        category: 'foundation'
      },
      {
        id: 'preferred_contact',
        text: 'How would you prefer our team to follow up?',
        type: 'multiple-choice',
        options: [
          'Email with detailed analysis first',
          'Quick phone call to discuss',
          'Video meeting to review together',
          'Email only for now'
        ],
        followUp: 'Perfect! We\'ll reach out using your preferred method.',
        category: 'foundation'
      }
    ]
  }
];