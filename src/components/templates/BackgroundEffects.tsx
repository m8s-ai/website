import React, { memo } from 'react';

export interface BackgroundEffectsProps {
  className?: string;
}

const BackgroundEffects = memo<BackgroundEffectsProps>(({
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
      
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-transparent to-emerald-500/8 animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-bl from-cyan-500/6 via-transparent to-purple-500/6 animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '4s' }}
        />
      </div>

      {/* Floating neon orbs - enhanced version */}
      <div className="absolute inset-0 opacity-25">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/12 to-purple-400/12 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-purple-400/10 to-emerald-400/10 rounded-full blur-xl animate-pulse"
          style={{ animationDuration: '7s', animationDelay: '2s' }}
        />
        <div 
          className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-emerald-400/8 to-cyan-400/8 rounded-full blur-lg animate-pulse"
          style={{ animationDuration: '9s', animationDelay: '3s' }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Neon particles */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute top-1/5 left-1/5 w-1 h-1 bg-emerald-400 rounded-full animate-ping"
          style={{ animationDuration: '3s', animationDelay: '0s' }}
        />
        <div 
          className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
        <div 
          className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDuration: '5s', animationDelay: '2s' }}
        />
        <div 
          className="absolute top-1/2 right-1/6 w-0.5 h-0.5 bg-emerald-300 rounded-full animate-ping"
          style={{ animationDuration: '6s', animationDelay: '1.5s' }}
        />
        <div 
          className="absolute bottom-1/5 left-1/3 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping"
          style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
        />
        <div 
          className="absolute top-3/4 left-1/6 w-0.5 h-0.5 bg-purple-300 rounded-full animate-ping"
          style={{ animationDuration: '7s', animationDelay: '3s' }}
        />
      </div>

      {/* Animated light beams */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
        <div 
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/10 to-transparent animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
      `}</style>
    </div>
  );
});

BackgroundEffects.displayName = 'BackgroundEffects';

export default BackgroundEffects;