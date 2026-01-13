import { motion, type Easing } from 'framer-motion';

interface M8SLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  animated?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const M8SLogo = ({ 
  size = 'md', 
  animated = true, 
  className = '',
  showTagline = false 
}: M8SLogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
    hero: 'text-8xl md:text-9xl',
  };

  const easeOut: Easing = [0.25, 0.46, 0.45, 0.94];

  if (animated) {
    return (
      <motion.div 
        className={`inline-flex flex-col items-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <span 
          className={`font-bold ${sizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-pink-500 font-display tracking-tight`}
          style={{
            textShadow: '0 0 60px hsl(260 85% 65% / 0.3)',
          }}
        >
          M8S
        </span>
        {showTagline && (
          <span className="text-xs md:text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Your AI Product Team
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <span 
        className={`font-bold ${sizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-pink-500 font-display tracking-tight`}
        style={{
          textShadow: '0 0 60px hsl(260 85% 65% / 0.3)',
        }}
      >
        M8S
      </span>
      {showTagline && (
        <span className="text-xs md:text-sm text-muted-foreground mt-1 tracking-widest uppercase">
          Your AI Product Team
        </span>
      )}
    </div>
  );
};
