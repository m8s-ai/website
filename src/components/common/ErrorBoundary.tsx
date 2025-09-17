import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 React Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full glass-card border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <span>Something went wrong</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-300">
                <p className="mb-4">
                  Claude Flow encountered an unexpected error. This has been logged for debugging.
                </p>
                
                {this.state.error && (
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bug className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Error Details</span>
                    </div>
                    <code className="text-sm text-gray-300 block whitespace-pre-wrap">
                      {this.state.error.message}
                    </code>
                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                      <details className="mt-3">
                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                          Stack Trace (Development Only)
                        </summary>
                        <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  If this problem persists, please report it on our{' '}
                  <a 
                    href="https://github.com/m8s-ai/claude-flow/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    GitHub Issues
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

export default ErrorBoundary;