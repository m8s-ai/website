
interface Technology {
  name: string;
  description: string;
  category: 'frontend' | 'mobile' | 'backend' | 'ai' | 'automation' | 'cloud' | 'database';
  iconUrl: string;
  color: string;
}

const technologies: Technology[] = [
  // Frontend Technologies
  { name: 'React', description: 'Modern web applications with TypeScript', category: 'frontend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
  { name: 'Next.js', description: 'Full-stack React framework', category: 'frontend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', color: '#000000' },
  { name: 'Vue.js', description: 'Progressive JavaScript framework', category: 'frontend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', color: '#4FC08D' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'frontend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', color: '#38B2AC' },

  // Mobile Technologies
  { name: 'Flutter', description: 'Native iOS & Android apps', category: 'mobile', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', color: '#02569B' },
  { name: 'React Native', description: 'Cross-platform mobile development', category: 'mobile', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },

  // Backend Technologies
  { name: 'Node.js', description: 'JavaScript runtime for server-side development', category: 'backend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  { name: 'Python', description: 'Versatile language for web and AI development', category: 'backend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776AB' },
  { name: 'FastAPI', description: 'Modern Python web framework', category: 'backend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', color: '#009688' },
  { name: 'Express.js', description: 'Minimal Node.js web framework', category: 'backend', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: '#000000' },

  // AI & Machine Learning
  { name: 'OpenAI', description: 'Advanced AI integration and chatbots', category: 'ai', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', color: '#412991' },
  { name: 'TensorFlow', description: 'Machine learning and AI models', category: 'ai', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', color: '#FF6F00' },
  { name: 'PyTorch', description: 'Deep learning framework', category: 'ai', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', color: '#EE4C2C' },

  // Automation Technologies
  { name: 'n8n', description: 'Workflow automation and integration', category: 'automation', iconUrl: 'https://docs.n8n.io/assets/images/n8n-logo.png', color: '#EA4B71' },
  { name: 'Zapier', description: 'App integration and automation', category: 'automation', iconUrl: 'https://cdn.worldvectorlogo.com/logos/zapier.svg', color: '#FF4A00' },
  { name: 'GitHub Actions', description: 'CI/CD and workflow automation', category: 'automation', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', color: '#2088FF' },
  { name: 'Selenium', description: 'Web automation and testing', category: 'automation', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg', color: '#43B02A' },

  // Cloud & Infrastructure
  { name: 'AWS', description: 'Amazon Web Services cloud platform', category: 'cloud', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', color: '#FF9900' },
  { name: 'Azure', description: 'Microsoft cloud computing platform', category: 'cloud', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg', color: '#0078D4' },
  { name: 'Docker', description: 'Containerization and deployment', category: 'cloud', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', color: '#2496ED' },
  { name: 'Vercel', description: 'Frontend deployment and hosting', category: 'cloud', iconUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png', color: '#000000' },

  // Database Technologies
  { name: 'PostgreSQL', description: 'Advanced relational database', category: 'database', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: '#336791' },
  { name: 'MongoDB', description: 'Flexible NoSQL database', category: 'database', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47A248' },
  { name: 'Redis', description: 'In-memory data structure store', category: 'database', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', color: '#DC382D' },
];


const categoryTitles = {
  frontend: 'Frontend Development',
  mobile: 'Mobile Development',
  backend: 'Backend Development',
  ai: 'AI & Machine Learning',
  automation: 'Automation & Integration',
  cloud: 'Cloud & Infrastructure',
  database: 'Database Technologies',
};

export const TechnologiesSection = () => {

  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <section className="py-8 relative">
      <div className="bg-black/90 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-2xl shadow-green-500/10">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-green-500/30 rounded-t-xl -mx-6 -mt-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="w-2 inline-block" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="w-2 inline-block" />
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="retro-glow-green text-sm font-mono">Technologies We Master</div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-black/95 rounded-b-xl p-6 -mx-6 -mb-6 font-mono text-sm">
          <div className="text-gray-300 mb-4">
            <span className="retro-glow-green">$</span> <span className="text-gray-300">ls -la technologies/</span>
          </div>
          
          {/* Technology Categories */}
          <div className="space-y-6">
            {Object.entries(groupedTechnologies).map(([category, techs]) => (
              <div key={category} className="space-y-3">
                {/* Category Header */}
                <div className="text-gray-300">
                  <span className="retro-glow-green">./</span><span className="text-gray-200 font-semibold">{categoryTitles[category as keyof typeof categoryTitles]}/</span>
                </div>
                
                {/* Technology List */}
                <div className="ml-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="group bg-black/60 border border-green-500/20 rounded p-3 hover:border-green-500/50 hover:bg-black/80 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-green-500/10"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Tech Icon */}
                        <div className="flex-shrink-0">
                          <img 
                            src={tech.iconUrl} 
                            alt={`${tech.name} logo`}
                            className="w-6 h-6 object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                            style={{
                              filter: tech.color === '#000000' ? 'invert(1) brightness(0.9)' : undefined
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.textContent = tech.name.charAt(0).toUpperCase();
                              fallback.className = 'w-6 h-6 rounded bg-green-500 flex items-center justify-center text-black font-bold text-xs';
                              target.parentNode?.appendChild(fallback);
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Technology Name */}
                          <div className="retro-glow-green text-xs font-semibold group-hover:text-green-300 transition-colors truncate">
                            {tech.name}
                          </div>
                          
                          {/* Description */}
                          <div className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors truncate">
                            {tech.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Terminal Prompt */}
          <div className="mt-6 flex items-center">
            <span className="retro-glow-green">$</span> 
            <span className="ml-1 w-2 h-4 bg-green-400 animate-pulse retro-glow-green">|</span>
          </div>
        </div>
      </div>
    </section>
  );
};