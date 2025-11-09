'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SafeAdWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Silently log error - don't break the dashboard
    if (process.env.NODE_ENV === 'development') {
      console.error('Ad component error (silently handled):', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Show a placeholder instead of returning null
      // This ensures the space is reserved and user knows something should be there
      return (
        <div className="w-full flex items-center justify-center" style={{ minHeight: '100px' }}>
          <div className="text-gray-400 text-xs opacity-50">Advertisement</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeAdWrapper;

