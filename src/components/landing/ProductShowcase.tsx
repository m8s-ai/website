import { motion } from 'framer-motion';

interface ShowcaseCard {
  image: string;
  title: string;
  keywords: string[];
}

const showcaseItems: ShowcaseCard[] = [
  {
    image: '/showcase-workflows.png',
    title: 'Structured Workflows',
    keywords: ['PRD', 'Epics', 'Stories', 'Architecture'],
  },
  {
    image: '/showcase-context.png',
    title: 'Living Context',
    keywords: ['Codebase', 'Docs', 'Decisions', 'Sync'],
  },
  {
    image: '/showcase-diagrams.png',
    title: 'Visual Outputs',
    keywords: ['Flowcharts', 'Diagrams', 'Slides', 'Specs'],
  },
];

export const ProductShowcase = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">See </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              M8S in Action
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From idea to implementation, all in one place
          </p>
        </motion.div>

        {/* Showcase cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Floating keywords */}
              <div className="absolute -inset-4 z-20 pointer-events-none">
                {item.keywords.map((keyword, i) => {
                  const positions = [
                    { top: '5%', left: '-5%', rotate: -12 },
                    { top: '10%', right: '-8%', rotate: 8 },
                    { bottom: '15%', left: '-3%', rotate: -6 },
                    { bottom: '8%', right: '-5%', rotate: 10 },
                  ];
                  const pos = positions[i % positions.length];
                  return (
                    <motion.span
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.15 + i * 0.1 }}
                      className="absolute px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm"
                      style={{
                        ...pos,
                        transform: `rotate(${pos.rotate}deg)`,
                      }}
                    >
                      {keyword}
                    </motion.span>
                  );
                })}
              </div>

              {/* Card */}
              <div className="relative glass-card rounded-2xl p-3 shadow-xl overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-t-xl border-b border-white/5">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-3 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground">
                      app.m8s.ai
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto rounded-b-xl"
                />
              </div>

              {/* Title below card */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                className="text-center mt-6 text-lg font-semibold text-foreground"
              >
                {item.title}
              </motion.h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
