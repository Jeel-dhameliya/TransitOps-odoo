import React from 'react';
import { AlertTriangle } from 'lucide-react';

const GlobalErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-500 mb-6">
          An unexpected error occurred. Our team has been notified. Please try refreshing the page or navigating back.
        </p>
        
        {/* Only show technical error in non-production environments if possible, but for hackathon keeping it visible is fine, or we can hide it */}
        {import.meta.env.DEV && (
          <div className="bg-slate-100 p-4 rounded-lg text-left overflow-auto mb-6 max-h-40 text-xs font-mono text-slate-700">
            {error.message}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Go Home
          </button>
          <button 
            onClick={resetErrorBoundary}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalErrorFallback;
