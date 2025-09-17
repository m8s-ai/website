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
  User,
  Bot, 
  AlertCircle,
} from 'lucide-react';
import type { RegisterCredentials } from '../../types/auth';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSwitchToLogin, 
  onRegisterSuccess,
  className 
}) => {
  const { register, state } = useAuth();
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof RegisterCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // First name validation
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 1) {
      errors.firstName = 'First name must be at least 1 character';
    }

    // Last name validation
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 1) {
      errors.lastName = 'Last name must be at least 1 character';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateForm()) {
      setLocalError('Please fix the errors below');
      return;
    }

    try {
      await register(formData);
      onRegisterSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
      console.error('Registration error:', error);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const displayError = localError || state.error;

  return (
    <Card className={cn('w-full max-w-md glass-card border-gray-700/50', className)}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Join M8s
        </CardTitle>
        <CardDescription className="text-gray-400">
          Create your account to start managing AI agents
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {displayError && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={cn(
                  'pl-10 glass-input',
                  validationErrors.email && 'border-red-500'
                )}
                disabled={state.isLoading}
                autoComplete="email"
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-400">{validationErrors.email}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Username *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange('username')}
                className={cn(
                  'pl-10 glass-input',
                  validationErrors.username && 'border-red-500'
                )}
                disabled={state.isLoading}
                autoComplete="username"
              />
            </div>
            {validationErrors.username && (
              <p className="text-sm text-red-400">{validationErrors.username}</p>
            )}
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                className={cn(
                  'glass-input',
                  validationErrors.firstName && 'border-red-500'
                )}
                disabled={state.isLoading}
                autoComplete="given-name"
              />
              {validationErrors.firstName && (
                <p className="text-sm text-red-400">{validationErrors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                className={cn(
                  'glass-input',
                  validationErrors.lastName && 'border-red-500'
                )}
                disabled={state.isLoading}
                autoComplete="family-name"
              />
              {validationErrors.lastName && (
                <p className="text-sm text-red-400">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className={cn(
                  'pl-10 pr-10 glass-input',
                  validationErrors.password && 'border-red-500'
                )}
                disabled={state.isLoading}
                autoComplete="new-password"
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
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Password strength:</span>
                  <span className={cn('text-xs font-medium', 
                    passwordStrength.strength <= 2 ? 'text-red-400' :
                    passwordStrength.strength <= 4 ? 'text-yellow-400' : 'text-green-400'
                  )}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className={cn('h-1 rounded-full transition-all', passwordStrength.color)}
                    style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {validationErrors.password && (
              <p className="text-sm text-red-400">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={cn(
                  'pl-10 pr-10 glass-input',
                  validationErrors.confirmPassword && 'border-red-500'
                )}
                disabled={state.isLoading}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={state.isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-400">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Terms acceptance */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
                }
                disabled={state.isLoading}
                className="mt-1"
              />
              <Label 
                htmlFor="acceptTerms" 
                className="text-sm text-gray-400 cursor-pointer leading-5"
              >
                I agree to the{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
            {validationErrors.acceptTerms && (
              <p className="text-sm text-red-400">{validationErrors.acceptTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center pt-4 border-t border-gray-700/50">
            <span className="text-gray-400">Already have an account? </span>
            <Button
              type="button"
              variant="link"
              className="text-blue-400 hover:text-blue-300 p-0"
              onClick={onSwitchToLogin}
              disabled={state.isLoading}
            >
              Sign in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegisterForm;