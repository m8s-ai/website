import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple password - you can change this
  const CORRECT_PASSWORD = 'claude-flow-2024';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === CORRECT_PASSWORD) {
      onAuthenticated();
    } else {
      setError('Incorrect password. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Access Protected</CardTitle>
          <p className="text-gray-400">Enter password to access Claude Flow</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="glass-input pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Authenticating...' : 'Access Claude Flow'}
            </Button>
          </form>
          
          <div className="mt-6 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-400 text-center">
              Demo password: <span className="text-blue-400 font-mono">claude-flow-2024</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};