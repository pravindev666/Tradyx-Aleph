'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 border border-red-500/50">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500" size={32} />
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        </div>
        
        <p className="text-gray-300 mb-4">
          An error occurred while loading the dashboard. This could be due to:
        </p>
        
        <ul className="list-disc list-inside text-gray-400 mb-6 space-y-1 text-sm">
          <li>Network connectivity issues</li>
          <li>Data file not available</li>
          <li>Browser compatibility issue</li>
        </ul>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-gray-900 rounded p-3 mb-4 text-xs text-red-400 font-mono overflow-auto">
            {error.message}
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Home size={18} />
            Go home
          </Link>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            If the problem persists, please contact{' '}
            <a href="mailto:support@tradyx.in" className="text-blue-400 hover:underline">
              support@tradyx.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
