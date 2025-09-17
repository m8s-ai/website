import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock, 
  Bot, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSwitchToRegister, 
  onLoginSuccess,
  className 
}) => {
  const { login, state } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
    if (state.error) {
      // Clear auth error after user interaction
      setTimeout(() => {
        // Clear error in next tick to avoid state update during render
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Client-side validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login(formData);
      onLoginSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login error:', error);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = formData.email && formData.password && isValidEmail(formData.email);
  const displayError = localError || state.error;

  return (
    <Card className={cn('w-full max-w-md glass-card border-gray-700/50', className)}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Welcome to M8s App
        </CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to manage your AI agent swarms
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {displayError && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {/* Demo Account Helper */}
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <CheckCircle2 className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            <strong>Demo Accounts:</strong><br />
            Admin: admin@clauseflow.ai<br />
            User: demo@clauseflow.ai<br />
            <em>Any password works for demo accounts</em>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="pl-10 glass-input"
                disabled={state.isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="pl-10 pr-10 glass-input"
                disabled={state.isLoading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                disabled={state.isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                }
                disabled={state.isLoading}
              />
              <Label 
                htmlFor="rememberMe" 
                className="text-sm text-gray-400 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="text-sm text-blue-400 hover:text-blue-300 p-0"
              disabled={state.isLoading}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!isFormValid || state.isLoading}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {onSwitchToRegister && (
          <div className="text-center pt-4 border-t border-gray-700/50">
            <span className="text-gray-400">Don't have an account? </span>
            <Button
              type="button"
              variant="link"
              className="text-blue-400 hover:text-blue-300 p-0"
              onClick={onSwitchToRegister}
              disabled={state.isLoading}
            >
              Sign up
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;