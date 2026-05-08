import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center space-y-6 border border-gray-100">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Oops! Something went wrong</h1>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                An unexpected error occurred. Don't worry, your data is safe. Try refreshing the page or going back home.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
              <a 
                href="/"
                className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
              >
                <Home className="h-4 w-4" /> Home
              </a>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
