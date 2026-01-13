import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

export const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const videos: Video[] = [
    {
      id: '1',
      title: 'What is M8S?',
      description: 'See how M8S transforms your product workflow with AI agents.',
      thumbnail: '/videos/thumbnails/what-is-m8s.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_1',
      duration: '2:30',
    },
    {
      id: '2',
      title: 'From Idea to PRD',
      description: 'Watch M8S agents collaborate to create a complete PRD.',
      thumbnail: '/videos/thumbnails/idea-to-prd.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_2',
      duration: '4:15',
    },
    {
      id: '3',
      title: 'Integrations Demo',
      description: 'See how M8S connects with Jira, Notion, and more.',
      thumbnail: '/videos/thumbnails/integrations.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_3',
      duration: '3:00',
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">See M8S in Action</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Watch How </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              It Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our video guides to understand how M8S agents can accelerate your product development.
          </p>
        </motion.div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setActiveVideo(video)}
            >
              <div className="glass-card rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  {/* Placeholder gradient if no thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center opacity-60">
                      <span className="text-4xl font-bold text-white">M8S</span>
                    </div>
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-elegant transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                    {video.duration}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {video.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured video player placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="aspect-video max-w-4xl mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
              {/* M8S branding background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <span className="text-[12rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent select-none">
                  M8S
                </span>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-elegant">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
                <p className="text-muted-foreground">
                  Product demo video coming soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{activeVideo.title}</h3>
              <p className="text-white/70 mt-1">{activeVideo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
