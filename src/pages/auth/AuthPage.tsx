import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { cn } from '../../lib/utils';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  className?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ className }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended page after login
  const from = (location.state as any)?.from?.pathname || '/claude-flow';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleAuthSuccess = () => {
    // Small delay to allow auth state to update
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 100);
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  const goBack = () => navigate('/');

  return (
    <div 
      dir="ltr" 
      className={cn(
        'min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={goBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">M8s App</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          {mode === 'login' ? (
            <LoginForm
              onSwitchToRegister={switchToRegister}
              onLoginSuccess={handleAuthSuccess}
              className="animate-fade-in"
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={switchToLogin}
              onRegisterSuccess={handleAuthSuccess}
              className="animate-fade-in"
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2024 Claude Flow. All rights reserved. | 
            <a href="#" className="hover:text-gray-400 ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-gray-400 ml-1">Terms of Service</a>
          </p>
        </div>
      </footer>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;