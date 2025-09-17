import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../ui/card';
import { Loader2, Lock, AlertTriangle } from 'lucide-react';
import type { Permission } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallbackPath = '/auth'
}) => {
  const { state, isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
        <Card className="glass-card border-gray-700/50 p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-300">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated()) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check for specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-6">
        <Card className="glass-card border-red-500/30 max-w-md w-full">
          <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Access Denied</h1>
              <p className="text-gray-400">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                Required permission: <code className="bg-gray-800 px-2 py-1 rounded text-amber-400">{requiredPermission}</code>
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 w-full">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-300">
                  <p className="font-medium mb-1">Need access?</p>
                  <p>Contact your administrator to request the necessary permissions for this feature.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 w-full">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = '/claude-flow'}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;