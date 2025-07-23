import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-50 p-3 rounded-lg text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-red-600 whitespace-pre-wrap break-words">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for specific components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Component error:', error, errorInfo);
    // In a real app, you might want to send this to an error reporting service
  };
}